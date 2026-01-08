# System Architecture

This document describes the high-level architecture of the Integrated School System (Sistem Terintegrasi Sekolah).

## 🏗️ Architecture Overview

The system is built using a modern full-stack architecture leveraging Next.js 14 (App Router) for both frontend and backend API capabilities, connected to a PostgreSQL database via Supabase.

```ascii
+-----------------------------------------------------------------------------+
|                                 Client Side                                 |
|                               (Browser/Device)                              |
+-----------------------------------------------------------------------------+
       |                                     |                                |
       | HTTP/HTTPS                          | WebSocket (Realtime)           |
       v                                     v                                |
+-----------------------------------------------------------------------------+
|                                  Next.js 14                                 |
|                                (Vercel Edge)                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +-------------------+    +-------------------+    +-------------------+    |
|  |    App Router     |    |    API Routes     |    |    Middleware     |    |
|  | (React Server     |    | (Server Functions)|    | (Auth & Security) |    |
|  |  Components)      |    |                   |    |                   |    |
|  +--------+----------+    +---------+---------+    +---------+---------+    |
|           |                         |                        |              |
|           |                         |                        |              |
|  +--------v----------+    +---------v---------+              |              |
|  |   UI Components   |    |   Auth.js (Auth)  |              |              |
|  | (Shadcn/Tailwind) |    |                   |              |              |
|  +-------------------+    +-------------------+              |              |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  |                           Data Access Layer                           |  |
|  |                             (Drizzle ORM)                             |  |
|  +-----------------------------------------------------------------------+  |
|                                                                             |
+-------------------------------------+---------------------------------------+
                                      |
                                      | TCP/IP (Pooler)
                                      v
+-----------------------------------------------------------------------------+
|                               Database Layer                                |
|                           (Supabase PostgreSQL)                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +-------------------+    +-------------------+    +-------------------+    |
|  |      Tables       |    |      Indexes      |    |     Relations     |    |
|  | (Users, Students, |    | (Performance Opt) |    | (Foreign Keys)    |    |
|  |  Grades, etc.)    |    |                   |    |                   |    |
|  +-------------------+    +-------------------+    +-------------------+    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 🧩 Key Components

### 1. Frontend Layer
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: Shadcn UI (Radix Primitives)
- **State Management**: React Server Components (Server State) + React Hooks (Client State)
- **Error Handling**: React Error Boundaries + Sentry
- **Notifications**: React-Toastify

### 2. Backend Layer
- **Runtime**: Node.js / Vercel Edge Runtime
- **API**: Next.js Route Handlers
- **Authentication**: Auth.js (NextAuth v5) with JWT strategy
- **Validation**: Zod schema validation

### 3. Database Layer
- **Database**: PostgreSQL (hosted on Supabase)
- **ORM**: Drizzle ORM
- **Connection**: Connection pooling via Supabase Transaction Pooler
- **Optimization**: Custom indexes on frequently queried columns

### 4. Monitoring & Observability
- **Error Tracking**: Sentry (Client, Server, Edge)
- **Performance Monitoring**: Sentry Performance
- **Session Replay**: Sentry Replay

## 🔄 Data Flow

### Authentication Flow
1. User submits credentials on Login Page
2. `auth.ts` validates credentials against Database
3. JWT token is generated and stored in HTTP-only cookie
4. Middleware validates token on protected routes
5. User is redirected based on role (Admin/Student)

### Data Fetching Flow (Server Components)
1. User requests a page (e.g., `/dashboard`)
2. Server Component (`page.tsx`) calls Drizzle ORM function
3. Drizzle queries PostgreSQL database
4. Data is returned and rendered on the server
5. HTML is streamed to the client

### Data Mutation Flow (Server Actions)
1. User submits a form (e.g., "Add Student")
2. Server Action is triggered
3. Zod validates input data
4. Drizzle performs INSERT/UPDATE operation
5. `revalidatePath` updates the UI cache
6. User sees updated data immediately

## 🛡️ Security Measures

- **Authentication**: Secure session management with HttpOnly cookies
- **Authorization**: Role-based access control (RBAC) via Middleware
- **Input Validation**: Strict schema validation using Zod
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **XSS Protection**: React's automatic escaping
- **CSRF Protection**: Next.js built-in protection

## 🚀 Performance Optimizations

- **Code Splitting**: `React.lazy` / `next/dynamic` for admin components
- **Database Indexing**: Strategic indexes on foreign keys and filter columns
- **Image Optimization**: `next/image` for automatic resizing and format conversion
- **Font Optimization**: `next/font` for zero layout shift
- **Server Components**: Reduced client-side JavaScript bundle

## 📂 Directory Structure

```
sistem-terintegrasi/
├── app/                    # App Router (Pages & Layouts)
│   ├── (auth)/             # Auth routes group
│   ├── dashboard/          # Admin dashboard routes
│   ├── student/            # Student portal routes
│   └── api/                # API endpoints
├── components/             # React components
│   ├── admin/              # Admin-specific components
│   ├── ui/                 # Reusable UI components
│   └── ...
├── db/                     # Database configuration
│   ├── migrations/         # SQL migration files
│   └── schema.ts           # Drizzle schema definitions
├── lib/                    # Utilities & Helpers
│   ├── error-handler.ts    # Centralized error handling
│   └── utils.ts            # Helper functions
├── public/                 # Static assets
└── scripts/                # Utility scripts (e.g., indexes)
```

## 🔌 External Integrations

- **Supabase**: Database hosting & Auth adapter
- **Sentry**: Error tracking & performance monitoring
- **Vercel**: Hosting & deployment platform
- **Formspree**: Contact form handling (optional)

---

**Last Updated**: 2025-12-03
**Version**: 1.0.0
