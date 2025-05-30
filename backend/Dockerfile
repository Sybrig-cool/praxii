# Start from a base Java image
FROM openjdk:17-jdk-slim

# Set working directory inside container
WORKDIR /app

# Copy the built Spring Boot JAR into the container
COPY target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
