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
import org.zerock.portfolio.dto.BoardDTO;
import org.zerock.portfolio.dto.UserCountDTO;
import org.zerock.portfolio.service.AdminDashboardService;
import org.zerock.portfolio.service.BoardService;

@Controller
@Log4j2
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/admin/dashboard")
    public String admin(Model model) {

        UserCountDTO userCountDTO = adminDashboardService.userCount();
        log.info("userCountDTO: " + userCountDTO);
        model.addAttribute("userCount", userCountDTO);
        model.addAttribute("boardCount", adminDashboardService.boardCount());
        model.addAttribute("reviewCount", adminDashboardService.reviewCount());

        return "admin/dashboard";
    }

    @GetMapping("/api/admin/dashboard")
    @ResponseBody
    public ResponseEntity<String> apiAdminDashboard() {

        log.info("apiAdminDashboard");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("auth: " + auth);

        if (auth == null || auth.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN") )) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 없음");
        }

        return ResponseEntity.ok("권한 있음");
    }

    @GetMapping("/admin/register")
    public void register() {

    }

    @GetMapping("/api/admin/register")
    public ResponseEntity<String> apiAdminRegister() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth==null || auth.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN") )) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 없음");
        }

        return ResponseEntity.ok("권한 있음");
    }

    @PostMapping("/api/admin/register/board")
    @ResponseBody
    public ResponseEntity<Long> apiAdminRegisterBoard(@RequestBody BoardDTO boardDTO) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth==null || auth.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN") )) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        log.info("boardDTO: " + boardDTO);
        
        Long id = adminDashboardService.register(boardDTO);
        
        return ResponseEntity.ok(id);
    }
}
