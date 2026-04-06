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
            String lower = title.toLowerCase();
            if (lower.contains("카페") || lower.contains("cafe") || lower.contains("커피") || lower.contains("coffee")) {
                return CAFE;
            }
            if (lower.contains("병원") || lower.contains("동물병원") || lower.contains("수의")) {
                return HOSPITAL;
            }
            if (lower.contains("공원") || lower.contains("산책") || lower.contains("둘레길") || lower.contains("해수욕") || lower.contains("해변")) {
                return PARK;
            }
            if (lower.contains("식당") || lower.contains("맛집") || lower.contains("레스토랑") || lower.contains("restaurant")) {
                return RESTAURANT;
            }
            if (lower.contains("펜션") || lower.contains("호텔") || lower.contains("리조트") || lower.contains("모텔") || lower.contains("글램핑")) {
                return ACCOMMODATION;
            }
        }
        return fromContentTypeId(contentTypeId);
    }
}
