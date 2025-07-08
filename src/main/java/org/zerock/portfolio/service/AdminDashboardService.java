package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.UserCountDTO;

import java.util.List;

public interface AdminDashboardService {

    Long boardCount();

    Long reviewCount();

    UserCountDTO userCount();
}
