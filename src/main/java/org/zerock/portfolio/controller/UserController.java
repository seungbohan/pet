package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.zerock.portfolio.dto.ApiResponseDTO;
import org.zerock.portfolio.dto.BizDTO;
import org.zerock.portfolio.dto.BoardDTO;
import org.zerock.portfolio.dto.UserDTO;
import org.zerock.portfolio.repository.UserRepository;
import org.zerock.portfolio.service.UserService;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
//@RequestMapping("/api")
@Slf4j
public class UserController {


    @Autowired
    private final UserService userService;
    @Autowired
    private UserRepository userRepository;


    @GetMapping("/join/login")
    public void loginPage() {

    }

    @GetMapping("/join/signup")
    public void signupPage() {

    }

    @PostMapping("/api/join/signup/user")
    @ResponseBody
    public ResponseEntity<ApiResponseDTO> signup(@RequestBody UserDTO dto) {
        log.info("dto: " + dto);

        try {
            userService.register(dto);

            return ResponseEntity.ok(new ApiResponseDTO("회원가입이 완료되었습니다."));
        } catch (Exception e) {

            log.error("error: " + e.getMessage());

            return ResponseEntity.badRequest().body(new ApiResponseDTO(e.getMessage()));
        }
    }

    @PostMapping("/api/join/signup/biz")
    @ResponseBody
    public ResponseEntity<ApiResponseDTO> signupBiz(@RequestBody BizDTO dto) {
        log.info("dto: " + dto);

        try {
            userService.registerBiz(dto);

            return ResponseEntity.ok(new ApiResponseDTO("회원가입이 완료되었습니다."));
        } catch (Exception e) {

            log.error("error: " + e.getMessage());

            return ResponseEntity.badRequest().body(new ApiResponseDTO(e.getMessage()));
        }
    }
}
