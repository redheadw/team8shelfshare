# ShelfShare – Copilot Instructions

ShelfShare is a neighborhood lending library: members list everyday items (tools, books, camping gear) and borrow from neighbors.
Team 8 (WDD 430): Gwyn Wright, Daniel Rasmuson, Danae De la Cruz Jiménez, Emmanuel Nduka Eze.

## Tech stack

- Next.js 16 with the App Router (no Pages Router). Cache Components and Partial Prefetching are enabled in `next.config.ts`.
- This Next.js version differs from older versions: check `node_modules/next/dist/docs/` before using an API.
- TypeScript in strict mode. Never use `any`; type props, state, and API responses.
- Tailwind CSS v4 (utility classes; no custom CSS unless necessary).
- Database: Neon serverless PostgreSQL via `@neondatabase/serverless`. Import the shared client from `@/lib/db` (`sql` tagged template).
- Authentication: Auth.js v5 (next-auth) with email/password credentials, bcrypt password hashing (`@/lib/password`), and JWT sessions. Use `auth()` from `@/auth` to get the signed-in user (`session.user.id`).
- Hosting: Vercel. Secrets live in environment variables (`DATABASE_URL`); never hard-code them.

## Folder structure

- `app/` – routes.
  - Public: `/`, `/login`, `/register`, `/items`, `/items/[id]`, `/categories`, `/categories/[id]`.
  - Member: `/dashboard`, `/dashboard/profile`, `/dashboard/lending`, `/dashboard/lending/new`, `/dashboard/lending/[id]/edit`, `/dashboard/borrowing`, `/dashboard/requests`, `/dashboard/requests/[id]`.
  - Admin: `/admin`, `/admin/users`, `/admin/items`, `/admin/categories`, `/admin/loans`.
- `app/api/` – Route Handlers (e.g., `app/api/requests/route.ts`).
- `components/` – reusable components: Header, Nav, Footer, ItemCard, SearchBar, FilterPanel, StatusBadge, BorrowRequestForm.
- `lib/` – shared code: `db.ts` (database client), `types.ts` (shared types), data functions (e.g., `borrow-requests.ts`), validation helpers.
- `db/` – `schema.sql` (tables) and `seed.sql` (demo data).

## Data model (PostgreSQL)

- `users` (id, name, email unique, password_hash, neighborhood, bio, avatar_url, role 'member' | 'admin', created_at)
- `categories` (id SERIAL, name unique, description)
- `items` (id UUID, owner_id → users, category_id → categories, title, description, condition 'new' | 'good' | 'fair' | 'worn', image_url, is_available, deleted_at for soft delete, created_at, updated_at)
- `borrow_requests` (id UUID, item_id → items, borrower_id → users, start_date, due_date, message, status 'pending' | 'approved' | 'declined' | 'returned' | 'cancelled', created_at, updated_at)
- The owner of a request is found through its item (do not add owner_id to borrow_requests).
- Database columns use snake_case; TypeScript uses camelCase. Rename in SQL with `AS "camelCase"` and format dates with `to_char(date, 'YYYY-MM-DD')`.

## Coding conventions

- Server Components by default; add `"use client"` only for interactivity (forms, hooks, event handlers).
- Database code runs only on the server: data modules start with `import "server-only"`.
- Always use the `sql` tagged template for queries; never build SQL with string concatenation (SQL injection).
- Always `await` async data functions. Wrap database calls in API routes in try/catch.
- API status codes: 200 OK, 201 created, 400 invalid input, 404 not found, 409 conflict, 422 not allowed, 500 server error. Return JSON `{ error: "..." }` messages.
- Validate input on the server even if the client also validates.
- With Cache Components, wrap components that query the database per request in `<Suspense>` with a fallback.
- Accessible forms: every input has `<label htmlFor>`; errors use `aria-describedby`, `aria-invalid`, and an `aria-live="polite"` region.
- Naming: components PascalCase (`ItemCard.tsx`), functions and variables camelCase, constants UPPER_SNAKE_CASE, route folders lowercase-kebab.
- Formatting: Prettier (double quotes, semicolons, 2 spaces, trailing commas, 80 columns) and ESLint. Run `npm run lint` and `npm run build` before pushing.

## Design system

- Tone: friendly, neighborly, simple. Tagline: "Borrow what you need. Share what you have."
- Colors: primary emerald-700 #047857 (hover emerald-800), primary light emerald-50, accent amber-500 #F59E0B (dark text only), background stone-50, text stone-900, muted stone-600, borders stone-200.
- Status badges: pending amber-700 on amber-50, approved green-700 on green-50, declined red-700 on red-50, returned sky-700 on sky-50, cancelled stone-600 on stone-100.
- Fonts: Nunito (headings) and Inter (body) via `next/font/google`.
- Layout: container `mx-auto max-w-6xl px-4 sm:px-6`; cards `rounded-2xl border border-stone-200 bg-white p-5 shadow-sm`; buttons `rounded-lg`; mobile-first; minimum 44px touch targets; all text meets WCAG AA contrast.

## Git workflow

- Work on feature branches (`feature/<short-name>`), open a Pull Request into main, and get at least one teammate's review before merging.
- Reference the GitHub issue in PRs (e.g., "Closes #5").
