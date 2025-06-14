# ================================
# Multi-stage Spring Boot Dockerfile
# ================================

# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy dependency files first for better layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests -q

# ================================
# Runtime stage
# ================================
FROM eclipse-temurin:21-jdk-alpine AS runtime
WORKDIR /app

# Install dependencies for health checks and debugging
RUN apk add --no-cache curl

# Copy the built jar from build stage
COPY --from=build /app/target/ToDoApp-0.0.1-SNAPSHOT.jar app.jar

# Create a non-root user for security
RUN addgroup -g 1001 -S spring && \
    adduser -S spring -u 1001 -G spring && \
    chown spring:spring app.jar

# Switch to non-root user
USER spring:spring

# Add metadata labels
LABEL maintainer="ToDoApp Team" \
    version="1.0" \
    description="Spring Boot ToDoApp Backend"

# Expose application port
EXPOSE 8080

# Configure health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
