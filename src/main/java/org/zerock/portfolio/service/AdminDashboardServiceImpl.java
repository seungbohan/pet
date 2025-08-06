package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.dto.BoardDTO;
import org.zerock.portfolio.dto.UserCountDTO;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.ImageEntity;
import org.zerock.portfolio.entity.UserRole;
import org.zerock.portfolio.repository.BoardRepository;
import org.zerock.portfolio.repository.ImageRepository;
import org.zerock.portfolio.repository.BoardReviewRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.util.List;
import java.util.Map;

@Service
@Log4j2
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService{

    private final BoardRepository boardRepository;
    private final BoardReviewRepository boardReviewRepository;
    private final UserRepository userRepository;
    private final ImageRepository imageRepository;

    @Override
    public Long boardCount() {

        Long boardCount = boardRepository.count();

        return boardCount;
    }

    @Override
    public Long reviewCount() {

        Long reviewCount = boardReviewRepository.count();

        return reviewCount;
    }

    @Override
    public UserCountDTO userCount() {

        Long total = userRepository.count();

        Long userCount = userRepository.countByRole(UserRole.USER);

        Long bizCount = userRepository.countByRole(UserRole.BIZ);

        return new UserCountDTO(total, userCount, bizCount);
    }

    @Transactional
    @Override
    public Long register(BoardDTO boardDTO) {

        Map<String ,Object> entityMap = dtoToEntity(boardDTO);

        BoardEntity boardEntity = (BoardEntity) entityMap.get("board");

        List<ImageEntity> imageList = (List<ImageEntity>) entityMap.get("imageList");
        if (imageList == null) {
            imageList = List.of();
        }
        boardRepository.save(boardEntity);

        imageList.forEach(imageEntity -> imageRepository.save(imageEntity));

        return boardEntity.getId();
    }
}
