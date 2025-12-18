# Joblytics – Backend

The Joblytics backend is an **analytics and insight generation layer** built on top of structured job application data.

Rather than acting as a simple CRUD server, the backend is responsible for computing job search metrics, interpreting performance patterns, and exposing an explainable, frontend-agnostic REST API.

---

## Backend Responsibilities

The backend is designed to:

- Store normalized job application data
- Compute conversion and performance metrics
- Interpret metrics into human-readable insights
- Serve analytics-ready responses to the frontend
- Handle authentication, authorization, and session security

---

## Architecture Overview

```
Client (Vercel)
↓
REST API (Express)
↓
Controllers
↓
Services (Business Logic)
↓
MongoDB (Aggregation Pipelines)
```



### Architectural Principles

- Clear separation of concerns
- No business or analytics logic inside controllers
- Analytics computed at the database level
- Stateless REST API design
- Secure cookie-based authentication

---

## Authentication & Security Design

### Authentication Flow

- JWT-based authentication
- Tokens stored in **HttpOnly cookies**
- Session persistence across refreshes
- Email verification supported

### Why HttpOnly Cookies

- Prevents token access via JavaScript (XSS protection)
- Enables secure cross-origin authentication
- Matches common production authentication patterns

No tokens are stored in `localStorage`.

---

## Core Data Model

### Application Model

Each application document includes:

- Company and role metadata
- Job type (Job / Internship)
- Work location (Remote / Hybrid / On-site)
- Application status lifecycle
- Source platform
- Applied date (used for time-based analytics)

This schema enables:
- Funnel tracking
- Time-range analytics
- Source and category-based performance analysis

---

## Analytics Engine

The analytics engine is the core of the backend.

### Analytics Overview Endpoint

```GET /api/v1/analytics/overview?range=1m|3m|6m|1y```


### Design Characteristics

- Single endpoint returns multiple analytics dimensions
- One database query per request
- No frontend-side calculations
- Consistent response structure

---

## MongoDB Aggregation-First Design

Instead of computing metrics in Node.js, the backend:

- Pushes analytics into MongoDB
- Uses aggregation operators such as `$facet`, `$group`, `$cond`, and `$map`
- Returns pre-computed, analytics-ready objects

### Benefits

- Reduced server memory usage
- Faster response times
- Consistent and reproducible analytics logic
- Scales reasonably with growing datasets

---

## Metrics Computed by Backend

### Status Metrics

- Total applications
- Applied
- Interviewing
- Offered
- Accepted
- Rejected
- Withdrawn

### Conversion & Performance Metrics

- Applied → Interview
- Interview → Offer
- Offer → Acceptance
- Success Rate
- Performance Rate
- Rejection Rate

All metrics:
- Are guarded against division by zero
- Are consistently rounded
- Are returned as percentages with context

---

## Job Type Analytics (Job vs Internship)

For each job type, the backend computes:

- Interview rate
- Offer rate
- Acceptance rate
- Performance level classification

The backend does not recommend dropping categories.  
Instead, it identifies weak stages and explains which part of the funnel needs improvement.

---

## Work Location Analytics

For Remote, Hybrid, and On-site roles, the backend analyzes:

- Conversion behavior
- Offer patterns
- Acceptance tendencies

This helps users align application strategy with observed outcomes rather than assumptions.

---

## Source Effectiveness Analysis

Each application source is analyzed independently:

- LinkedIn
- Referrals
- Company Websites
- AngelList
- Placement Cells

For each source, the backend computes:

- Interview rate
- Offer rate
- Acceptance behavior
- Data sufficiency classification

Sources are categorized as:
- High Performer
- Average
- Weak
- Insufficient Data

This avoids misleading conclusions from small sample sizes.

---

## Insight Generation Layer

Instead of returning raw metrics, the backend maps:

- Rates → Performance Levels
- Performance Levels → Contextual Insights

### Example

```json
{
  "level": "Weak",
  "insight": "Your resume is not converting into interviews. Improve ATS optimization and role targeting."
}
```
This keeps the frontend presentation-focused rather than analytical.

---

## Configuration & Environment Handling

- Fully `.env` driven configuration
- Separate frontend and backend deployments
- Secure CORS configuration for cookie-based authentication
- Production-safe defaults

---

## Deployment

- Backend deployed on **Render**
- Frontend deployed on **Vercel**
- Cookie-based authentication with CORS properly configured
- Local proxy used during development

---

## Backend Philosophy

A backend should not only store data.  
It should explain the data.

The Joblytics backend is designed to:

- Centralize analytics logic
- Reduce frontend complexity
- Provide interpretable insights
- Follow real-world backend architecture patterns

---

## Status

This backend represents an **analytics-focused MVP**, designed for correctness, clarity, and extensibility rather than scale-at-all-costs.

---

## Author

**Aditya Kumar Singh**  
Backend / Full-Stack Developer  

Built to explore analytics-driven backend design, MongoDB aggregation pipelines, and production-style authentication patterns.
