package org.zerock.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;


import java.util.HashSet;
import java.util.Set;

// [SECURITY] @Setter 제거 - Mass Assignment 방지 (HIGH-5 수정)
// 필요한 변경은 명시적 메서드로만 허용
@Entity
@Getter
@ToString(exclude = {"password"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String name;

    private boolean fromSocial;

    private String profileImageUrl;

    private String introduce;

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private Set<UserRole> roleSet = new HashSet<>();

    public void addUserRole(UserRole role) {
        roleSet.add(role);
    }

    public void changeName(String name) {
        this.name = name;
    }

    public void changeIntroduce(String introduce) {
        this.introduce = introduce;
    }

    public void changeProfileImageUrl(String url) {
        this.profileImageUrl = url;
    }

    // [SECURITY] 비밀번호 변경은 별도 메서드로만 가능
    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
}
