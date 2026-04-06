package org.zerock.portfolio.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.zerock.portfolio.repository.PetPlaceRepository;
import org.zerock.portfolio.service.PetPlaceSyncService;

@Component
@RequiredArgsConstructor
@Log4j2
public class DataInitializer implements CommandLineRunner {

    private final PetPlaceRepository petPlaceRepository;
    private final PetPlaceSyncService petPlaceSyncService;

    @Override
    public void run(String... args) {
        if (petPlaceRepository.count() == 0) {
            log.info("No pet places found. Running initial sync...");
            try {
                petPlaceSyncService.syncPlaces();
                log.info("Initial sync completed.");
            } catch (Exception e) {
                log.error("Initial sync failed: {}", e.getMessage());
            }
        }
    }
}
