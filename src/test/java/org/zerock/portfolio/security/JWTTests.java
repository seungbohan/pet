package org.zerock.portfolio.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.zerock.portfolio.security.util.JWTUtil;

public class JWTTests {

    private JWTUtil jwtUtil;

    @BeforeEach
    public void testBefore() {

        System.out.println("testBefore");
        jwtUtil = new JWTUtil();
    }

//    @Test
//    public void testEncode() throws Exception {
//
//        String email = "user95@zerock.org";
//
//        String str = jwtUtil.generateToken(email,role);
//
//        System.out.println(str);
//    }

//    @Test
//    public void testValidate() throws Exception {
//
//        String email = "user95@zerock.org";
//
//        String str = jwtUtil.generateToken(email);
//
//        Thread.sleep(5000);
//
//        String resultEmail = jwtUtil.validateAndExtract(str);
//
//        System.out.println(resultEmail);
//    }
}
