package org.zerock.portfolio.common;

import java.util.List;

public interface BoardLike {

    Long getId();
    String getName();
    String getLocation();
    String getPhoneNumber();
    double getAvg();
    List<? extends ImageLike> getImages();
    String getType();

}
