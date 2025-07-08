package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.zerock.portfolio.dto.UserCountDTO;
import org.zerock.portfolio.entity.UserRole;
import org.zerock.portfolio.repository.BoardRepository;
import org.zerock.portfolio.repository.ReviewRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.util.List;

@Service
@Log4j2
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService{

    private final BoardRepository boardRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @Override
    public Long boardCount() {

        Long boardCount = boardRepository.count();

        return boardCount;
    }

    @Override
    public Long reviewCount() {

        Long reviewCount = reviewRepository.count();

        return reviewCount;
    }

    @Override
    public UserCountDTO userCount() {

        Long total = userRepository.count();

        Long userCount = userRepository.countByRole(UserRole.USER);

        Long bizCount = userRepository.countByRole(UserRole.BIZ);

        return new UserCountDTO(total, userCount, bizCount);
    }
}
