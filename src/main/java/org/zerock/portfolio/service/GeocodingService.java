package org.zerock.portfolio.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
@Log4j2
public class GeocodingService {

    @Value("${naver.maps.client-id:ufwzhw6j2z}")
    private String clientId;

    @Value("${naver.maps.client-secret:}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 주소를 좌표(경도, 위도)로 변환
     * @return double[] { mapx (longitude), mapy (latitude) } or null if failed
     */
    public double[] geocode(String address) {
        if (address == null || address.isBlank() || clientSecret.isBlank()) {
            return null;
        }

        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode")
                    .queryParam("query", address)
                    .build()
                    .toUriString();

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-NCP-APIGW-API-KEY-ID", clientId);
            headers.set("X-NCP-APIGW-API-KEY", clientSecret);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);

            if (response.getBody() != null) {
                List<Map<String, Object>> addresses = (List<Map<String, Object>>) response.getBody().get("addresses");
                if (addresses != null && !addresses.isEmpty()) {
                    Map<String, Object> first = addresses.get(0);
                    double lng = Double.parseDouble(first.get("x").toString());
                    double lat = Double.parseDouble(first.get("y").toString());
                    log.info("Geocoded '{}' -> ({}, {})", address, lng, lat);
                    return new double[]{lng, lat};
                }
            }
            log.warn("Geocoding returned no results for: {}", address);
        } catch (Exception e) {
            log.error("Geocoding failed for: {} - {}", address, e.getMessage());
        }
        return null;
    }
}
