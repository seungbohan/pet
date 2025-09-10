package org.zerock.portfolio.dto;

import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.zerock.portfolio.common.BoardLike;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Data
public class CombinedPageResultDTO<T extends BoardLike> {

    // 통합된 DTO 리스트
    private List<T> dtoList;

    // 총 페이지 번호
    private int totalPage;

    // 현재 페이지 번호
    private int page;

    // 목록 사이즈
    private int size;

    // 시작 페이지 번호, 끝 페이지 번호
    private int start, end;

    // 이전, 다음
    private boolean prev, next;

    // 페이지 번호 목록
    private List<Integer> pageList;

    // 생성자 - 두 개의 PageResultDTO를 합쳐서 하나로 만듦
    public CombinedPageResultDTO(PageResultDTO<? extends T, ?> result1,
                                 PageResultDTO<? extends T, ?> result2,
                                 PageRequestDTO pageRequestDTO) {

        // 두 리스트를 합침
        this.dtoList = new ArrayList<>();
        if (result1.getDtoList() != null) {
            this.dtoList.addAll((List<T>) result1.getDtoList());
        }
        if (result2.getDtoList() != null) {
            this.dtoList.addAll((List<T>) result2.getDtoList());
        }

        // 페이지 정보는 첫 번째 결과를 기준으로 설정 (또는 더 복잡한 로직 적용 가능)
        this.totalPage = Math.max(result1.getTotalPage(), result2.getTotalPage());
        this.page = pageRequestDTO.getPage();
        this.size = pageRequestDTO.getSize();

        makePageList();
    }

    // 단일 PageResultDTO와 추가 리스트를 합치는 생성자
    public CombinedPageResultDTO(PageResultDTO<? extends T, ?> mainResult,
                                 List<? extends T> additionalList) {

        this.dtoList = new ArrayList<>();
        if (mainResult.getDtoList() != null) {
            this.dtoList.addAll((List<T>) mainResult.getDtoList());
        }
        if (additionalList != null) {
            this.dtoList.addAll((List<T>) additionalList);
        }

        // 메인 결과의 페이지 정보 사용
        this.totalPage = mainResult.getTotalPage();
        this.page = mainResult.getPage();
        this.size = mainResult.getSize();
        this.start = mainResult.getStart();
        this.end = mainResult.getEnd();
        this.prev = mainResult.isPrev();
        this.next = mainResult.isNext();
        this.pageList = mainResult.getPageList();
    }

    // 페이지네이션 정보 생성
    private void makePageList() {
        int tempEnd = (int)(Math.ceil(page/10.0)) * 10;
        start = tempEnd - 9;
        prev = start > 1;
        end = tempEnd > totalPage ? totalPage : tempEnd;
        next = tempEnd < totalPage;
        pageList = IntStream.rangeClosed(start, end).boxed().collect(Collectors.toList());
    }
}