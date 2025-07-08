package org.zerock.portfolio.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.zerock.portfolio.dto.BoardDTO;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.UserDTO;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.repository.UserRepository;
import org.zerock.portfolio.security.util.JWTUtil;
import org.zerock.portfolio.service.BoardService;

@Controller
@Log4j2
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;

    @GetMapping("/board/main")
    public void main(PageRequestDTO pageRequestDTO, Model model) {

        model.addAttribute("recentList", boardService.getMainRecentList(pageRequestDTO).getRecentDtoList());
        model.addAttribute("popularList", boardService.getMainRecentList(pageRequestDTO).getPopularDtoList());
    }

    @GetMapping("/board/list/all")
    public void all(PageRequestDTO pageRequestDTO, Model model) {

        model.addAttribute("list", boardService.getList(pageRequestDTO));
    }

    @GetMapping("/board/list/popular")
    public void popular(PageRequestDTO pageRequestDTO, Model model) {

        model.addAttribute("popularList", boardService.getPopularList(pageRequestDTO));
    }

    @GetMapping("/board/read")
    public void read(@RequestParam("id") Long id, Model model) {

        model.addAttribute("board", boardService.read(id));
    }

    @GetMapping("/board/mypage/biz")
    public void showBizPage() {

    }

    @PostMapping("/board/mypage/biz")
    public String register(BoardDTO boardDTO, RedirectAttributes redirectAttributes) {

        Long id = boardService.register(boardDTO);

        redirectAttributes.addAttribute("id", id);

        return "redirect:/board/list/all";
    }

    @GetMapping("/api/mypage/biz")
    @ResponseBody
    public ResponseEntity<String> apiBizCheck() {

        log.info("apiBizCheck");
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("auth: " + auth);
        if (auth == null || auth.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_BIZ") )) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 없음");
        }

        return ResponseEntity.ok("권한 있음");
    }

}
