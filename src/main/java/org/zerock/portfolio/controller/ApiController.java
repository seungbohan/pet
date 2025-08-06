package org.zerock.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.zerock.portfolio.dto.PetPlaceDTO;
import org.zerock.portfolio.dto.PetPlaceImgDTO;
import org.zerock.portfolio.dto.PetResponseDTO;
import org.zerock.portfolio.service.ApiPetPlaceService;
import org.zerock.portfolio.service.PetPlaceSyncService;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ApiController {

    private final ApiPetPlaceService apiPetPlaceService;
    private final PetPlaceSyncService petPlaceSyncService;

    @GetMapping("/petplaces")
    public ResponseEntity<Map<String ,Object>> petPlace() throws Exception {

        petPlaceSyncService.sync();

        Map<String ,Object> result = new HashMap<>();

        List<PetPlaceDTO> list = apiPetPlaceService.getAllPetPlace();
        List<PetPlaceImgDTO> imgList = apiPetPlaceService.getAllPetPlaceImg();

        result.put("list",list);
        result.put("imgList",imgList);

        return ResponseEntity.ok(result);
    }

//        try {
//            List<PetPlaceDTO> list = apiPetPlaceService.fetchAllPetPlace();
//            List<PetPlaceImgDTO> imgList = apiPetPlaceServi
////            log.error("error: " + e.getMessage());
////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)ce.fetchAllPetPlaceImg(list);
//            log.info("list: " + list);
//            log.info("imgList: " + imgList);
//            Map<String,Object> result = new HashMap<>();
//            result.put("list",list);
//            result.put("imgList",imgList);
//            log.info("result: " + result);
//            return ResponseEntity.ok(result);
//        } catch (Exception e) {.body(Collections.emptyMap());
//        }
//    }
}