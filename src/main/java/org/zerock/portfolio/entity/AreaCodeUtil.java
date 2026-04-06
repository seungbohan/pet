package org.zerock.portfolio.entity;

/**
 * Derives area codes from Korean address strings (addr1).
 * The public API often returns empty areacode, but addr1 contains
 * the full address with city/province names that can be mapped.
 */
public class AreaCodeUtil {

    private AreaCodeUtil() {
        // Utility class — prevent instantiation
    }

    /**
     * Extract an area code from a Korean address string.
     *
     * @param addr1 full address (e.g. "서울특별시 강남구 …")
     * @return area code string, or empty string if unrecognised
     */
    public static String fromAddress(String addr1) {
        if (addr1 == null || addr1.isEmpty()) return "";

        // Metropolitan cities — match at the start of the address
        if (addr1.startsWith("서울")) return "1";
        if (addr1.startsWith("인천")) return "2";
        if (addr1.startsWith("대전")) return "3";
        if (addr1.startsWith("대구")) return "4";
        if (addr1.startsWith("광주")) return "5";
        if (addr1.startsWith("부산")) return "6";
        if (addr1.startsWith("울산")) return "7";
        if (addr1.startsWith("세종")) return "8";

        // Provinces — may appear anywhere in the address
        if (addr1.contains("경기")) return "31";
        if (addr1.contains("강원")) return "32";
        if (addr1.contains("충청북") || addr1.contains("충북")) return "33";
        if (addr1.contains("충청남") || addr1.contains("충남")) return "34";
        if (addr1.contains("경상북") || addr1.contains("경북")) return "35";
        if (addr1.contains("경상남") || addr1.contains("경남")) return "36";
        if (addr1.contains("전북") || addr1.contains("전라북")) return "37";
        if (addr1.contains("전라남") || addr1.contains("전남")) return "38";
        if (addr1.contains("제주")) return "39";

        return "";
    }
}
