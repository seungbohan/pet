package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.*;
import org.zerock.portfolio.repository.UserRepository;
import org.zerock.portfolio.security.util.JWTUtil;
import org.zerock.portfolio.service.ApiPetPlaceServiceImpl;
import org.zerock.portfolio.service.BoardService;
import org.zerock.portfolio.service.PetPlaceService;
import org.zerock.portfolio.service.UserService;

@Controller
@Log4j2
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;
    private final UserService userService;
    private final ApiPetPlaceServiceImpl apiPetPlaceService;
    private final PetPlaceService petPlaceService;

    @GetMapping("/")
    public String index() {
        return "main";
    }

    @GetMapping("/board/main")
    public void main(PageRequestDTO pageRequestDTO, Model model) {

        MainPageResultDTO<BoardDTO, Object[]> boardResult = boardService.getMainRecentList(pageRequestDTO);
        model.addAttribute("recentList", boardResult.getRecentDtoList());
        model.addAttribute("popularList", boardResult.getPopularDtoList());
    }

    @GetMapping("/board/list/all")
    public void all(PageRequestDTO pageRequestDTO, Model model) {

        PageResultDTO<BoardDTO, Object[]> boardResult = boardService.getList(pageRequestDTO);
        log.info("allList" + boardResult);

        model.addAttribute("allList", boardResult);
    }

    @GetMapping("/board/list/popular")
    public void popular(PageRequestDTO pageRequestDTO, Model model) {

        PageResultDTO<BoardDTO, Object[]> boardResult = boardService.getPopularList(pageRequestDTO);

        log.info("popularList" + boardResult);

        model.addAttribute("popularList", boardResult);
    }

    @GetMapping("/board/read")
    public void read(@RequestParam("id") Long id, Model model) {

        BoardDTO item = boardService.read(id);
        model.addAttribute("item", item);
    }

    @GetMapping("/board/write")
    public void write() {

    }

    @GetMapping("/api/board/write")
    @ResponseBody
    public ResponseEntity<?> apiWrite() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_USER") )) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 없음");
        }

        return ResponseEntity.ok("권한 있음");
    }

    @PostMapping("/api/board/write")
    @ResponseBody
    public ResponseEntity<Long> apiWrite(@RequestBody BoardDTO boardDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication==null || authentication.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_USER") )) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        log.info("boardDTO: " + boardDTO);

        Long id = boardService.register(boardDTO);

        return ResponseEntity.ok(id);
    }

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
}
