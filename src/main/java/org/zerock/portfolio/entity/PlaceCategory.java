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
}
