# SEAS Public Portal Frontend Architecture
## Client-Side Application
### React + Vite + TypeScript + Storybook

---

# 1. ARCHITECTURE OVERVIEW

The SEAS Public Portal (`seas-public`) is a single-page application (SPA) designed to serve candidates and the general public.

Characteristics:
- Built with React 19 and compiled via Vite
- Strongly typed with TypeScript
- Component-driven architecture
- Strict separation between server state (React Query) and client state (Zustand)
- Declarative routing using React Router v7
- Form handling and validation layer using standard libraries
- Component-first development and visual testing via Storybook

Core architectural principles:
- **Pages vs Components:** `pages` handle routing and data fetching orchestration, while `components` are presentation-focused and highly reusable.
- **State Management:** Local state (`useState`) is preferred unless data is globally shared (Zustand) or fetched from the API (React Query).
- **Type Safety:** All data structures, API responses, and component props are strictly typed.
- **Predictable Side Effects:** API calls are abstracted away into dedicated functions and hooks, keeping components clean.

---

# 2. PROJECT STRUCTURE

```text
seas-public/
│
├── .storybook/                    <-- Storybook configuration
│   ├── main.ts
│   └── preview.ts
│
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   │   └── Button/
│   │       ├── index.tsx
│   │       └── Button.stories.tsx  <-- Story co-located with component
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
- Initializes global providers (e.g., React Query Client Provider, Theme Provider)

`src/App.tsx`
Responsibilities:
- Configures the central routing (React Router)
- Connects layouts and pages to their respective routes
- Manages top-level application boundaries (like Error Boundaries or global modals)

---

# 4. CONFIGURATION LAYER

Location: `src/config/`

Files (Typical):
- `env.ts`: Validates and exports environment variables (`VITE_API_BASE_URL`, etc.).
- `constants.ts`: Application-wide constants, pagination defaults, and token keys.

Rule:
Magic strings and environment variables must be centralized here and not accessed directly (`import.meta.env`) inside components.

---

# 5. API & NETWORK LAYER

Location: `src/api/`

Responsibilities:
- Configures the base HTTP client (Axios)
- Manages request/response interceptors
- Automatically handles token attachment (Bearer tokens)
- Handles global API error interception (e.g., redirecting to login on 401 Unauthorized)

Rule:
Components must not instantiate Axios directly. All network requests go through the configured client.

---

# 6. ROUTING & LAYOUTS

Location: `src/layouts/`

Responsibilities:
- Defines structural wrappers for pages
- Manages persistent UI elements (Navbars, Sidebars, Footers)
- Examples: 
  - `PublicLayout`: For unauthenticated pages (Landing, Login, Register).
  - `DashboardLayout`: For authenticated candidate sessions.

Rule:
Layouts should control structure but avoid fetching page-specific data.

---

# 7. COMPONENTS & PAGES LAYER

Components (`src/components/`)
Responsibilities:
- Dumb/Presentational components (Buttons, Inputs, Modals, Cards)
- Highly reusable UI blocks
- Can be composed to create complex interfaces
- Rule: Business logic should be kept to a minimum in shared components.

Pages (`src/pages/`)
Responsibilities:
- Map directly to routes defined in `App.tsx`
- Connects to hooks to fetch server data (React Query)
- Passes data down to components
- Manages page-level state and form submissions
- Rule: Pages control the "What" and "When", Components control the "How.

---

# 8. STATE MANAGEMENT LAYER

Server State (`@tanstack/react-query`)
- Managed implicitly mapping the `api/` layer to hooks.
- Handles caching, background refetching, and loading states for backend data.

Client State (`src/store/` - Zustand)
- Manages global synchronous UI state (e.g., currently authenticated user profile, theme preference, wizard step state).
- Kept minimal.

Rule:
Do not duplicate server data into Zustand. Use React Query for any data coming from the backend.

---

# 9. CUSTOM HOOKS

Location: `src/hooks/`

Responsibilities:
- Extracts complex logic from components.
- Encapsulates React Query mutations and queries into semantic hooks (e.g., `useLogin()`, `useCandidateProfile()`).
- Encapsulates UI logic (e.g., `useClickOutside()`, `useDebounce()`).

---

# 10. TYPES & UTILS

Types (`src/types/`)
- Contains global TypeScript interfaces and type aliases.
- Models (e.g., `Candidate`, `Application`, `ExamSession`).
- API payload types.

Utils (`src/utils/`)
- Pure functions.
- Date formatting (`date-fns`).
- Data parsers, string manipulation, and string construction (`clsx`, `tailwind-merge`).
- Formatting currency or ID numbers.

---

# 11. FORM HANDLING & VALIDATION

Tools: `react-hook-form` + `zod`

Responsibilities:
- `zod` schemas are defined alongside forms to enforce strict validation rules matching the backend.
- `react-hook-form` manages form state, preventing unnecessary re-renders.

Rule:
All data sent to the API must pass client-side validation first to provide immediate user feedback.

---

# 12. STYLING

Tools: Tailwind CSS v4 + Framer Motion
- Utility-first approach via Tailwind.
- `clsx` and `tailwind-merge` handle dynamic class merging.
- Animations and transitions managed through `framer-motion` for complex layouts.

---

# 13. UI DOCUMENTATION & COMPONENT TESTING (STORYBOOK)

Tool: Storybook v8 (Vite builder)

## Purpose
Storybook provides an isolated environment to develop, document, and visually test UI components independently of the backend and routing.

## Installation
```bash
pnpx storybook@latest init
```
Storybook auto-detects the Vite + React setup and scaffolds the `.storybook/` directory.

## Configuration

`.storybook/main.ts`
- Specifies the Vite framework.
- Configures story discovery glob pattern: `src/**/*.stories.tsx`
- Enables addons: `@storybook/addon-essentials`, `@storybook/addon-a11y`

`.storybook/preview.ts`
Responsibilities:
- Imports `../src/index.css` so Tailwind CSS v4 styles apply inside the Storybook canvas.
- Defines global **Decorators** to provide required application context to every story:
  - `BrowserRouter` decorator (from `react-router-dom`) — prevents crashes from `<Link>` or `useNavigate` in components.
  - `QueryClientProvider` decorator (from `@tanstack/react-query`) — enables components that call hooks using React Query to render correctly.

## Story Co-location Strategy
Each story file lives directly next to the component it documents:
```text
src/components/
├── Button/
│   ├── index.tsx
│   └── Button.stories.tsx
├── ApplicationCard/
│   ├── index.tsx
│   └── ApplicationCard.stories.tsx
```

Rule: Never group stories in a top-level `stories/` folder separate from the components.

## Story Structure
Each `.stories.tsx` file follows the Component Story Format (CSF3):
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '.';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { label: 'Submit Application', variant: 'primary' },
};

export const Loading: Story = {
  args: { label: 'Submitting...', isLoading: true },
};
```

## Development Workflow
- Run Storybook locally: `pnpm run storybook` (port `6006`)
- Build static Storybook: `pnpm run build-storybook`
- Components are built and verified in isolation in Storybook **before** being assembled into pages.

## npm Scripts (added to `package.json`)
```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

---

# 14. DEVELOPMENT RULES

1. Always use TypeScript interfaces/types for props and API responses.
2. Keep components small, focused, and testable.
3. Move business and data-fetching logic into custom hooks.
4. Avoid "Prop Drilling"—use Zustand or context sparingly when 3+ levels deep.
5. Use React Query for all API interactions to maintain a single source of truth.
6. Validate all forms using Zod schemas.
7. Use semantic HTML and maintain accessibility standard practices.
8. Every new shared component in `src/components/` must have an accompanying `.stories.tsx` file.
9. Build and verify components visually in Storybook before integrating them into pages.

---

# 15. SUMMARY

This modular frontend architecture ensures:

- High performance and developer experience (Vite + React)
- Predictable and bug-free data flow (TypeScript + React Query)
- Scalable UI development (Tailwind + Component design)
- Living component documentation and visual regression testing (Storybook)
- Clear path for future enhancements like multi-step applications and real-time exam logic.
