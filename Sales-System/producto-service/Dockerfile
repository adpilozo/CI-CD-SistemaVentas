# Etapa 1: Compilar el proyecto con Maven
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app
COPY . .

# Compila el proyecto y genera el JAR (sin ejecutar pruebas)
RUN mvn clean package -DskipTests

# Etapa 2: Imagen final, solo con el JAR generado
FROM eclipse-temurin:21-jdk

WORKDIR /app
# Copia solo el JAR resultante desde la etapa anterior
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Ejecuta la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
