# StockWise - Smart Inventory & Stock Tracking System

This repository contains end-to-end documentation and architectural artifacts for the **StockWise** project.
The primary goal is to reduce errors, delays, and visibility problems caused by manual inventory tracking in small and medium-sized businesses through a web-based system.

> Note: This repository is currently structured mainly as a **documentation repository**. The target folder structure for the codebase is also defined in the installation document (`backend`, `frontend`, `docs`, `scripts`).

## 1) Work Breakdown and Team Structure

### Team roles
- **Zehra Berre Akyüz — Project Manager**
  - Roadmap, 14-week planning, Jira sprint/tracking, risk and resource management
- **Tuba Eraslan — Backend Lead**
  - PostgreSQL schema design, Spring Boot API development, business rules, and security integration
- **Ceren Şengül — Frontend Lead**
  - React-based dashboard, UI components, Axios integration, and chart screens
- **Can Tasar — QA & Documentation**
  - UML models, test planning and execution, bug tracking, final documentation, and repository organization

### Jira board
- SCRUM board: [https://zehraberr.atlassian.net/jira/software/projects/SCRUM/boards/1]

### 14-week project plan (summary)
1. **Initiation (Weeks 1-2):** Project definition, role allocation, Jira setup
2. **Analysis (Weeks 3-4):** Requirements analysis, UML drafts
3. **Design (Weeks 5-6):** Database schema, UI/UX design
4. **Development (Weeks 7-10):** Backend API + frontend integration
5. **Testing (Weeks 11-12):** QA, test execution, bug fixes
6. **Delivery (Weeks 13-14):** GitHub delivery, final presentation

## 2) Project Overview

### Problem
- Manual inventory management causes data entry errors, overstock/understock issues, and operational delays.
- Lack of real-time visibility increases the risk of financial loss.

### Solution
StockWise is a web-based inventory management platform that provides:
- **Real-time stock tracking**
- **Threshold-based low-stock alerts**
- **Analytics dashboards and charts**
- **Role-based authorization (Admin/Staff)**

### Target users
- Small and medium-sized businesses
- Warehouse managers/operators
- Retail operations teams

## 3) Scope and Functional Modules

### Authentication and user management
- User login / logout
- Role-based access (Admin, Staff)
- Prevention of unauthorized access

### Product and category management
- Add, update, and delete products (primarily Admin permissions)
- Category CRUD operations
- Search, filtering, and pagination

### Stock and alert management
- Real-time stock quantity monitoring
- Automatic alert generation for below-threshold items
- Alert history and active alert list

### Analytics and reporting
- Stock summary dashboard
- Category-based distribution and low-stock reports
- Bar/line/pie charts (Chart.js)

## 4) Technical Architecture Summary

### 4.1 Technology stack (compiled from documents)
- **Backend:** Java 21, Spring Boot, Spring Web, Spring Data JPA/Hibernate, Spring Security
- **Frontend:** React.js 18, Tailwind CSS, Axios
- **Database:** PostgreSQL 15+
- **Testing:** JUnit 5, Mockito, Spring Boot Test, manual test scenarios
- **Process/tools:** Jira, Git/GitHub, Draw.io, Maven, npm/Vite

### 4.2 Layered application approach
- **Controller layer:** HTTP/API entry points
- **Service layer:** Business rules (stock calculations, alert triggering, etc.)
- **Repository layer:** Data access operations
- **Data model:** USERS, PRODUCTS, CATEGORIES, ALERTS

### 4.3 Security architecture
- **RBAC:** hierarchy of `ROLE_ADMIN` and `ROLE_STAFF`
- **Least Privilege:** users can only access resources required for their responsibilities
- **Protection mechanisms:** BCrypt password hashing, SQL injection mitigation (JPA parameter binding), CSRF protection, HTTPS/TLS, auditing approach
- **Application-layer access control:** authorization checks at URL + method + view (UI) levels

### Architecture note (across documents)
The document set includes two different security/session approaches:
- Some documents describe **session-based + Thymeleaf SSR**,
- Technical requirements/installation documents describe **React + REST + JWT**.

This README combines the common parts of both approaches to provide a general picture. Once the implementation is finalized, it is recommended to standardize a single approach with an ADR (Architecture Decision Record).

## 5) API and Data Model Summary

### Example API groups
- `POST /api/auth/login`
- `GET /api/products`, `POST /api/products`, `PUT /api/products/{id}`, `DELETE /api/products/{id}`
- `GET /api/categories`, `POST /api/categories`
- `GET /api/alerts`, `GET /api/alerts/active`

### Core entities
- **USERS:** user, role, credential fields
- **PRODUCTS:** product name, quantity, threshold, price, category
- **CATEGORIES:** product groups
- **ALERTS:** critical stock alerts and timestamps

## 6) Performance and Quality Expectations

- API responses should target **under 500ms** under normal load.
- Frontend dashboard loading should target **under 2 seconds**.
- As a security requirement, access token lifetime is **1 hour**, and refresh token lifetime is **7 days**.
- The production reliability target stated in documents is **99% uptime**.
- To maintain sustainability, layered architecture, test coverage, and documentation standards should be preserved.

## 7) How to Run (Local Development)

### Prerequisites
- **Java JDK 21** ([download](https://www.oracle.com/java/technologies/downloads/#java21))
  - Verify: `java -version`
- **Maven 3.8+** (usually bundled with IDEs)
  - Verify: `mvn -v`
- **Node.js 18+ and npm** ([download](https://nodejs.org/))
  - Verify: `node -v && npm -v`
- **PostgreSQL 15+** ([download](https://www.postgresql.org/download/))
  - Verify: `psql --version`
- **Git** ([download](https://git-scm.com/))

### Step 1: Database Setup

```bash
# Start PostgreSQL service
# macOS (Homebrew): brew services start postgresql
# or use PostgreSQL.app

# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE stockwise_db;
CREATE USER stockwise_user WITH PASSWORD 'stockwise_pass';
ALTER ROLE stockwise_user SET client_encoding TO 'utf8';
ALTER ROLE stockwise_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE stockwise_user SET default_transaction_deferrable TO on;
ALTER ROLE stockwise_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE stockwise_db TO stockwise_user;
\q
```

### Step 2: Configure Backend (application.properties)

Edit `backend/src/main/resources/application.properties`:

```properties
# PostgreSQL Database
spring.datasource.url=jdbc:postgresql://localhost:5432/stockwise_db
spring.datasource.username=stockwise_user
spring.datasource.password=stockwise_pass
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Server Port
server.port=8080
```

### Step 3: Build and Run Backend

```bash
cd backend

# Clean and compile
mvn clean compile

# Build and run tests
mvn clean package

# Start Spring Boot application
mvn spring-boot:run
# OR use pre-built JAR:
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Backend will be running at:** `http://localhost:8080`  
**Health check:** `curl http://localhost:8080/actuator/health`

### Step 4: Build and Run Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# OR build for production:
npm run build
```

**Frontend will be running at:** `http://localhost:3000`

### Step 5: Verify MVP (Core Flow)

1. Open browser: `http://localhost:3000`
2. **Login:** Use default credentials (see seed data in backend docs)
3. **Add Product:** Create a test product with stock threshold
4. **Check Alerts:** Navigate to alerts dashboard
5. **View Analytics:** Check stock summary and charts

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `psql: command not found` | Install PostgreSQL or add to PATH |
| `Port 8080 already in use` | Change `server.port` in `application.properties` |
| `Port 3000 already in use` | Use `npm start -- --port 3001` |
| Database connection fails | Verify PostgreSQL is running and credentials match |
| `mvn: command not found` | Add Maven to PATH or use `./mvnw` (included wrapper) |
| Frontend can't reach backend | Check `REACT_APP_API_BASE_URL` in frontend `.env` file |

## 8) Installation and Deployment Summary (Production)

### Production Deployment Architecture
- Backend JAR build and frontend production bundle processes are separate.
- Environment variables (`SPRING_DATASOURCE_*`, `REACT_APP_API_BASE_URL`, `JWT_SECRET`) must be managed securely via **environment files or secrets management tools** (not hardcoded).
- Default account/password credentials must be changed in production environments.
- HTTPS/TLS must be enforced for all communications.
- Database backups and disaster recovery procedures should be documented.

## 9) Document Map

Purpose of the main documents in this repository:
- `Project Overview.pdf`: project goals, scope, and team roles
- `StockWise-Report.pdf`: technical task distribution and team-based work breakdown
- `Software project management.xlsx`: resources, phases, and the 14-week plan
- `StockWise_TechnicalRequirements.pdf`: FR/NFR, technology, API, and testing requirements
- `Technology_stack.pdf`: architectural foundation and backend/data access decisions
- `Security_architecture.pdf`: defense layers and security controls
- `CODE SECURITY AND DATA PRIVACY.pdf`: secure coding, data privacy principles, and protection responsibilities
- `Role_and_authorization_management.pdf`: RBAC and authorization policies
- `Clearance_level_system.pdf`: role hierarchy and clearance model
- `StockWise_InstallationDeployment.pdf`: installation, execution, deployment, and troubleshooting
- `Implementation Roadmap.pdf`: implementation timeline and milestone-based delivery roadmap
- `Risk Assessment and Management.pdf`: identified risks, impact/probability evaluation, and management approach
- `Risk Matrix.pdf`: risk prioritization matrix based on likelihood and impact scoring
- `Mitigation.pdf`: mitigation strategies and preventive/corrective action plan for key risks
- `Payroll.pdf`: payroll-related process/role documentation linked to operational workflow
- `architecture.png`, `auth_flow.png`, `rbac.png`, `project-diagram.drawio.png`: visual architecture and flow artifacts
- `F6EB5E3F-DC1A-4629-9361-BD9055B12140.png`: end-to-end UI snapshot (login, product/category management, dashboard, and alert flow)

## 10) Diagrams

### Overall architecture
![Architecture](architecture.png)

### Authentication flow
![Auth Flow](auth_flow.png)

### RBAC view
![RBAC](rbac.png)

### Project diagram
![Project Diagram](project-diagram.drawio.png)

### End-to-end UI snapshot
`F6EB5E3F-DC1A-4629-9361-BD9055B12140.png` presents a single, stitched overview of core StockWise screens: the login page, product and category management table, stock monitoring dashboard (with search/filter controls), and the critical stock alert panel. This visual helps explain how authentication, daily operations, analytics, and alert handling are connected in one user journey.

![StockWise UI Snapshot](F6EB5E3F-DC1A-4629-9361-BD9055B12140.png)


