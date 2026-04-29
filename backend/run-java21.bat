@echo off
echo =======================================================
echo Starting SmartPrep Backend with Java 21
echo =======================================================

:: Set JAVA_HOME to the downloaded JDK 21
set JAVA_HOME=%~dp0jdk-21\jdk-21.0.4+7
set PATH=%JAVA_HOME%\bin;%PATH%

echo Java Version:
java -version

echo.
echo Running Spring Boot application...
mvn clean spring-boot:run
