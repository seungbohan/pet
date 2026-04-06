package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.portfolio.entity.TagDefinitionEntity;
import org.zerock.portfolio.repository.TagDefinitionRepository;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagDefinitionRepository tagDefinitionRepository;

    @GetMapping
    public ResponseEntity<List<TagDefinitionEntity>> getAllTags() {
        return ResponseEntity.ok(tagDefinitionRepository.findAll());
    }
}
