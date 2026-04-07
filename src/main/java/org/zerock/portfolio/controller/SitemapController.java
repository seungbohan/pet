package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.portfolio.repository.PetPlaceRepository;
import org.zerock.portfolio.repository.FeedRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequiredArgsConstructor
public class SitemapController {

    private final PetPlaceRepository petPlaceRepository;
    private final FeedRepository feedRepository;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> sitemap() {
        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        String today = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE);

        // Static pages
        sb.append(url("https://withpet.shop/", today, "daily", "1.0"));
        sb.append(url("https://withpet.shop/map", today, "daily", "0.9"));
        sb.append(url("https://withpet.shop/feeds", today, "daily", "0.8"));

        // Place detail pages
        petPlaceRepository.findAll().forEach(place -> {
            String lastmod = place.getModDate() != null
                    ? place.getModDate().format(DateTimeFormatter.ISO_DATE)
                    : today;
            sb.append(url("https://withpet.shop/places/" + place.getId(), lastmod, "weekly", "0.7"));
        });

        // Feed detail pages
        feedRepository.findAll().forEach(feed -> {
            String lastmod = feed.getModDate() != null
                    ? feed.getModDate().format(DateTimeFormatter.ISO_DATE)
                    : today;
            sb.append(url("https://withpet.shop/feeds/" + feed.getId(), lastmod, "weekly", "0.6"));
        });

        sb.append("</urlset>");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_XML)
                .body(sb.toString());
    }

    private String url(String loc, String lastmod, String changefreq, String priority) {
        return "<url><loc>" + loc + "</loc><lastmod>" + lastmod + "</lastmod><changefreq>"
                + changefreq + "</changefreq><priority>" + priority + "</priority></url>\n";
    }
}
