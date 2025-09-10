package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.zerock.portfolio.dto.*;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.ImageEntity;
import org.zerock.portfolio.entity.PetPlaceEntity;
import org.zerock.portfolio.entity.PetPlaceImgEntity;
import org.zerock.portfolio.repository.PetPlaceImgRepository;
import org.zerock.portfolio.repository.PetPlaceRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class PetPlaceServiceImpl implements PetPlaceService{

    private final PetPlaceRepository petPlaceRepository;
    private final PetPlaceImgRepository petPlaceImgRepository;

    @Override
    public PetPlaceDTO read(Long id) {

        List<Object[]> result = petPlaceRepository.getPetPlaceWithReview(id);

        PetPlaceEntity petPlaceEntity = (PetPlaceEntity) result.get(0)[0];
        petPlaceEntity.setTel(petPlaceEntity.getTel().replace(".", "-"));
        List<PetPlaceImgEntity> imageList = new ArrayList<>();
        result.forEach(arr -> {
            PetPlaceImgEntity petPlaceImgEntity = (PetPlaceImgEntity) arr[1];
            imageList.add(petPlaceImgEntity);
        });

        Double avg = (Double) result.get(0)[2];

        Long reviewCnt = (Long) result.get(0)[3];

        log.info("===========" + petPlaceEntity.getTel());

        return entitiesToDto(petPlaceEntity, imageList, avg, reviewCnt);
    }

    @Override
    public PageResultDTO<PetPlaceDTO, Object[]> getList(PageRequestDTO pageRequestDTO) {

        Pageable pageable = pageRequestDTO.getPageable(Sort.by("id").descending());

        Page<Object[]> result = petPlaceRepository.getListPage(pageable);

        Function<Object[], PetPlaceDTO> fn = (arr -> entitiesToDto(
                (PetPlaceEntity) arr[0],
                (List<PetPlaceImgEntity>)(Arrays.asList((PetPlaceImgEntity) arr[1])),
                (Double) arr[2],
                (Long) arr[3]
        ));

        return new PageResultDTO<>(result, fn);
    }

    @Override
    public PageResultDTO<PetPlaceDTO, Object[]> getPopularList(PageRequestDTO pageRequestDTO) {

        Pageable pageable = pageRequestDTO.getPageable(Sort.unsorted());

        Page<Object[]> result = petPlaceRepository.getPopularListPage(pageable);

        Function<Object[], PetPlaceDTO> fn = (arr -> entitiesToDto(
                (PetPlaceEntity) arr[0],
                (List<PetPlaceImgEntity>)(Arrays.asList((PetPlaceImgEntity) arr[1])),
                (Double) arr[2],
                (Long) arr[3]
        ));

        return new PageResultDTO<>(result, fn);
    }


    @Override
    public MainPageResultDTO<PetPlaceDTO, Object[]> getMainRecentList(PageRequestDTO pageRequestDTO) {
        Pageable recentPageable = pageRequestDTO.getPageable(Sort.by("id").descending());

        // 인기 게시글은 정렬 제거하고 내부 쿼리에서 정렬함
        Pageable popularPageable = pageRequestDTO.getPageable(Sort.unsorted());

        Page<Object[]> recent = petPlaceRepository.getListPage(recentPageable);
        Page<Object[]> popular = petPlaceRepository.getPopularListPage(popularPageable);

        Function<Object[], PetPlaceDTO> fn = (arr -> entitiesToDto(
                (PetPlaceEntity) arr[0],
                (List<PetPlaceImgEntity>)(Arrays.asList((PetPlaceImgEntity) arr[1])),
                (Double) arr[2],
                (Long) arr[3]
        ));

        return new MainPageResultDTO<>(recent, popular, fn);
    }

    @Override
    public List<PetPlaceDTO> getMapList() {

        List<PetPlaceDTO> petPlaceDTOList = petPlaceRepository.findAll()
                .stream().map(this::entityToDto).collect(Collectors.toList());

        List<PetPlaceImgEntity> imgList = petPlaceImgRepository.findAll()
                .stream().collect(Collectors.toList());

        return petPlaceDTOList;
    }
}
