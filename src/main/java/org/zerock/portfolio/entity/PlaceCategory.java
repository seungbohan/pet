package org.zerock.portfolio.entity;

public enum PlaceCategory {
    TOURIST,
    CULTURE,
    FESTIVAL,
    LEISURE,
    ACCOMMODATION,
    SHOPPING,
    RESTAURANT,
    CAFE,
    HOSPITAL,
    PARK,
    OTHER;

    public static PlaceCategory fromContentTypeId(String contentTypeId) {
        if (contentTypeId == null) return OTHER;
        return switch (contentTypeId) {
            case "12" -> TOURIST;
            case "14" -> CULTURE;
            case "15" -> FESTIVAL;
            case "28" -> LEISURE;
            case "32" -> ACCOMMODATION;
            case "38" -> SHOPPING;
            case "39" -> RESTAURANT;
            default -> OTHER;
        };
    }

    /**
     * Classify a place by inspecting the title first (keyword-based),
     * then falling back to the public API contenttypeid mapping.
     * This resolves the problem where cafes, hospitals, parks, etc.
     * are lumped under contenttypeid 38 (shopping) or 39 (restaurant).
     */
    public static PlaceCategory classify(String contentTypeId, String title) {
        if (title != null) {
            String t = title.toLowerCase();

            // CAFE patterns
            if (t.contains("카페") || t.contains("cafe") || t.contains("커피") || t.contains("coffee")
                    || t.contains("디저트") || t.contains("베이커리") || t.contains("빵집") || t.contains("브런치")
                    || t.contains("tea") || t.contains("찻집") || t.contains("다방")) {
                return CAFE;
            }

            // HOSPITAL patterns
            if (t.contains("병원") || t.contains("동물병원") || t.contains("수의") || t.contains("의원")
                    || t.contains("약국") || t.contains("클리닉") || t.contains("메디컬")) {
                return HOSPITAL;
            }

            // PARK patterns
            if (t.contains("공원") || t.contains("산책") || t.contains("둘레길") || t.contains("해수욕")
                    || t.contains("해변") || t.contains("숲") || t.contains("수목원") || t.contains("생태")
                    || t.contains("유원지") || t.contains("놀이터") || t.contains("광장") || t.contains("정원")
                    || t.contains("산림") || t.contains("코스") || t.contains("트레일") || t.contains("케이블카")
                    || t.contains("해파랑") || t.contains("올레") || t.contains("누리길") || t.contains("바다")
                    || t.contains("호수") || t.contains("계곡") || t.contains("폭포") || t.contains("해안")) {
                return PARK;
            }

            // RESTAURANT patterns
            if (t.contains("식당") || t.contains("맛집") || t.contains("레스토랑") || t.contains("restaurant")
                    || t.contains("고기") || t.contains("치킨") || t.contains("피자") || t.contains("한식")
                    || t.contains("중식") || t.contains("일식") || t.contains("분식") || t.contains("국밥")
                    || t.contains("삼겹") || t.contains("갈비") || t.contains("냉면") || t.contains("해장국")
                    || t.contains("전문점") || t.contains("반점") || t.contains("횟집") || t.contains("초밥")) {
                return RESTAURANT;
            }

            // ACCOMMODATION patterns
            if (t.contains("펜션") || t.contains("호텔") || t.contains("리조트") || t.contains("모텔")
                    || t.contains("글램핑") || t.contains("민박") || t.contains("게스트하우스") || t.contains("숙소")
                    || t.contains("캠핑") || t.contains("스테이") || t.contains("빌라") || t.contains("lodge")
                    || t.contains("풀빌라")) {
                return ACCOMMODATION;
            }

            // LEISURE patterns
            if (t.contains("체험") || t.contains("놀이") || t.contains("워터파크") || t.contains("스키")
                    || t.contains("서핑") || t.contains("래프팅") || t.contains("골프") || t.contains("짚라인")
                    || t.contains("탐방") || t.contains("투어")) {
                return LEISURE;
            }

            // CULTURE patterns
            if (t.contains("박물관") || t.contains("미술관") || t.contains("전시") || t.contains("갤러리")
                    || t.contains("도서관") || t.contains("극장") || t.contains("공연") || t.contains("문화")) {
                return CULTURE;
            }
        }
        return fromContentTypeId(contentTypeId);
    }
}
