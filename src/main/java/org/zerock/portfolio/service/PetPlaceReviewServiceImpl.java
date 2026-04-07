package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.PageResultDTO;
import org.zerock.portfolio.dto.PetPlaceReviewDTO;
import org.zerock.portfolio.dto.request.ReviewRequest;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.ReviewResponse;
import org.zerock.portfolio.entity.PetPlaceEntity;
import org.zerock.portfolio.entity.PetPlaceReviewEntity;
import org.zerock.portfolio.entity.ReviewTagEntity;
import org.zerock.portfolio.entity.TagDefinitionEntity;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.repository.PetPlaceRepository;
import org.zerock.portfolio.repository.PetPlaceReviewRepository;
import org.zerock.portfolio.repository.ReviewTagRepository;
import org.zerock.portfolio.repository.TagDefinitionRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PetPlaceReviewServiceImpl implements PetPlaceReviewService {

    private final PetPlaceReviewRepository petPlaceReviewRepository;
    private final PetPlaceRepository petPlaceRepository;
    private final UserRepository userRepository;
    private final TagDefinitionRepository tagDefinitionRepository;
    private final ReviewTagRepository reviewTagRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResultDTO<PetPlaceReviewDTO, PetPlaceReviewEntity> getList(Long petPlaceId, PageRequestDTO pageRequestDTO) {

        pageRequestDTO.setSize(5);

        Pageable pageable = pageRequestDTO.getPageable(Sort.by("id").descending());

        Page<PetPlaceReviewEntity> result = petPlaceReviewRepository.findByPetPlace_id(petPlaceId, pageable);

        log.info("reviewEntity" + result.getContent());
        Function<PetPlaceReviewEntity, PetPlaceReviewDTO> fn = (entity -> entityToDto(entity));

        return new PageResultDTO<>(result, fn);
    }

    @Override
    @Transactional
    public Long register(PetPlaceReviewDTO petPlaceReviewDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Optional<UserEntity> user = userRepository.findByEmail(email);

        if (!user.isPresent()) {

            log.info("user not found");

            throw new RuntimeException("Check Email or Social");
        }

        PetPlaceReviewEntity reviewEntity = dtoToEntity(petPlaceReviewDTO);
        reviewEntity.setUser(user.get());

        petPlaceReviewRepository.save(reviewEntity);
        return reviewEntity.getId();
    }

    @Override
    @Transactional
    public void modify(PetPlaceReviewDTO petPlaceReviewDTO) {

        Optional<PetPlaceReviewEntity> reviewEntity = petPlaceReviewRepository.findById(petPlaceReviewDTO.getId());

        if (reviewEntity.isPresent()) {
            PetPlaceReviewEntity entity = reviewEntity.get();
            entity.changeContent(petPlaceReviewDTO.getContent());

            petPlaceReviewRepository.save(entity);
        }
    }

    @Override
    @Transactional
    public void remove(Long id) {
        petPlaceReviewRepository.deleteById(id);
    }

    // New API-compatible methods

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getListResponse(Long petPlaceId, int page) {
        PageRequest pageable = PageRequest.of(page, 5, Sort.by("id").descending());
        Page<PetPlaceReviewEntity> result = petPlaceReviewRepository.findByPetPlace_id(petPlaceId, pageable);

        List<ReviewResponse> content = result.getContent().stream()
                .map(this::toReviewResponse)
                .collect(Collectors.toList());

        return PageResponse.<ReviewResponse>builder()
                .content(content)
                .page(page)
                .size(5)
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();
    }

    @Override
    @Transactional
    public Long registerWithResponse(Long placeId, ReviewRequest request, String email) {
        UserEntity user = null;
        if (email != null) {
            user = userRepository.findByEmail(email).orElse(null);
        }
        PetPlaceEntity place = petPlaceRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("장소를 찾을 수 없습니다."));

        PetPlaceReviewEntity review = PetPlaceReviewEntity.builder()
                .content(request.getContent())
                .rating(request.getRating())
                .user(user)
                .guestName(user == null ? request.getGuestName() : null)
                .petPlace(place)
                .build();

        petPlaceReviewRepository.save(review);

        // Save review tags
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            for (Long tagId : request.getTagIds()) {
                TagDefinitionEntity tag = tagDefinitionRepository.findById(tagId).orElse(null);
                if (tag != null) {
                    ReviewTagEntity reviewTag = ReviewTagEntity.builder()
                            .review(review)
                            .tag(tag)
                            .build();
                    reviewTagRepository.save(reviewTag);
                }
            }
        }

        return review.getId();
    }

    @Override
    @Transactional
    public void modifyWithResponse(Long id, ReviewRequest request, String email) {
        PetPlaceReviewEntity review = petPlaceReviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));

        if (!review.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        review.changeContent(request.getContent());
    }

    @Override
    @Transactional
    public void removeWithResponse(Long id, String email) {
        PetPlaceReviewEntity review = petPlaceReviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));

        if (!review.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }

        petPlaceReviewRepository.delete(review);
    }

    private ReviewResponse toReviewResponse(PetPlaceReviewEntity entity) {
        List<ReviewTagEntity> reviewTags = reviewTagRepository.findByReviewId(entity.getId());
        List<String> tagNames = reviewTags.stream()
                .map(rt -> rt.getTag().getName())
                .collect(Collectors.toList());

        return ReviewResponse.builder()
                .id(entity.getId())
                .content(entity.getContent())
                .rating(entity.getRating())
                .writerName(entity.getUser() != null ? entity.getUser().getName() : (entity.getGuestName() != null ? entity.getGuestName() : "비회원"))
                .writerEmail(entity.getUser() != null ? entity.getUser().getEmail() : "")
                .tags(tagNames)
                .regDate(entity.getRegDate())
                .modDate(entity.getModDate())
                .build();
    }
}
