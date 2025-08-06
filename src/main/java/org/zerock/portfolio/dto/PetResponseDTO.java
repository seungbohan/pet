package org.zerock.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetResponseDTO {

    private List<PetPlaceImgDTO> imgList;
    private List<PetPlaceDTO> list;
}
