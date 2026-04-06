package org.zerock.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
}
