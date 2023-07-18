FROM eclipse-temurin:17-jdk-focal
 
WORKDIR /app
 
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
#RUN ./mvnw dependency:go-offline
 
COPY src ./src
 
CMD ["./mvnw", "spring-boot:run"]

#### Stage 1: Build the application
#FROM openjdk:17-oracle as build

# Set the current working directory inside the image
# will create a folder on the image we're pulling from dockerhub and starting as s base image
# so it will create /app folder if it doesn't exist
# so /app will become a root folder of the project
#WORKDIR /app

# Copy maven executable to the image
#COPY mvnw .
#COPY .mvn .mvn

# Copy the pom.xml file
#COPY pom.xml .

# Build all the dependencies in preparation to go offline. 
# This is a separate step so the dependencies will be cached unless 
# the pom.xml file has changed.
# doesn't want to be executed (error 126)
#RUN ./mvnw dependency:go-offline -B

# Copy the project source
#COPY src src

# Package the application
# doesn't want to be executed (error 126)
#RUN ./mvnw package -DskipTests
#RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)


#### Stage 2: A minimal docker image with command to run the app 
#FROM openjdk:17-oracle

#ARG DEPENDENCY=/app/target/dependency

# Copy project dependencies from the build stage
#COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
#COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
#COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

# start this container up now via this commend and let it sit there and run
# also, it's like a final word that that's exactly how we want it to run so run it this way
#ENTRYPOINT ["java","-cp","app:app/lib/*","com.yermakov.assignmentsubmissionapp.AssignmentSubmissionApplication"]