package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.service.BoardService;

@Controller
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/board")
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/main")
    public void main(PageRequestDTO pageRequestDTO, Model model) {

        model.addAttribute("recentList", boardService.getMainRecentList(pageRequestDTO).getRecentDtoList());
        model.addAttribute("popularList", boardService.getMainRecentList(pageRequestDTO).getPopularDtoList());
    }

    @GetMapping("/list/all")
    public void all(PageRequestDTO pageRequestDTO, Model model) {

        model.addAttribute("list", boardService.getList(pageRequestDTO));
    }

    @GetMapping("/list/popular")
    public void popular(PageRequestDTO pageRequestDTO, Model model) {

        model.addAttribute("popularList", boardService.getPopularList(pageRequestDTO));
    }

    @GetMapping("/read")
    public void read(@RequestParam("id") Long id, Model model) {

        model.addAttribute("board", boardService.read(id));
    }
}
