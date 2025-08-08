package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.dto.PetPlaceDTO;
import org.zerock.portfolio.dto.PetPlaceImgDTO;
import org.zerock.portfolio.entity.PetPlaceEntity;
import org.zerock.portfolio.entity.PetPlaceImgEntity;
import org.zerock.portfolio.entity.SyncLog;
import org.zerock.portfolio.repository.PetPlaceImgRepository;
import org.zerock.portfolio.repository.PetPlaceRepository;
import org.zerock.portfolio.repository.SyncLogRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PetPlaceSyncService {

    private final ApiPetPlaceService apiPetPlaceService;
    private final PetPlaceRepository petPlaceRepository;
    private final PetPlaceImgRepository petPlaceImgRepository;
    private final SyncLogRepository syncLogRepository;

    @Transactional
    @Scheduled(cron = "0 0 12 1 * *")
    public void sync() throws Exception {

        List<PetPlaceDTO> list = apiPetPlaceService.fetchAllPetPlace();
        List<PetPlaceImgDTO> imgList = apiPetPlaceService.fetchAllPetPlaceImg(list);
        List<PetPlaceEntity> entityList = new ArrayList<>();
        List<PetPlaceImgEntity> imgEntityList = new ArrayList<>();

        for (PetPlaceDTO dto : list) {

            if (!petPlaceRepository.existsByContentid(dto.getContentid())) {

                entityList.add(PetPlaceEntity.builder()
                        .contentid(dto.getContentid())
                        .contenttypeid(dto.getContenttypeid())
                        .tel(dto.getTel())
                        .addr1(dto.getAddr1())
                        .title(dto.getTitle())
                        .mapx(dto.getMapx())
                        .mapy(dto.getMapy())
                        .build());
            }
        }
        if (!entityList.isEmpty()) {
            petPlaceRepository.saveAll(entityList);
        }

        for (PetPlaceImgDTO dto : imgList) {

            if (!petPlaceImgRepository.existsByContentidAndOriginimgurl(dto.getContentid(), dto.getOriginimgurl())) {
                Optional<PetPlaceEntity> entity = petPlaceRepository.findByContentid(dto.getContentid());
                if (entity.isPresent()) {

                    imgEntityList.add(PetPlaceImgEntity.builder()
                            .contentid(dto.getContentid())
                            .originimgurl(dto.getOriginimgurl())
                            .imgname(dto.getImgname())
                            .petPlace(entity.get())
                            .build());
                }
            }
        }
        if (!imgEntityList.isEmpty()) {

            petPlaceImgRepository.saveAll(imgEntityList);
        }
    }
}
