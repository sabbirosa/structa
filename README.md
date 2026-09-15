# Structa Workforce

Structa is a production-style workforce operations demo focused on people, employment records, and classifications. It demonstrates reusable frontend architecture, server-driven tables, validated forms, and centralized role permissions without requiring an external backend.

## Tech stack

- Next.js 16 App Router, React 19, and strict TypeScript
- Tailwind CSS 4 and shadcn/ui
- ReUI Data Grid with TanStack Table
- React Hook Form and Zod
- Zustand for role-preview state
- Next.js Route Handlers backed by local JSON fixtures
- Jest and React Testing Library

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The app needs no database or external service.

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Environment variables

No variables are required for the mock implementation. Copy `.env.example` when replacing the local routes with a remote service.

## Structure

```text
app/
  api/                    Next.js API routes for paged resources
  people/                 People list and detail/edit routes
  employment/             Employment list and detail/edit routes
  classifications/        Classification management
components/
  data-table/              Generic ReUI-backed table orchestration
  form/                    Shared field, error, success, and info components
  export/                  Common CSV export action
  permissions/             Auth/RBAC HOC and permission-aware rendering
  reui/                    Installed ReUI Data Grid registry source
data/                      Offline JSON resource fixtures
hooks/                     Paged API and resource loading hooks
lib/api/                   Typed client, query, and server helpers
stores/                    Zustand role state
types/                     API resource contracts
```

## Architecture

### Reusable DataTable

`components/data-table/data-table.tsx` owns search, filter, sorting, pagination, loading, empty, and error behavior. Feature pages only provide typed columns, searchable accessors, filter configuration, row actions, and an endpoint callback. ReUI supplies the table rendering and pagination primitives; TanStack Table owns table state.

Lists use manual server mode. A page change produces a browser request such as:

```text
/api/people?page=2&pageSize=10&search=maya&sortBy=name&sortDirection=asc&filter_department=People
```

The API applies filters, sorting, and pagination before returning `{ data, total, page, pageSize }`, so every table interaction is observable in DevTools Network and mirrors a real backend integration.

### State and permissions

Zustand stores the demo user session and active role. Permissions are defined once in `lib/permissions.ts`. Every protected screen is wrapped by the shared `withAuthorization()` HOC, which checks authentication and route-level RBAC before rendering. Components use `can()` or `<Can permission="…">` for finer-grained action and field controls. Admins have full edit access, managers can edit permitted employment fields, and viewers are read-only. The sidebar account switcher makes each role immediately testable.

### Forms and errors

Forms use React Hook Form with Zod schemas. All text, date, select, and textarea controls are shared shadcn components. Invalid fields receive an accessible error border and message; submission failures appear in the common top-level form alert. Contextual info blocks explain sensitive or restricted fields.

### Mock API and offline development

Only route handlers import JSON. UI code calls typed clients or `/api/*`, preserving a real network boundary while remaining fully offline. The fixtures contain 52 people and 52 employment records to exercise pagination, search, filters, and sorting.

### Replacing with FastAPI/OpenAPI

1. Generate a TypeScript client from the FastAPI OpenAPI document.
2. Keep the resource types or replace them with generated equivalents.
3. Replace fetch implementations in `lib/api/` and the endpoint passed to `usePagedApi`.
4. Map the generated pagination response to `{ data, total, page, pageSize }`.
5. Remove `app/api/*` and `data/*.json` when the remote API is authoritative.

The tables, forms, and permission components require no changes as long as that boundary stays stable.

## Theme

Use the header theme button or press `d` outside an input to switch between light and dark themes.
