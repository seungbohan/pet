package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.dto.PetPlaceDTO;
import org.zerock.portfolio.dto.PetPlaceImgDTO;
import org.zerock.portfolio.entity.AreaCodeUtil;
import org.zerock.portfolio.entity.PlaceCategory;
import org.zerock.portfolio.entity.PetPlaceEntity;
import org.zerock.portfolio.entity.PetPlaceImgEntity;
import org.zerock.portfolio.entity.SyncLog;
import org.zerock.portfolio.repository.PetPlaceImgRepository;
import org.zerock.portfolio.repository.PetPlaceRepository;
import org.zerock.portfolio.repository.SyncLogRepository;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
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
        syncPlaces();
        syncImages();
    }

    @Transactional
    public void syncPlaces() throws Exception {
        List<PetPlaceDTO> list = apiPetPlaceService.fetchAllPetPlace();
        List<PetPlaceEntity> entityList = new ArrayList<>();

        for (PetPlaceDTO dto : list) {
            if (!petPlaceRepository.existsByContentid(dto.getContentid())) {
                // Derive areacode from address when the API returns it empty
                String areacode = dto.getAreacode();
                if (areacode == null || areacode.isEmpty()) {
                    areacode = AreaCodeUtil.fromAddress(dto.getAddr1());
                }

                entityList.add(PetPlaceEntity.builder()
                        .contentid(dto.getContentid())
                        .contenttypeid(dto.getContenttypeid())
                        .tel(dto.getTel())
                        .addr1(dto.getAddr1())
                        .title(dto.getTitle())
                        .mapx(dto.getMapx())
                        .mapy(dto.getMapy())
                        .firstimage(dto.getFirstimage())
                        .firstimage2(dto.getFirstimage2())
                        .areacode(areacode)
                        .sigungucode(dto.getSigungucode())
                        .zipcode(dto.getZipcode())
                        .category(PlaceCategory.classify(dto.getContenttypeid(), dto.getTitle()))
                        .build());
            }
        }
        if (!entityList.isEmpty()) {
            petPlaceRepository.saveAll(entityList);
        }
    }

    @Transactional
    public void syncImages() throws Exception {
        List<PetPlaceDTO> list = apiPetPlaceService.fetchAllPetPlace();
        List<PetPlaceImgDTO> imgList = apiPetPlaceService.fetchAllPetPlaceImg(list);
        List<PetPlaceImgEntity> imgEntityList = new ArrayList<>();

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

    @Transactional
    public void updateExistingPlaces() throws Exception {
        List<PetPlaceDTO> list = apiPetPlaceService.fetchAllPetPlace();
        int updated = 0;
        for (PetPlaceDTO dto : list) {
            Optional<PetPlaceEntity> existing = petPlaceRepository.findByContentid(dto.getContentid());
            if (existing.isPresent()) {
                PetPlaceEntity entity = existing.get();
                boolean changed = false;

                // Update images/area if missing
                if (entity.getFirstimage() == null && dto.getFirstimage() != null) {
                    entity.setFirstimage(dto.getFirstimage());
                    entity.setFirstimage2(dto.getFirstimage2());
                    entity.setAreacode(dto.getAreacode());
                    entity.setSigungucode(dto.getSigungucode());
                    entity.setZipcode(dto.getZipcode());
                    changed = true;
                }

                // Fix empty areacode from address
                if ((entity.getAreacode() == null || entity.getAreacode().isEmpty()) && entity.getAddr1() != null) {
                    String derivedCode = AreaCodeUtil.fromAddress(entity.getAddr1());
                    if (!derivedCode.isEmpty()) {
                        entity.setAreacode(derivedCode);
                        changed = true;
                    }
                }

                // Always reclassify category based on title keywords
                PlaceCategory newCategory = PlaceCategory.classify(dto.getContenttypeid(), dto.getTitle());
                if (entity.getCategory() != newCategory) {
                    entity.setCategory(newCategory);
                    changed = true;
                }

                if (changed) updated++;
            }
        }
        log.info("Updated {} existing places", updated);
    }
}
