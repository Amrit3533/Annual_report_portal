# Annual Report Portal

## Overview

Annual Report Portal is a centralized web-based application designed for educational institutions to streamline the collection, management, and generation of annual reports. The system replaces traditional manual reporting processes with a secure, role-based, and automated platform that improves efficiency, accuracy, and transparency.

The portal enables departments to submit institutional data, administrators to manage users and departments, and management authorities to review consolidated reports through a single integrated system.

---

## Problem Statement

Educational institutions often prepare annual reports using spreadsheets, documents, and manual communication. This process leads to:

* Data duplication and inconsistencies
* Time-consuming report compilation
* Lack of centralized storage
* Security and access control issues
* Difficulty in tracking departmental submissions
* Increased administrative workload

The Annual Report Portal addresses these challenges through automation, centralized data management, and role-based access control.

---

## Key Features

### Authentication & Authorization

* JWT-based authentication
* Secure password hashing using bcrypt
* Role-Based Access Control (RBAC)
* User account activation/deactivation
* Protected API routes

### User Management

* Admin-managed user creation
* Department assignment
* User status management
* Role-based permissions

### Department Management

* Create and manage departments
* Department-wise report submission
* Department-specific data access

### Report Management

* Create annual reports
* Update and edit reports
* Department-wise report collection
* Centralized report storage
* Historical report maintenance

### Dashboard & Analytics

* Institutional performance overview
* Department-wise statistics
* Data visualization using charts and graphs
* Summary reports

### Security Features

* Password encryption
* JWT token validation
* Role-based access restrictions
* Secure API communication
* Controlled access to sensitive data

---

## Technology Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Bootstrap / Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* Amazon RDS (MySQL)

### Cloud Services

* Amazon EC2
* Amazon S3

### Security

* JWT Authentication
* bcrypt Password Hashing

### Development Tools

* Git
* GitHub
* Postman
* VS Code

---

## System Architecture

```text
React Frontend
       |
       v
Express REST APIs
       |
       v
Node.js Backend
       |
       +----------------+
       |                |
       v                v
 Amazon RDS        Amazon S3
   (MySQL)      (File Storage)
```

---

## User Roles

### Administrator

* Manage users
* Manage departments
* View all reports
* Generate annual reports
* Disable/enable users
* Monitor system activities

### Department Staff

* Submit departmental data
* Update report information
* View department-specific records

### Management

* View reports and analytics
* Access dashboards
* Review institutional performance

---

## Database Tables

### users

Stores user account information.

### departments

Stores department details.

### reports

Stores annual report data submitted by departments.

---

## API Highlights

### Authentication

* POST /api/auth/login

### Users

* POST /api/users
* GET /api/users
* PUT /api/users/:id
* PUT /api/users/:id/disable

### Departments

* POST /api/departments
* GET /api/departments

### Reports

* POST /api/reports
* GET /api/reports
* PUT /api/reports/:id
* DELETE /api/reports/:id

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/annual-report-portal.git
cd annual-report-portal
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000

DB_HOST=your-rds-endpoint
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=annual_report

JWT_SECRET=your-secret-key

AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket
```

Start Backend:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Future Enhancements

* Automated PDF report generation
* Excel export support
* Email notifications
* Approval workflow
* Advanced analytics dashboard
* NAAC/NBA/NIRF reporting modules
* Audit logs and activity tracking
* Multi-institution support
* AI-powered report insights

---

## Project Objectives

* Centralize annual report management
* Reduce manual effort
* Improve data accuracy
* Enhance security through RBAC
* Support data visualization
* Generate reports efficiently
* Improve collaboration among departments

---

## Benefits

* Faster report preparation
* Reduced administrative workload
* Improved transparency
* Better data consistency
* Secure information management
* Scalable architecture
* Cloud-ready deployment

---

## Project Status

🚧 Currently Under Development

Completed:

* Backend Setup
* Amazon RDS Integration
* JWT Authentication
* User Management Module
* Department Management
* User Disable Feature

Upcoming:

* Report Management Module
* Dashboard & Analytics
* PDF Generation
* Frontend Integration

---

## Author

**Amrit Kumar**
B.Tech CSE (2026)

Annual Report Portal – Final Year Project
