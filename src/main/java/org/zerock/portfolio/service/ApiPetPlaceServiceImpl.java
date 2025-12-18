//package org.zerock.portfolio.service;
//
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.web.util.UriComponentsBuilder;
//import org.zerock.portfolio.dto.PetPlaceDTO;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Slf4j
//@Service
//public class ApiPetPlaceServiceImpl implements ApiPetPlaceService{
//
//    @Value("${api.serviceKey}")
//    private String serviceKey;
//    private final String mobileOS   = "ETC";
//    private final String mobileApp  = "WithPet";
//    private static final String BASE_URL = "http://apis.data.go.kr/B551011/KorPetTourService";
//
//    private final RestTemplate restTemplate = new RestTemplate();
//    private final ObjectMapper objectMapper = new ObjectMapper();
//
//
//
//
//    @Override
//    public List<PetPlaceDTO> fetchAllPetPlace() throws Exception {
//        log.info("fetchAllPetPlace");
//
//        //전체 건수 조회
//        String countUrl = UriComponentsBuilder.fromHttpUrl(BASE_URL)
//                .path("/petTourSyncList")
//                .queryParam("serviceKey",serviceKey)
//                .queryParam("MobileOS", mobileOS)
//                .queryParam("MobileApp", mobileApp)
//                .queryParam("numOfRows", 10)
//                .queryParam("pageNo", 1)
//                .queryParam("listYN", "Y")
//                .queryParam("showflag", 1)
//                .queryParam("_type", "json")
//                .build().toUriString();
//        log.info("countUrl : " + countUrl);
//
//        JsonNode cntRoot = objectMapper.readTree(restTemplate.getForObject(countUrl, String.class));
//        log.info("cntRoot : " + cntRoot);
//        int totalCount = cntRoot
//                .path("response")
//                .path("body")
//                .path("totalCount")
//                .asInt(0);
//
//        //페이지 사이즈와 반복 횟수 계산
//        int pageSize = 500;
//        int totalPage = (totalCount + pageSize - 1) / pageSize;
//
//        List<PetPlaceDTO> allItem = new ArrayList<>();
//
//        //페이징 루프
//        for (int pageNo = 1; pageNo <= totalPage; pageNo++) {
//            String PageUrl = UriComponentsBuilder.fromHttpUrl(BASE_URL)
//                    .path("/petTourSyncList")
//                    .queryParam("serviceKey",serviceKey)
//                    .queryParam("MobileOS", mobileOS)
//                    .queryParam("MobileApp", mobileApp)
//                    .queryParam("numOfRows", pageSize)
//                    .queryParam("pageNo", pageNo)
//                    .queryParam("listYN", "Y")
//                    .queryParam("showflag", 1)
//                    .queryParam("_type", "json")
//                    .build().toUriString();
//
//            String rawJson = restTemplate.getForObject(PageUrl, String.class);
//            log.info("rawJson : " + rawJson);
//            JsonNode itemNode = objectMapper.readTree(rawJson)
//                    .path("response")
//                    .path("body")
//                    .path("items")
//                    .path("item");
//
//            if (itemNode.isArray()) {
//                for (JsonNode node : itemNode) {
//                    allItem.add(parseItem(node));
//                }
//            } else if (itemNode.isObject()) {
//                allItem.add(parseItem(itemNode));
//            }
//        }
//
//        return allItem;
//    }
//
//    private PetPlaceDTO parseItem(JsonNode node) {
//
//        return PetPlaceDTO.builder()
//                .contentid(node.path("contentid").asLong(0))
//                .contenttypeid(node.path("contenttypeid").asText(""))
//                .title(node.path("title").asText(""))
//                .addr1(node.path("addr1").asText(""))
//                .mapx(node.path("mapx").asDouble(0.0))
//                .mapy(node.path("mapy").asDouble(0.0))
//                .build();
//    }
//}
package org.zerock.portfolio.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.zerock.portfolio.dto.PetPlaceDTO;
import org.zerock.portfolio.dto.PetPlaceImgDTO;
import org.zerock.portfolio.repository.PetPlaceImgRepository;
import org.zerock.portfolio.repository.PetPlaceRepository;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import java.io.StringReader;
import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApiPetPlaceServiceImpl implements ApiPetPlaceService {
    
    private final PetPlaceRepository petPlaceRepository;
    private final PetPlaceImgRepository petPlaceImgRepository;

    @Value("${api.serviceKey}")
    private String serviceKey;

    private final String mobileOS = "ETC";
    private final String mobileApp = "WithPet";
    private static final String BASE_URL = "http://apis.data.go.kr/B551011/KorPetTourService";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // XML 에러 응답 파싱용 클래스
    @XmlRootElement(name = "OpenAPI_ServiceResponse")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class ErrorResponse {
        @XmlElement(name = "cmmMsgHeader")
        private CmmMsgHeader cmmMsgHeader;

        public static class CmmMsgHeader {
            @XmlElement
            private String errMsg;
            @XmlElement
            private String returnAuthMsg;
            @XmlElement
            private String returnReasonCode;

            public String getErrMsg() {
                return errMsg;
            }

            public String getReturnAuthMsg() {
                return returnAuthMsg;
            }

            public String getReturnReasonCode() {
                return returnReasonCode;
            }
        }
    }

    @Override
    public List<PetPlaceDTO> fetchAllPetPlace() throws Exception {
        log.info("Starting fetchAllPetPlace");

        // 전체 건수 조회 (listYN=N)
            URI countUrl = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                    .path("/petTourSyncList")
                    .queryParam("serviceKey", serviceKey)
                    .queryParam("MobileOS", mobileOS)
                    .queryParam("MobileApp", mobileApp)
                    .queryParam("numOfRows", 1)
                    .queryParam("pageNo", 1)
                    .queryParam("listYN", "N")
                    .queryParam("showflag", 1)
                    .queryParam("_type", "json")
                    .build(true)
                    .toUri();

            log.info("countUrl: {}", countUrl);

            String countResponse;
            try {
                countResponse = restTemplate.getForObject(countUrl, String.class);
                if (countResponse == null) {
                    log.error("countResponse is null");
                    throw new RuntimeException("API 응답이 null입니다.");
                }
                log.info("countResponse: {}", countResponse);
            } catch (Exception e) {
                log.error("Failed to fetch count response: {}", e.getMessage(), e);
                throw new RuntimeException("API 호출 실패: " + e.getMessage(), e);
            }

            // XML 에러 체크
            if (countResponse.trim().startsWith("<")) {
                ErrorResponse error = parseXmlError(countResponse);
                String errDetails = "API 에러 - 코드: " + error.cmmMsgHeader.getReturnReasonCode() +
                        ", 메시지: " + error.cmmMsgHeader.getErrMsg() +
                        ", 인증 메시지: " + error.cmmMsgHeader.getReturnAuthMsg();
                log.error(errDetails);
                throw new RuntimeException(errDetails);
            }

            JsonNode cntRoot;
            try {
                cntRoot = objectMapper.readTree(countResponse);
            } catch (Exception e) {
                log.error("Failed to parse JSON count response: {}", e.getMessage(), e);
                throw new RuntimeException("JSON 파싱 실패: " + e.getMessage(), e);
            }
            log.info("cntRoot: {}", cntRoot);
            int totalCount = cntRoot
                    .findValue("totalCnt")
                    .asInt(0);
            log.info("totalCount: {}", totalCount);

            if (totalCount == 0) {
                log.warn("No data available (totalCount=0)");
                return new ArrayList<>();
            }

            log.info("totalCount: {}", totalCount);

        // 페이지 사이즈와 반복 횟수 계산
        int pageSize = 500; // 테스트용으로 작게 설정
        int totalPage = (totalCount + pageSize - 1) / pageSize;
        log.info("totalPage: {}", totalPage);

        List<PetPlaceDTO> allItem = new ArrayList<>();

        // 페이징 루프
        for (int pageNo = 1; pageNo <= totalPage; pageNo++) {
            URI pageUrl = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                    .path("/petTourSyncList")
                    .queryParam("serviceKey", serviceKey)
                    .queryParam("MobileOS", mobileOS)
                    .queryParam("MobileApp", mobileApp)
                    .queryParam("numOfRows", pageSize)
                    .queryParam("pageNo", pageNo)
                    .queryParam("listYN", "Y")
                    .queryParam("showflag", 1)
                    .queryParam("_type", "json")
                    .build(true).toUri();
            log.info("pageUrl: {}", pageUrl);

            String rawJson;
            try {
                rawJson = restTemplate.getForObject(pageUrl, String.class);
                if (rawJson == null) {
                    log.error("rawJson for page {} is null", pageNo);
                    throw new RuntimeException("페이지 API 응답이 null입니다.");
                }
                log.info("rawJson for page {}: {}", pageNo, rawJson);
            } catch (Exception e) {
                log.error("Failed to fetch page {} response: {}", pageNo, e.getMessage(), e);
                throw new RuntimeException("페이지 API 호출 실패: " + e.getMessage(), e);
            }

            // XML 에러 체크
            if (rawJson.trim().startsWith("<")) {
                ErrorResponse error = parseXmlError(rawJson);
                String errDetails = "API 에러 - 코드: " + error.cmmMsgHeader.getReturnReasonCode() +
                        ", 메시지: " + error.cmmMsgHeader.getErrMsg() +
                        ", 인증 메시지: " + error.cmmMsgHeader.getReturnAuthMsg();
                log.error(errDetails);
                throw new RuntimeException(errDetails);
            }

            JsonNode itemNode;
            try {
                itemNode = objectMapper.readTree(rawJson)
                        .path("response")
                        .path("body")
                        .path("items")
                        .path("item");
            } catch (Exception e) {
                log.error("Failed to parse JSON page {} response: {}", pageNo, e.getMessage(), e);
                throw new RuntimeException("페이지 JSON 파싱 실패: " + e.getMessage(), e);
            }

            if (itemNode.isArray()) {
                for (JsonNode node : itemNode) {
                    allItem.add(parseItem(node));
                }
            } else if (itemNode.isObject()) {
                allItem.add(parseItem(itemNode));
            } else {
                log.warn("No items found for page {}", pageNo);
            }
        }

        log.info("Fetched {} pet places", allItem.size());
        return allItem;
    }

    private ErrorResponse parseXmlError(String xml) throws Exception {
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(ErrorResponse.class);
            Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
            return (ErrorResponse) unmarshaller.unmarshal(new StringReader(xml));
        } catch (Exception e) {
            log.error("Failed to parse XML error response: {}", e.getMessage(), e);
            throw new RuntimeException("XML 파싱 실패: " + e.getMessage(), e);
        }
    }

    @Override
    public List<PetPlaceImgDTO> fetchAllPetPlaceImg(List<PetPlaceDTO> dtos) throws Exception {

        log.info("Starting fetchAllPetPlaceImg");

        List<PetPlaceImgDTO> allItem = new ArrayList<>();

        String rawJson;
        for (PetPlaceDTO dto : dtos) {
            URI imageUrl = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                    .path("/detailImage")
                    .queryParam("serviceKey", serviceKey)
                    .queryParam("MobileOS", mobileOS)
                    .queryParam("MobileApp", mobileApp)
                    .queryParam("numOfRows", 10)
                    .queryParam("pageNo", 1)
                    .queryParam("contentId", dto.getContentid())
                    .queryParam("imageYN", dto.getContenttypeid().equals("39") ? "N" : "Y")
                    .queryParam("_type", "json")
                    .build(true).toUri();
            log.info("imageUrl: {}", imageUrl);
            rawJson = restTemplate.getForObject(imageUrl, String.class);
            log.info("rawJson: {}", rawJson);

            JsonNode itemNode;
            itemNode = objectMapper.readTree(rawJson)
                    .path("response")
                    .path("body")
                    .path("items")
                    .path("item");
            log.info("itemNode: {}", itemNode);

            if (itemNode.isArray()) {
                for (JsonNode node : itemNode) {
                    allItem.add(parseImgItem(node));
                }
            } else if (itemNode.isObject()) {
                allItem.add(parseImgItem(itemNode));
            }
        }
        log.info("Fetched {} pet place images", allItem.size());
        return allItem;
    }

    private PetPlaceDTO parseItem(JsonNode node) {

        PetPlaceDTO dto = PetPlaceDTO.builder()
                .contentid(node.path("contentid").asLong(0))
                .contenttypeid(node.path("contenttypeid").asText(""))
                .title(node.path("title").asText(""))
                .addr1(node.path("addr1").asText(""))
                .tel(node.path("tel").asText(""))
                .mapx(node.path("mapx").asDouble(0.0))
                .mapy(node.path("mapy").asDouble(0.0))
                .modifiedtime(LocalDateTime.parse
                        (node.path("modifiedtime").asText(""), DateTimeFormatter.ofPattern("yyyyMMddHHmmss")))
                .build();
        log.debug("Parsed item: {}", dto);
        return dto;
    }

    private PetPlaceImgDTO parseImgItem(JsonNode node) {

        PetPlaceImgDTO dto = PetPlaceImgDTO.builder()
                .imgname(node.path("imgname").asText(""))
                .originimgurl(node.path("originimgurl").asText(""))
                .contentid(node.path("contentid").asLong(0))
                .build();
        log.debug("Parsed item: {}", dto);
        return dto;
    }

    @Override
    public List<PetPlaceDTO> getAllPetPlace() {

        List<PetPlaceDTO> list = petPlaceRepository.findAll().stream()
                .map(entity -> entityToDto(entity)).collect(Collectors.toList());

        return list;
    }

    @Override
    public List<PetPlaceImgDTO> getAllPetPlaceImg() {

        List<PetPlaceImgDTO> imgList = petPlaceImgRepository.findAll().stream()
                .map(entity -> imgEntityTODto(entity)).collect(Collectors.toList());

        return imgList;
    }
}