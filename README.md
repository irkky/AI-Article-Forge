# AI-Powered Blog Platform

## Overview

This is a full-stack AI-powered blog platform that enables automated article generation using Google's Gemini API. The platform features a public-facing blog with a clean, reader-focused interface and a comprehensive admin dashboard for content management. Users can input article titles, generate complete markdown-formatted articles with AI, and publish them to the blog with proper slug generation and metadata management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Styling:**
- React with TypeScript via Vite bundler
- Tailwind CSS for utility-first styling with custom design system
- shadcn/ui component library (New York style variant) for pre-built UI components
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**Design System:**
- Hybrid approach combining Medium/Substack's reader-focused experience with Linear's clean admin aesthetics
- Typography: Serif fonts (Merriweather) for public blog headlines, Inter for admin interface
- Custom color system using HSL with CSS variables for theming support
- Spacing based on Tailwind's 4-unit scale
- Component variants using class-variance-authority for consistent styling

**Page Structure:**
- Public routes: Home hero, blog listing, individual blog detail pages
- Admin routes: Dashboard with stats, articles management table, AI generation interface, article editor
- Responsive layouts with mobile-first breakpoints

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- ESM module system throughout
- Custom Vite middleware integration for development with HMR
- Request logging and JSON body parsing middleware

**API Design Pattern:**
- RESTful API endpoints under `/api` prefix
- Standard HTTP methods (GET, POST, PATCH, DELETE)
- Consistent error handling with appropriate status codes
- JSON request/response format

**Key API Routes:**
- `GET /api/articles` - Fetch all articles
- `GET /api/articles/:id` - Fetch article by ID
- `GET /api/articles/slug/:slug` - Fetch article by URL slug
- `POST /api/articles/generate` - Generate article with AI
- `PATCH /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Data Layer

**Database:**
- Vercel Postgres (managed PostgreSQL)
- Connection management through `@vercel/postgres` pools
- Drizzle ORM for type-safe database queries and migrations

**Schema Design:**
- Single `articles` table with fields: id (UUID), title, slug (unique), content (markdown), excerpt, featuredImage, status (published/draft), publishedAt, createdAt
- Zod schemas for runtime validation of insert/update operations
- Type inference from Drizzle schema for end-to-end type safety

**Storage Pattern:**
- Repository pattern via `IStorage` interface
- `DatabaseStorage` implementation handling all CRUD operations
- Computed stats queries (total, published, drafts, weekly count)
- Ordering by creation/publication date

### AI Integration

**Provider:**
- Google Gemini API (gemini-2.0-flash-exp model)
- Separate article content and excerpt generation in two-step process

**Generation Flow:**
1. Accept article title from user
2. Send detailed prompt to Gemini requesting markdown-formatted article with proper structure
3. Parse response and extract full content
4. Generate concise excerpt (2-3 sentences) from content
5. Return both content and excerpt for database storage

**Content Requirements:**
- Markdown format with proper heading hierarchy (##, ###)
- Code examples with language-specific syntax highlighting
- Minimum 1000 words
- Professional but accessible tone
- Structured sections: Introduction, main content, conclusion

### Markdown Rendering

**Libraries:**
- react-markdown for parsing and rendering
- react-syntax-highlighter with Prism and oneDark theme for code blocks
- Custom component mapping for consistent typography

**Rendering Strategy:**
- Custom React components for each markdown element type
- Serif fonts for headings, sans-serif for body text
- Proper line height and spacing for readability
- Syntax highlighting with language detection from code fence annotations

### Slug Generation

**Strategy:**
- Uses `slugify` library for URL-safe slug creation
- Converts titles to lowercase, replaces spaces with hyphens
- Removes special characters
- Ensures uniqueness at database level via unique constraint

## External Dependencies

### Third-Party Services

**AI Generation:**
- Google Gemini API via `@google/generative-ai` SDK
- Requires `GEMINI_API_KEY` environment variable
- Rate limits and error handling managed at application level

**Database:**
- Vercel Postgres (managed PostgreSQL)
- Requires `POSTGRES_URL` (or fallback `DATABASE_URL`) environment variable
- Connection pooling handled by `@vercel/postgres`
- Drizzle ORM with `drizzle-orm/vercel-postgres` driver

### UI Component Libraries

**shadcn/ui:**
- Radix UI primitives for accessible components (dialog, dropdown, accordion, tabs, toast, etc.)
- Customized with Tailwind CSS
- Components aliased via `@/components/ui` path

**Icons & Fonts:**
- Lucide React for icons
- Google Fonts: Inter (sans-serif), Merriweather (serif), JetBrains Mono (monospace)

### Development Tools

**Build & Dev:**
- Vite for frontend bundling with React plugin
- esbuild for backend bundling
- tsx for TypeScript execution in development
- Drizzle Kit for database migrations

**Type Safety:**
- TypeScript with strict mode
- Zod for runtime schema validation
- Drizzle ORM for database type inference

### Session & State Management

**Frontend State:**
- TanStack Query for server state caching and synchronization
- React hooks for local component state
- React Hook Form with Zod resolvers for form validation

**Utilities:**
- date-fns for date formatting
- clsx and tailwind-merge for className utilities
- nanoid for unique ID generation

### Deployment (Vercel)

- Build pipeline uses `npm run vercel-build` (delegates to `npm run build`) to emit `dist/index.js` and `dist/public`
- Serverless entry point exposed via `api/index.ts`, which wraps the Express app for the Vercel Node runtime
- Static assets served from `dist/public` through Express `serveStatic` middleware
- Database connectivity managed through Vercel Postgres (`POSTGRES_URL` or fallback `DATABASE_URL`)
- Remember to add required environment variables (`POSTGRES_URL`, `GEMINI_API_KEY`) in the Vercel dashboard before deployment