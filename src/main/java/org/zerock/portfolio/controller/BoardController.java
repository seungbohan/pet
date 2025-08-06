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
import org.zerock.portfolio.service.ApiPetPlaceServiceImpl;
import org.zerock.portfolio.service.BoardService;
import org.zerock.portfolio.service.UserService;

import java.util.Optional;

@Controller
@Log4j2
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;
    private final UserService userService;
    private final ApiPetPlaceServiceImpl apiPetPlaceService;

    @GetMapping("/")
    public String index() {
        return "redirect:/board/main";
    }
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
//
//    @GetMapping("/board/petplaces")
//    public void petplaces(@RequestParam("id") Long id, Model model) {
//        model.addAttribute("petplaces",apiPetPlaceService.getAllPetPlace());
//        model.addAttribute("petplacesimg",apiPetPlaceService.getAllPetPlaceImg());
//    }

    @GetMapping("/board/mypage/user")
    public void pageUser() {

    }

    @GetMapping("/api/mypage/user")
    @ResponseBody
    public ResponseEntity<?> apiUserCheck() {

        log.info("apiBizCheck");
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("auth: " + auth);
        if (auth == null || auth.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_USER") || a.getAuthority().equals("ROLE_ADMIN") )) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 없음");
        }

        UserDTO dto = userService.findUser(auth.getPrincipal().toString());

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/api/mypage/user/modify")
    @ResponseBody
    public ResponseEntity<String> apiUserModify(@RequestBody UserDTO dto) {
        log.info("dto: " + dto);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth==null || auth.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_USER") || a.getAuthority().equals("ROLE_ADMIN") )) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("사용자 없음");
        }

        String email = auth.getPrincipal().toString();
        log.info("email: " + email);

        userService.modify(email, dto);

        return ResponseEntity.ok("수정 완료");
    }

    @DeleteMapping("/api/mypage/user/delete")
    @ResponseBody
    public ResponseEntity<String> apiUserDelete() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getPrincipal().toString();

        userService.delete(email);
        return ResponseEntity.ok("탈퇴 완료");
    }

    @GetMapping("/board/petplaces")
    public void petplaces() {

    }
}
