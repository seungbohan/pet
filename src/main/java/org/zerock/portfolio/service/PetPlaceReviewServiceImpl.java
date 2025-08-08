package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.zerock.portfolio.dto.BoardReviewDTO;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.PageResultDTO;
import org.zerock.portfolio.dto.PetPlaceReviewDTO;
import org.zerock.portfolio.entity.BoardReviewEntity;
import org.zerock.portfolio.entity.PetPlaceReviewEntity;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.repository.PetPlaceReviewRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.util.Optional;
import java.util.function.Function;

@Service
@Log4j2
@RequiredArgsConstructor
public class PetPlaceReviewServiceImpl implements PetPlaceReviewService{

    private final PetPlaceReviewRepository petPlaceReviewRepository;

    private final UserRepository userRepository;

    @Override
    public PageResultDTO<PetPlaceReviewDTO, PetPlaceReviewEntity> getList(Long petPlaceId, PageRequestDTO pageRequestDTO) {

        pageRequestDTO.setSize(5);

        Pageable pageable = pageRequestDTO.getPageable(Sort.by("id").descending());

        Page<PetPlaceReviewEntity> result = petPlaceReviewRepository.findByPetPlace_id(petPlaceId, pageable);

        log.info("reviewEntity" + result.getContent());
        Function<PetPlaceReviewEntity, PetPlaceReviewDTO> fn = (entity -> entityToDto(entity));

        return new PageResultDTO<>(result, fn);
    }

    @Override
    public Long register(PetPlaceReviewDTO petPlaceReviewDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Optional<UserEntity> user = userRepository.findByEmail(email, false);

        if(!user.isPresent()) {

            log.info("user not found");

            throw new RuntimeException("Check Email or Social");
        }

        PetPlaceReviewEntity reviewEntity = dtoToEntity(petPlaceReviewDTO);
        reviewEntity.setUser(user.get());

        petPlaceReviewRepository.save(reviewEntity);
        return reviewEntity.getId();
    }

    @Override
    public void modify(PetPlaceReviewDTO petPlaceReviewDTO) {

        Optional<PetPlaceReviewEntity> reviewEntity = petPlaceReviewRepository.findById(petPlaceReviewDTO.getId());

        if(reviewEntity.isPresent()) {
            PetPlaceReviewEntity entity = reviewEntity.get();
            entity.changeContent(petPlaceReviewDTO.getContent());
            entity.changeRating(petPlaceReviewDTO.getRating());

            petPlaceReviewRepository.save(entity);
        }
    }

    @Override
    public void remove(Long id) {
        petPlaceReviewRepository.deleteById(id);
    }
}
