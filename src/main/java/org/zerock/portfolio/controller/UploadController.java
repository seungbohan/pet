package org.zerock.portfolio.controller;

import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.portfolio.dto.ImageDTO;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/upload")
@Log4j2
public class UploadController {

    @Value("${org.zerock.upload.path}")
    private String uploadPath;

    // [SECURITY] 허용된 이미지 확장자 화이트리스트
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "webp", "bmp"
    );

    // [SECURITY] 최대 업로드 파일 개수
    private static final int MAX_UPLOAD_FILES = 10;

    @PostMapping
    public ResponseEntity<List<ImageDTO>> uploadFile(MultipartFile[] uploadFiles) {

        // [SECURITY] Null 체크 및 파일 개수 제한
        if (uploadFiles == null || uploadFiles.length == 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (uploadFiles.length > MAX_UPLOAD_FILES) {
            log.warn("Too many files uploaded: {}", uploadFiles.length);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<ImageDTO> list = new ArrayList<>();

        for (MultipartFile uploadFile : uploadFiles) {

            // [SECURITY] Content-Type 검증
            String contentType = uploadFile.getContentType();
            if (contentType == null || !contentType.startsWith("image")) {
                log.warn("Rejected non-image content type: {}", contentType);
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            String originalFileName = uploadFile.getOriginalFilename();
            if (originalFileName == null || originalFileName.isBlank()) {
                log.warn("Empty original filename");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            String fileName = originalFileName.substring(originalFileName.lastIndexOf("\\") + 1);

            // [SECURITY] 파일 확장자 화이트리스트 검증 (CRITICAL-4 수정)
            String extension = getFileExtension(fileName).toLowerCase();
            if (!ALLOWED_EXTENSIONS.contains(extension)) {
                log.warn("Rejected file with disallowed extension: {}", extension);
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            // [SECURITY] 파일명에서 위험 문자 제거
            fileName = sanitizeFileName(fileName);

            String folderPath = makeFolder();

            String uuid = UUID.randomUUID().toString();

            String saveName = uploadPath + File.separator + folderPath + File.separator + uuid + "_" + fileName;

            Path savePath = Paths.get(saveName);

            try {
                uploadFile.transferTo(savePath);

                String thumbnailSaveName = uploadPath + File.separator + folderPath + File.separator + "s_" + uuid + "_" + fileName;

                File thumbnailFile = new File(thumbnailSaveName);

                Thumbnailator.createThumbnail(savePath.toFile(), thumbnailFile, 100, 100);

                list.add(new ImageDTO(fileName, uuid, folderPath));
            } catch (IOException e) {
                log.error("File upload failed for file: {}", fileName);
            }
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    private String makeFolder() {

        String str = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));

        String folderPath = str.replace("/", File.separator);

        File uploadPathFolder = new File(uploadPath, folderPath);

        if (!uploadPathFolder.exists()) {
            uploadPathFolder.mkdirs();
        }

        return folderPath;
    }

    @GetMapping("/display")
    public ResponseEntity<byte[]> getFile(@RequestParam String fileName) {

        try {
            String srcFileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8);

            // [SECURITY] Path Traversal 방어 (CRITICAL-1 수정)
            if (!isValidFilePath(srcFileName)) {
                log.warn("Path traversal attempt detected: {}", srcFileName);
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            Path uploadRoot = Paths.get(uploadPath).toAbsolutePath().normalize();
            Path filePath = uploadRoot.resolve(srcFileName).normalize();

            // [SECURITY] 파일이 uploadPath 내에 있는지 재검증
            if (!filePath.startsWith(uploadRoot)) {
                log.warn("Path traversal attempt (resolved): {}", filePath);
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            File file = filePath.toFile();

            if (!file.exists() || !file.isFile()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            HttpHeaders header = new HttpHeaders();
            header.add("Content-Type", Files.probeContentType(file.toPath()));
            // [SECURITY] 캐시 및 보안 헤더 추가
            header.add("X-Content-Type-Options", "nosniff");

            return new ResponseEntity<>(FileCopyUtils.copyToByteArray(file), header, HttpStatus.OK);
        } catch (Exception e) {
            log.error("File display failed");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping
    public ResponseEntity<Boolean> removeFile(@RequestParam String fileName) {

        try {
            String srcFileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8);

            // [SECURITY] Path Traversal 방어 (CRITICAL-1 수정)
            if (!isValidFilePath(srcFileName)) {
                log.warn("Path traversal attempt on delete: {}", srcFileName);
                return new ResponseEntity<>(false, HttpStatus.FORBIDDEN);
            }

            Path uploadRoot = Paths.get(uploadPath).toAbsolutePath().normalize();
            Path filePath = uploadRoot.resolve(srcFileName).normalize();

            if (!filePath.startsWith(uploadRoot)) {
                log.warn("Path traversal attempt on delete (resolved): {}", filePath);
                return new ResponseEntity<>(false, HttpStatus.FORBIDDEN);
            }

            File file = filePath.toFile();

            if (!file.exists()) {
                return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
            }

            boolean result = file.delete();

            File thumbnailFile = new File(file.getParent() + File.separator + "s_" + file.getName());
            if (thumbnailFile.exists()) {
                thumbnailFile.delete();
            }

            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            log.error("File removal failed");
            return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * [SECURITY] 파일 경로에 Path Traversal 패턴이 있는지 검증
     */
    private boolean isValidFilePath(String filePath) {
        if (filePath == null || filePath.isBlank()) {
            return false;
        }
        // ".." 경로 조작, null 바이트, 절대 경로 시도 차단
        if (filePath.contains("..") || filePath.contains("\0")
                || filePath.startsWith("/") || filePath.startsWith("\\")
                || filePath.contains(":")) {
            return false;
        }
        return true;
    }

    /**
     * [SECURITY] 파일 확장자 추출
     */
    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex == -1 || lastDotIndex == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(lastDotIndex + 1);
    }

    /**
     * [SECURITY] 파일명에서 위험 문자 제거
     */
    private String sanitizeFileName(String fileName) {
        // 허용: 알파벳, 숫자, 한글, 점, 하이픈, 밑줄
        return fileName.replaceAll("[^a-zA-Z0-9가-힣._-]", "_");
    }
}
