# ==============================================================================
# Stage 1: Build stage using Java 21 JDK and Maven Wrapper
# ==============================================================================
FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /app

# Copy Maven wrapper configuration and descriptor
COPY Smart_Bill_And_Subscription_Manager-main/.mvn/ .mvn/
COPY Smart_Bill_And_Subscription_Manager-main/mvnw Smart_Bill_And_Subscription_Manager-main/pom.xml ./

# Normalize line endings and grant executable permissions to the Maven wrapper
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Pre-cache Maven dependencies
RUN ./mvnw dependency:go-offline -B || true

# Copy application source code
COPY Smart_Bill_And_Subscription_Manager-main/src/ ./src/

# Compile and package Spring Boot executable JAR (skipping test execution)
RUN ./mvnw clean package -DskipTests

# ==============================================================================
# Stage 2: Runtime stage using lightweight Java 21 JRE
# ==============================================================================
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Create a dedicated non-root user and group for security
RUN groupadd -r smartbill && useradd -r -g smartbill smartbill

# Copy the packaged Spring Boot fat JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Set file ownership to non-root user
RUN chown -R smartbill:smartbill /app

# Run container as non-root user
USER smartbill

# Expose default application port (Render dynamically provides PORT at runtime)
EXPOSE 8080

# Default environment port fallback
ENV PORT=8080

# Execute Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
