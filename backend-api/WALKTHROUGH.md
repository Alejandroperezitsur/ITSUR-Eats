# ITSUR Eats Backend - Technical Walkthrough

This document outlines the architectural decisions, features, and technical implementations completed for the ITSUR Eats Backend API.

## 1. Architecture & Patterns

The application follows a **Layered Architecture** with **Domain-Driven Design (DDD)** principles:

-   **Routes Layer** (`src/routes`): Defines API endpoints, validation logic (Joi), and middleware chains (Auth, Audit).
-   **Controller Layer** (`src/controllers`): Handles HTTP request/response lifecycles and error formatting.
-   **Service Layer** (`src/services`): Contains business logic, transactions, and database interactions.
-   **Data Layer** (`src/config/prisma`, `schema.prisma`): Manages database schema and connections.
-   **Workers** (`src/workers`): Handles background tasks like Event Processing.

## 2. Key Features Implemented

### A. Authentication & Session Management (Phase 1 & 5)
-   **JWT Strategy**: Access Tokens (short-lived) and Refresh Tokens (long-lived, hashed).
-   **Session Tracking**: Every login creates a `Session` record with device fingerprinting (IP, User Agent).
-   **Self-Service Security**: Users can view active sessions and revoke them (e.g., "Log out from all devices").
-   **Role-Based Access Control (RBAC)**: Middleware protects routes for `ADMIN` and `CAFETERIA_STAFF`.

### B. Product Management (Phase 2)
-   **CRUD Operations**: Full Create, Read, Update, Delete capabilities.
-   **Soft Delete**: Products are marked `isActive: false` instead of physical deletion to preserve historical order data.
-   **Validation**: Strict input validation using Joi schemas.

### C. Order Processing (Phase 3 & 5)
-   **Transactional Integrity**: Order creation, stock deduction, and audit logging happen in a single ACID transaction.
-   **Concurrency Control**:
    -   **Stock**: Atomic `decrement` with `stock >= quantity` check prevents overselling.
    -   **Status Updates**: Optimistic locking ensures orders move through valid state transitions (`PENDING` -> `ACCEPTED` -> `READY` -> `COMPLETED`) without race conditions.
-   **Audit Trail**: Every status change is logged via `AuditMiddleware`.

### D. Audit System (Phase 5)
-   **Comprehensive Logging**: Tracks `WHO` did `WHAT` to `WHICH` entity and `WHEN`.
-   **Middleware Integration**: `auditMiddleware(Action, Entity)` automatically captures request context.
-   **Security**: Sensitive data is sanitized before logging.

### E. Event-Driven Architecture (Phase 4)
-   **Outbox Pattern**: Events are saved to `EventOutbox` within the same transaction as the data change, ensuring 100% reliability.
-   **Event Processor**: A background worker polls for unprocessed events with **Exponential Backoff** retry logic (up to `maxRetries`).

## 3. Technical Improvements (Phase 5)

-   **Financial Integrity**: Used `Prisma.Decimal` and atomic operations for all monetary and stock calculations.
-   **Type Safety**: Resolved all TypeScript errors in `SessionService` and `EventProcessor`.
-   **Schema Enhancements**: Added `isActive` to Products, `updatedAt` to Outbox, and relations for Sessions.

## 4. Next Steps for Deployment

1.  **Database Migration**: Run `npx prisma db push` to apply schema changes.
2.  **Environment Variables**: Ensure `DATABASE_URL`, `JWT_SECRET`, and `REDIS_URL` are set.
3.  **Start Workers**: Ensure `EventProcessorWorker` is initialized alongside the API.
