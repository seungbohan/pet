FROM gradle:8.5-jdk17 AS builder
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY src ./src
# [SECURITY] .env 파일을 Docker 이미지에 복사하지 않음 (CRITICAL-2 수정)
# 시크릿은 docker-compose.yml의 environment 또는 Docker secrets로 전달
RUN gradle build --no-daemon -x test

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
# [SECURITY] 비루트 사용자로 실행
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN mkdir -p /app/upload/tmp && chown -R appuser:appuser /app/upload
USER appuser
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
