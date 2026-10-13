# Institute Management System — Basic Design Document

**Version:** 1.0  
**Purpose:** Short overview of the application's architecture, modules, and data flow.

## 1. Project Overview

The Institute Management System is a web application for managing student and trainer information. It supports registration and login, role-based dashboards, and administrative management of student and trainer records.

## 2. Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | Angular, TypeScript, HTML/CSS | Displays pages and forms, handles user events, and calls backend APIs. |
| Backend | Java, Spring Boot REST APIs | Receives HTTP requests, validates input, applies business rules, and returns JSON. |
| Persistence | Spring Data JPA and Hibernate | Maps Java entities to relational database operations. |
| Database | MySQL | Stores and retrieves application records. |
| Session | Server-side HTTP session | Maintains the logged-in user's identity and role between requests. |

## 3. High-Level Architecture

```text
User / Browser
      |
      v
Angular UI (components, forms, API service)
      |  HTTP requests / JSON / session cookie
      v
Spring Boot REST Controllers
      |
      v
Service Layer (business rules)
      |
      v
Spring Data JPA / Hibernate
      |
      v
MySQL Database
```

Angular does not connect directly to MySQL. The frontend sends HTTP requests to Spring Boot, and the backend communicates with the database.

## 4. Main Roles and Modules

- **Student:** Registration, login/logout, and access to the student's own profile/dashboard.
- **Trainer:** Registration, login/logout, access to the trainer's profile, and viewing assigned students.
- **Admin:** Access to student and trainer records, editing records, and deleting records subject to business rules.
- **Shared backend:** Request validation, password hashing, session/role checks, database access, and error handling.

## 5. Data Model (Conceptual)

- **Student:** Has an ID and student details such as name, email, city, course, and a trainer reference.
- **Trainer:** Has an ID and trainer details such as name, email, course/class details, and other trainer-specific fields.
- **Relationship:** One trainer may be associated with multiple students. The exact field names and relationship mapping should be confirmed in the current entity classes.

Passwords should be stored as hashes and must not be returned in API responses.

## 6. Typical Data Flow

1. A user clicks a button or submits an Angular form.
2. Angular event binding calls a method in a component.
3. The component calls the frontend API service.
4. The API service sends an HTTP request (`GET`, `POST`, `PUT`, or `DELETE`) to a Spring Boot endpoint.
5. A controller receives the request and checks input/session/role as required.
6. The service layer applies business rules and calls a repository.
7. JPA/Hibernate reads or changes records in MySQL.
8. Spring Boot returns an HTTP status and JSON response.
9. Angular handles the response and updates the page or displays an error.

## 7. Responsibilities of Backend Components

| Component | Responsibility |
|---|---|
| Controller | Maps a URL and HTTP method to a Java method and returns an API response. |
| Service | Contains business rules and coordinates operations. |
| Repository | Performs database operations through Spring Data JPA. |
| Entity | Maps a Java class to a database table. |
| DTO/request model | Defines data accepted from or returned to the frontend. |
| Global exception handler | Converts handled exceptions into consistent HTTP error responses. |
| `application.yml` | Holds runtime configuration such as server, datasource, and session settings. |

## 8. Authentication and Error Handling

- Login verifies the submitted credentials and creates a server-side session after successful authentication.
- Protected endpoints check the session and expected role before allowing access.
- Passwords should be hashed before storage.
- Validation and business-rule errors should return appropriate HTTP status codes and safe messages.
- Unexpected errors should be logged on the server. Stack traces and secrets should not be exposed to the browser.

## 9. Local Development Setup

The usual development arrangement is:

- Angular frontend: `http://localhost:4200`
- Spring Boot backend: `http://localhost:8080`
- MySQL: runs as a separate database service.

Actual ports and database credentials depend on the project's configuration and local environment.

## 10. Scope and Notes

This is a basic design overview, not a complete production architecture or security assessment. Verify exact endpoint names, entity fields, and package names against the current source code.

GitHub stores the tracked source files and documentation; it does not automatically include live MySQL records or installed dependencies.
