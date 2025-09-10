package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.zerock.portfolio.dto.PetPlaceDTO;
import org.zerock.portfolio.service.PetPlaceService;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Log4j2
public class MapController {

    private final PetPlaceService petPlaceService;

    @GetMapping("/map")
    public void map() {

    }

    @GetMapping("/api/map")
    @ResponseBody
    public ResponseEntity<List<PetPlaceDTO>> apiMap() {

        List<PetPlaceDTO> petPlaceDTOList = petPlaceService.getMapList();
        return ResponseEntity.ok(petPlaceDTOList);
    }

    @GetMapping("/api/map/detail/{id}")
    @ResponseBody
    public ResponseEntity<PetPlaceDTO> apiMapDetail(@PathVariable Long id) {
        try {
            PetPlaceDTO petPlaceDTO = petPlaceService.read(id);
            return ResponseEntity.ok(petPlaceDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
