# Production-Grade Todo Application - Project Architecture Overview

## 1. Project Summary

A production-grade full-stack todo application built with **Next.js 16**, **TypeScript**, **MongoDB**, **NextAuth**, and **Tailwind CSS**. This project demonstrates enterprise-level architectural patterns including service-repository layers, validation, audit logging, optimistic updates, and error handling.

**Tech Stack:**

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4, PostCSS 4
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **Authentication:** NextAuth 4.24
- **Form Validation:** Zod 4
- **Date Handling:** date-fns 4
- **Icons:** Lucide React
- **Package Manager:** PNPM
- **Code Quality:** ESLint 9, TypeScript 5

---

## 2. Project Structure

```
root/
├── app/                              # Next.js app directory (frontend + API routes)
│   ├── layout.tsx                   # Root layout with metadata & fonts
│   ├── page.tsx                     # Main page (authenticated)
│   ├── globals.css                  # Global Tailwind styles
│   ├── actions/
│   │   └── todo.actions.ts          # Server actions for todos
│   ├── api/
│   │   ├── audit/
│   │   │   └── route.ts             # GET audit logs API endpoint
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       ├── authOptions.ts   # NextAuth configuration
│   │   │       └── route.ts         # NextAuth route handler
│   │   └── todos/
│   │       ├── route.ts             # GET/POST todos endpoints
│   │       └── [id]/
│   │           └── route.ts         # PATCH/DELETE todo endpoints
│   └── signin/
│       └── page.tsx                 # Sign-in page
│
├── features/                         # Feature modules (domain-driven)
│   ├── audit-logs/
│   │   ├── index.ts                 # Public exports
│   │   ├── components/
│   │   │   └── AuditSidebar.tsx     # Audit log display component
│   │   ├── config/
│   │   │   └── audit-event-registry.ts  # Event type registry
│   │   ├── mappers/
│   │   │   └── audit.mapper.ts      # Entity → DTO transformation
│   │   ├── repositories/
│   │   │   └── audit.repository.ts  # Database access layer
│   │   ├── services/
│   │   │   └── audit.service.ts     # Business logic layer
│   │   ├── types/
│   │   │   ├── audit-events.ts      # Event type definitions
│   │   │   ├── audit.dto.ts         # Data Transfer Objects
│   │   │   └── audit.model.ts       # Database model types
│   │   └── utils/
│   │       ├── audit.ts             # Audit event recording utility
│   │       └── format-log.ts        # Log formatting utility
│   │
│   ├── todos/
│   │   ├── index.ts                 # Public exports
│   │   ├── components/
│   │   │   ├── ConfirmModal.tsx      # Confirmation dialog
│   │   │   ├── CreateTodoForm.tsx    # Todo creation form
│   │   │   ├── EmptyState.tsx        # Empty state UI
│   │   │   ├── SearchBar.tsx         # Search input component
│   │   │   ├── TodoItem.tsx          # Single todo item
│   │   │   └── TodoList.tsx          # Todo list container
│   │   ├── hooks/
│   │   │   └── useTodos.ts           # Custom hook for todo management
│   │   ├── mappers/
│   │   │   └── todo.mapper.ts        # Entity → DTO transformation
│   │   ├── repositories/
│   │   │   └── todo.repository.ts    # Database access layer
│   │   ├── services/
│   │   │   └── todo.service.ts       # Business logic layer
│   │   ├── types/
│   │   │   ├── todo.dto.ts           # Data Transfer Objects
│   │   │   └── todo.model.ts         # Database model types
│   │   └── validations/
│   │       └── todo.schema.ts        # Zod validation schema
│   │
│   └── auth/
│       ├── index.ts                 # Public exports
│       └── components/
│           └── SignInButton.tsx      # Sign-in button component
│
├── lib/                              # Shared utilities & infrastructure
│   ├── auth.ts                       # Authentication utilities
│   ├── mongodb.ts                    # MongoDB connection singleton
│   ├── events/
│   │   └── mutation-event.ts         # Event emission for mutations
│   ├── types/
│   │   └── service-result.ts         # Service response type
│   └── utils/
│       └── service-executor.ts       # Service error handling wrapper
│
├── public/                           # Static assets
│
├── Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json                # TypeScript configuration
│   ├── next.config.ts               # Next.js configuration
│   ├── eslint.config.mjs            # ESLint rules
│   ├── postcss.config.mjs           # PostCSS configuration
│   ├── tailwind.config.ts           # Tailwind CSS configuration
│   ├── pnpm-workspace.yaml          # PNPM workspace config
│   └── proxy.ts                     # Proxy configuration
│
└── Documentation
    └── README.md                    # Basic starter documentation
```

---

## 3. Architectural Patterns

### 3.1 Feature-Based Module Structure

Each feature module is **self-contained** and follows a consistent pattern:

```
feature/
├── index.ts                    # Barrel export (controls public API)
├── components/                 # UI components
├── hooks/                      # React hooks
├── services/                   # Business logic
├── repositories/               # Data access (database queries)
├── mappers/                    # Entity → DTO transformation
├── validations/                # Input validation schemas
├── types/                      # TypeScript interfaces/types
│   ├── *.dto.ts               # Data Transfer Objects
│   └── *.model.ts             # Database model types
├── config/                     # Feature configuration
└── utils/                      # Helper functions
```

**Benefits:**

- Clear separation of concerns
- Easy to locate code
- Testable layers
- Reusable across projects
- Minimal cross-feature dependencies

### 3.2 Layered Architecture (Service-Repository Pattern)

Each feature follows a 3-layer architecture:

1. **Repository Layer** (`repositories/`)
   - Direct database access
   - MongoDB operations
   - Raw database results

2. **Service Layer** (`services/`)
   - Business logic
   - Validation
   - Audit logging
   - Error handling
   - Data transformation

3. **Component/Hook Layer** (`components/`, `hooks/`)
   - UI rendering
   - User interactions
   - State management

**Example Flow:**

```typescript
Component → Hook/Action → Service → Repository → MongoDB
```

### 3.3 Type Safety with DTO (Data Transfer Object) Pattern

```
Database Model (WithId<TodoModel>)
        ↓
Repository (returns database type)
        ↓
Mapper (toTodoDto transforms model to DTO)
        ↓
Service (returns ServiceResult<TodoDto>)
        ↓
Component (works with clean DTO)
```

**Files:**

- `types/todo.model.ts` - Database schema
- `types/todo.dto.ts` - Public API contract
- `mappers/todo.mapper.ts` - Transformation logic

### 3.4 Error Handling with ServiceResult Type

All services return a discriminated union type:

```typescript
type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

**Benefits:**

- Type-safe error handling
- No exceptions leaked to consumers
- Explicit success/failure channel
- Easy to work with in React

### 3.5 Server Actions with "use server" Directive

Located in `app/actions/`:

- Server-side mutations (create, update, delete)
- Automatic CSRF protection
- Automatic request deduplication
- Direct database access

```typescript
"use server";
export async function createTodoAction(input: { title: string }) {
  // Runs entirely on server
  // Type-safe from client
}
```

### 3.6 Validation with Zod

Single source of truth for validation:

```typescript
// features/todos/validations/todo.schema.ts
export const TodoSchema = z.object({
  title: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, "Title is required")
    .refine((val) => val.length <= 100, "Title must be under 100 characters"),
});
```

**Usage:**

- Input validation in services
- Type inference for components
- Server action validation

---

## 4. Key Features & Patterns

### 4.1 Authentication (NextAuth)

**Location:** `app/api/auth`, `lib/auth.ts`

- GitHub OAuth provider
- Session-based authentication
- User ID extraction from session
- Protected routes (via `requireUserId()`)

**Configuration:**

```typescript
// app/api/auth/[...nextauth]/authOptions.ts
export const authOptions: NextAuthOptions = {
  providers: [GitHubProvider(...)],
  callbacks: {
    async session({ session, token }) {
      (session.user as any).id = token.sub
    }
  }
}
```

### 4.2 Database Connection (MongoDB Singleton)

**Location:** `lib/mongodb.ts`

- Connection pooling
- Development hot-reload safe
- Centralized database access
- Error handling for missing URI

```typescript
let clientPromise: Promise<MongoClient>;
// Reuses connection in development mode
```

### 4.3 Optimistic Updates

**Location:** `features/todos/hooks/useTodos.ts`

Uses React's `useOptimistic` hook:

- Immediate UI feedback
- Server mutation happens asynchronously
- Conflicts detected and handled
- Better UX

```typescript
const [optimisticTodos, addOptimisticTodo] = useOptimistic(
  initialTodos,
  (state, newTodo) => [newTodo, ...state],
);
```

### 4.4 Audit Logging System

**Location:** `features/audit-logs/`

Automatically tracks:

- Todo creation
- Todo completion/un-completion
- Todo deletion

**Event Registry:**

```typescript
export const AuditEvents = {
  todo: {
    created: "todo.created",
    deleted: "todo.deleted",
    completed: "todo.completed",
    uncompleted: "todo.uncompleted",
  },
};
```

### 4.5 Search & Real-time Filtering

**Location:** `features/todos/hooks/useTodos.ts`

- Debounced search query
- Real-time filtering
- Request deduplication
- Loading states

### 4.6 Conflict Detection (Optimistic Locking)

**Location:** `features/todos/repositories/todo.repository.ts`

Uses MongoDB version field:

- Detects concurrent updates
- Prevents lost updates
- Returns conflict error to client

```typescript
// Conflict detection in updateTodoStatusRepo
db.collection<TodoModel>(COLLECTION).findOneAndUpdate(
  { _id: new ObjectId(id), version: version }, // Version check
  { $set: { completed, updatedAt: new Date() }, $inc: { version: 1 } },
);
```

---

## 5. API Endpoints

### 5.1 Todo Endpoints

**GET /api/todos**

- Fetch all user todos
- Returns: `TodoDto[]`
- Protected: Yes (requires authentication)

**POST /api/todos**

- Create new todo
- Body: `{ title: string }`
- Returns: `{ _id: string; ...TodoDto }`
- Protected: Yes

**PATCH /api/todos/[id]**

- Update todo status (toggle complete)
- Body: `{ completed: boolean; version: number }`
- Returns: `TodoDto`
- Conflict Detection: Yes

**DELETE /api/todos/[id]**

- Delete todo
- Returns: Success message
- Protected: Yes

### 5.2 Audit Log Endpoints

**GET /api/audit**

- Fetch audit logs for current user
- Query: `?limit=50&skip=0`
- Returns: `AuditDto[]`
- Protected: Yes

### 5.3 Authentication Endpoints

**NextAuth route:** `/api/auth/[...nextauth]`

- Handles all authentication flows
- Configured in `authOptions.ts`

---

## 6. Data Models

### 6.1 Todo Model (Database)

```typescript
interface TodoModel {
  userId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number; // For conflict detection
}
```

**Storage:** MongoDB collection `production-todos`

### 6.2 Todo DTO (API Response)

```typescript
interface TodoDto {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Note:** Version field excluded from DTO (internal only)

### 6.3 Audit Model (Database)

```typescript
interface AuditModel {
  userId: string;
  event: AuditEvent;
  metadata: Record<string, unknown>;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}
```

---

## 7. Configuration Files

### 7.1 TypeScript Configuration (`tsconfig.json`)

- **Target:** ES2017
- **Strict Mode:** Enabled
- **Module Resolution:** Bundler
- **Path Aliases:** `@/*` → root directory
- Includes Next.js plugin

### 7.2 ESLint Configuration (`eslint.config.mjs`)

- Uses flat config format (ESLint 9)
- Extends `eslint-config-next/core-web-vitals`
- Extends `eslint-config-next/typescript`
- Custom ignores for build artifacts

### 7.3 Tailwind Configuration

- PostCSS 4 support
- Custom fonts integration
- Default color scheme (slate-based)

### 7.4 Environment Variables Required

```env
MONGODB_URI=<mongodb_connection_string>
GITHUB_ID=<github_oauth_id>
GITHUB_SECRET=<github_oauth_secret>
NEXTAUTH_SECRET=<random_secret_for_encryption>
```

---

## 8. Styling & UI

### 8.1 Design System

- **Font:** Plus Jakarta Sans (Google Fonts)
- **Colors:** Slate color palette
- **Layout:** Flex-based responsive design
- **Icons:** Lucide React

### 8.2 Component Philosophy

- Functional components
- TypeScript prop typing
- Tailwind utility classes
- Compound component patterns

### 8.3 Responsive Design

- Mobile-first approach
- Hidden elements on small screens
- Sidebar hidden on mobile (`hidden lg:block`)
- Full-width layout on mobile

---

## 9. Performance Optimizations

### 9.1 Next.js App Router

- Server components by default
- Code splitting automatic
- Streaming for better TTM

### 9.2 Caching

- `revalidatePath()` for on-demand revalidation
- MongoDB connection pooling
- React Query implicit caching (through optimistic updates)

### 9.3 Database

- Indexed queries (userId)
- Sorted results (createdAt descending)
- Version field for optimistic locking

### 9.4 Frontend

- Optimistic updates (immediate feedback)
- Debounced search (reduces server requests)
- Lazy loading of audit sidebar

---

## 10. Security Measures

### 10.1 Authentication

- NextAuth session validation
- `requireUserId()` protection on protected routes
- Server actions automatically protected
- CSRF token automatic handling

### 10.2 Data Isolation

- All queries filtered by `userId`
- No cross-user data leakage
- Server-side validation

### 10.3 Input Validation

- Zod schema validation on server
- Type-safe transformations
- Length restrictions (title ≤ 100 chars)

### 10.4 Error Handling

- No sensitive data in error messages
- Generic error responses
- Server exceptions don't leak details

---

## 11. Development Workflow

### 11.1 Available Scripts

```bash
pnpm dev      # Start development server (port 3000)
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

### 11.2 Development Environment

- Hot module replacement (HMR)
- Type checking on save
- ESLint integration
- Development MongoDB connection pooling

### 11.3 Code Quality Tools

- **TypeScript:** Full type checking
- **ESLint:** Static analysis (9.x)
- **Prettier:** Code formatting (via ESLint)
- **Zod:** Runtime validation

---

## 12. Deployment Considerations

### 12.1 Environment Setup

1. Set `NODE_ENV=production`
2. Configure all environment variables
3. Deploy MongoDB (Atlas, self-hosted, etc.)
4. Set up GitHub OAuth app

### 12.2 Build Output

- Next.js creates `.next` directory
- Standalone build support
- Size optimization automatic

### 12.3 Recommended Platforms

- **Hosting:** Vercel (for Next.js)
- **Database:** MongoDB Atlas
- **Auth:** GitHub OAuth (configurable)
- **Monitoring:** Next.js Analytics (Vercel)

---

## 13. Extensibility & Reusability

This project is designed to be **template-ready**. To create a new project with similar patterns:

### 13.1 Copy These Patterns

1. **Feature module structure** - Copy features/ folder structure
2. **Layer architecture** - services → repositories → database
3. **Type safety** - Use DTO pattern with mappers
4. **Error handling** - Use ServiceResult discriminated union
5. **Validation** - Zod schemas in validations/ folder
6. **Authentication** - NextAuth setup in app/api/auth/

### 13.2 Configuration Points for New Features

- Add new feature folder in `features/`
- Create service, repository, types, components
- Export public API via `index.ts`
- Add API routes in `app/api/`
- Add server actions if needed

### 13.3 Database Schema Changes

1. Update `types/*model.ts`
2. Create indexes in MongoDB
3. Create mapper if DTO differs
4. Add validation schema

---

## 14. File Naming Conventions

| File Type      | Pattern                          | Location        |
| -------------- | -------------------------------- | --------------- |
| Components     | `PascalCase.tsx`                 | `components/`   |
| Hooks          | `useHookName.ts`                 | `hooks/`        |
| Services       | `feature.service.ts`             | `services/`     |
| Repositories   | `feature.repository.ts`          | `repositories/` |
| Mappers        | `feature.mapper.ts`              | `mappers/`      |
| Validators     | `feature.schema.ts`              | `validations/`  |
| Models         | `*.model.ts`                     | `types/`        |
| DTOs           | `*.dto.ts`                       | `types/`        |
| Utilities      | `descriptive-name.ts`            | `utils/`        |
| API Routes     | `route.ts` or `[param]/route.ts` | `app/api/`      |
| Server Actions | `feature.actions.ts`             | `app/actions/`  |

---

## 15. Common Workflows

### 15.1 Adding a New Feature Module

```bash
# Create feature folder
mkdir -p features/newfeature/{components,hooks,services,repositories,types,validations,utils}

# Create files
touch features/newfeature/{
  index.ts,
  types/newfeature.model.ts,
  types/newfeature.dto.ts,
  validations/newfeature.schema.ts,
  repositories/newfeature.repository.ts,
  services/newfeature.service.ts,
  mappers/newfeature.mapper.ts
}
```

### 15.2 Adding a New API Endpoint

1. Create file in `app/api/feature/[id]/route.ts`
2. Export `GET`, `POST`, `PATCH`, or `DELETE` functions
3. Call service layer
4. Return JSON response
5. Handle authentication with `requireUserId()`

### 15.3 Adding a Server Action

1. Create in `app/actions/feature.actions.ts`
2. Mark with `"use server"` directive
3. Call service layer
4. Call `revalidatePath()` if needed
5. Return result with type-safe response

---

## 16. Dependencies Quick Reference

| Package        | Version | Purpose         |
| -------------- | ------- | --------------- |
| `next`         | 16.1.6  | React framework |
| `react`        | 19.2.3  | UI library      |
| `typescript`   | 5       | Type safety     |
| `mongodb`      | 7.1.0   | Database driver |
| `next-auth`    | 4.24.13 | Authentication  |
| `zod`          | 4.3.6   | Validation      |
| `date-fns`     | 4.1.0   | Date utilities  |
| `tailwindcss`  | 4       | CSS framework   |
| `lucide-react` | 0.575.0 | Icons           |

---

## Summary

This production-grade todo application demonstrates:

✅ **Feature-Based Architecture** - Scalable, maintainable structure  
✅ **Layer Separation** - Services, repositories, components  
✅ **Type Safety** - Full TypeScript, DTO pattern, Zod validation  
✅ **Error Handling** - Discriminated unions, no exceptions  
✅ **Authentication** - NextAuth integration  
✅ **Audit Logging** - Track all user actions  
✅ **Optimistic Updates** - Better UX with React's useOptimistic  
✅ **Conflict Detection** - Version-based optimistic locking  
✅ **Code Quality** - ESLint, TypeScript strict mode  
✅ **Responsive Design** - Tailwind CSS responsive patterns

This structure can be replicated for any feature-rich application requiring similar patterns.
