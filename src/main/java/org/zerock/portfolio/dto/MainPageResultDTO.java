package org.zerock.portfolio.dto;

import com.sun.tools.javac.Main;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Builder
@AllArgsConstructor
@Data
public class MainPageResultDTO<DTO, EN> {

    private List<DTO> recentDtoList;

    private List<DTO> popularDtoList;

    public MainPageResultDTO(Page<EN> recent, Page<EN> popular, Function<EN, DTO> fn ) {

        recentDtoList = recent.stream().map(fn).collect(Collectors.toList());

        popularDtoList = popular.stream().map(fn).collect(Collectors.toList());
    }
}
