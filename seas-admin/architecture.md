# SEAS Admin Portal Frontend Architecture
## Client-Side Application
### React + Vite + TypeScript + Storybook

---

# 1. ARCHITECTURE OVERVIEW

The SEAS Admin Portal (`seas-admin`) is a single-page application (SPA) focused on system administration, configuration, and exam lifecycle management.

Characteristics:
- Built with React 19 and compiled via Vite
- Strongly typed with TypeScript for consistency
- Component-driven architecture
- Strict separation between server state (React Query) and client state (Zustand)
- Declarative routing using React Router v7
- Form handling and data-grid support for complex administrative workflows
- Component-first development and visual testing via Storybook

Core architectural principles:
- **Pages vs Components:** `pages` assemble complex dashboards and data tables, while `components` encapsulate reusable UI elements.
- **State Management:** Local state for component specifics, Zustand for global UI state (auth, sidebars), and React Query for server data caching.
- **Type Safety:** Ensures admin operations correctly map to backend representations.
- **Security-First UI:** Role-based conditional rendering for administrative operations (Super Admin vs Examiner).

---

# 2. PROJECT STRUCTURE

```text
seas-admin/
│
├── .storybook/                    <-- Storybook configuration
│   ├── main.ts
│   └── preview.ts
│
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   │   └── DataTable/
│   │       ├── index.tsx
│   │       └── DataTable.stories.tsx  <-- Story co-located with component
│   ├── config/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
├── .env
├── vite.config.ts
├── package.json
└── tsconfig.json
```

---

# 3. ENTRY LAYER

`src/main.tsx`
Responsibilities:
- Application bootstrap
- Mounts the React tree to the DOM (`#root`)
- Initializes global context providers (e.g., React Query Client Provider)

`src/App.tsx`
Responsibilities:
- Configures central routing (React Router)
- Assembles layouts and routes mapping
- Maintains top-level error boundaries and global notification systems (Toasters)

---

# 4. CONFIGURATION LAYER

Location: `src/config/`

Files (Typical):
- `env.ts`: Extrapolates and validates environment variables.
- `constants.ts`: Global values (e.g., table pagination limits, accepted document formats).
- `navigation.ts`: Defines the sidebar navigation tree and associated role requirements.

---

# 5. API & NETWORK LAYER

Location: `src/api/`

Responsibilities:
- Pre-configured HTTP client (Axios)
- Request interceptors to inject authorization headers
- Response interceptors for handling 401 (re-authentication) and 403 (access denied) events

Rule:
Do not perform raw `fetch` or direct Axios calls inside UI elements. All calls go through API service modules or custom hooks.

---

# 6. ROUTING & LAYOUTS

Location: `src/layouts/`

Responsibilities:
- Establishes the structural backbone of the admin portal
- Examples: 
  - `AuthLayout`: Minimalist layout for login/recovery
  - `AdminLayout`: Standard dashboard layout containing a Sidebar, Header (with user profile), and a main content area.

Rule:
Layouts wrap `pages` and provide consistent navigation context across different sections of the portal.

---

# 7. COMPONENTS & PAGES LAYER

Components (`src/components/`)
Responsibilities:
- Reusable admin UI blocks (Data Tables, Status Badges, Action Menus, Modals)
- Strict separation from business logic to ensure they can be used anywhere.

Pages (`src/pages/`)
Responsibilities:
- Compose standard pages (e.g., `CandidateList`, `ApplicationReview`, `ExamCenterSetup`)
- Interact with data-fetching hooks
- Manage complex view states like filtering, sorting, and pagination

---

# 8. STATE MANAGEMENT LAYER

Server State (`@tanstack/react-query`)
- Single source of truth for administrative data.
- Handles pagination caching, data invalidation upon edits, and background status syncing.

Client State (`src/store/` - Zustand)
- Stores UI preferences like collapsed/expanded sidebar state.
- Stores the currently logged-in administrator's profile and permissions.

---

# 9. CUSTOM HOOKS

Location: `src/hooks/`

Responsibilities:
- Encapsulates data layer logic (e.g., `useFetchCandidates(filters)`, `useApproveApplication()`).
- Reusable UI behaviors (e.g., `useTableSelection()`, `useDebounceValue()`).

---

# 10. TYPES & UTILS

Types (`src/types/`)
- Strict type definitions corresponding to backend entities (Users, Applications, Centers, Exams).
- Types for UI structures like Table Columns or Select Options.

Utils (`src/utils/`)
- Formatting functions (Dates, Metrics).
- Auth helpers (checking permissions).
- Styling utilities (`clsx`, `tailwind-merge`).

---

# 11. FORM HANDLING & VALIDATION

Tools: `react-hook-form` + `zod`

Responsibilities:
- Form state management decoupled from renders.
- `zod` schemas for rigorous input validation on administrative tasks (e.g., validating score inputs or exam configurations).

---

# 12. STYLING

Tools: Tailwind CSS v4 + Framer Motion
- Utility-first CSS using Tailwind.
- Emphasis on high-density information display (Data Tables, Admin Widgets) while maintaining clarity and responsiveness.
- Subtle animations (`framer-motion`) for transitions and modal interactions.

---

# 13. UI DOCUMENTATION & COMPONENT TESTING (STORYBOOK)

Tool: Storybook v8 (Vite builder)

## Purpose
Provides an isolated environment to build, document, and visually verify complex admin UI components (Data Tables, Action Menus, Status Badges, Modals) without running the full application or requiring authenticated backend calls.

## Installation
```bash
pnpx storybook@latest init
```
Auto-detects the Vite + React setup and scaffolds the `.storybook/` directory.

## Configuration

`.storybook/main.ts`
- Framework: `@storybook/react-vite`
- Story discovery glob: `src/**/*.stories.tsx`
- Addons: `@storybook/addon-essentials`, `@storybook/addon-a11y`

`.storybook/preview.ts`
Responsibilities:
- Imports `../src/index.css` so all Tailwind CSS v4 styles render correctly inside the canvas.
- Defines global **Decorators** providing all required context to every story:
  - `BrowserRouter` — prevents crashes from `<Link>` and `useNavigate` in admin navigation components.
  - `QueryClientProvider` — allows components using React Query hooks to render without errors.

## Story Co-location Strategy
Each story lives directly next to the component it documents:
```text
src/components/
├── DataTable/
│   ├── index.tsx
│   └── DataTable.stories.tsx
├── StatusBadge/
│   ├── index.tsx
│   └── StatusBadge.stories.tsx
├── ConfirmModal/
│   ├── index.tsx
│   └── ConfirmModal.stories.tsx
```
Rule: Never place stories in a top-level `stories/` folder separate from the component source.

## Admin-Focused Story Examples (CSF3)
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from '.';

const meta: Meta<typeof StatusBadge> = {
  component: StatusBadge,
  title: 'Admin/StatusBadge',
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Approved: Story = {
  args: { status: 'approved' },
};

export const Pending: Story = {
  args: { status: 'pending' },
};

export const Rejected: Story = {
  args: { status: 'rejected' },
};
```

## Development Workflow
1. Build the admin component in isolation in Storybook.
2. Verify all status variants and edge cases (empty tables, loading states, error states).
3. Only then integrate the component into a page and wire up real React Query hooks.

## npm Scripts
```json
"storybook": "storybook dev -p 6007",
"build-storybook": "storybook build"
```
Note: Admin Storybook runs on port `6007` to avoid conflict with `seas-public` on port `6006`.

---

# 14. DEVELOPMENT RULES

1. Always define explicit TypeScript interfaces for backend responses.
2. Abstract complex table and form logic into separate components to keep pages thin.
3. Manage loading and error states aggressively to provide a seamless admin experience.
4. Data invalidation (React Query) must be precise after mutations to ensure dashboards always show up-to-date data.
5. Apply RBAC (Role-Based Access Control) checks at the route, page, and action-level.
6. Use centralized formatters for consistency across tables and reports.
7. Every new shared component in `src/components/` must have an accompanying `.stories.tsx` file.
8. Build and verify all admin component status variants visually in Storybook before integrating into pages.

---

# 15. SUMMARY

This admin architecture provides:

- Scalability to handle large datasets and complex filtering workflows.
- Strong type safety mitigating runtime errors typical in admin dashboards.
- Highly consistent user interface powered by standardized components and Tailwind CSS.
- Optimized network usage through React Query's efficient caching and background updates.
- Living documentation and visual component verification via Storybook.
