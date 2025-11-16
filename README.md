# 🤖 AI-Powered Blog Platform

<div align="center">

![AI Powered](https://img.shields.io/badge/AI%20Powered-4285F4?style=for-the-badge\&logo=google\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**Generate intelligent, well-researched blog articles instantly with the power of AI**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

A full-stack AI-powered blog platform that enables automated article generation using Google's Gemini API. The platform features a public-facing blog with a clean, reader-focused interface and a comprehensive admin dashboard for content management.

### ✨ Key Highlights

- 🎨 **Beautiful UI**: Hybrid design combining Medium/Substack's reader experience with Linear's clean admin aesthetics
- 🤖 **AI-Powered**: Generate complete markdown-formatted articles with a single title input
- 📝 **Smart Content**: Automatic excerpt generation, slug creation, and metadata management
- 🎯 **Type-Safe**: End-to-end TypeScript with Zod validation
- 🚀 **Production Ready**: Built for Vercel deployment with optimized build pipeline

---

## 🎯 Features

### 🔮 AI Article Generation
- **Intelligent Content Creation**: Generate comprehensive articles (1000+ words) from just a title
- **Markdown Formatting**: Automatically formatted with proper headings, code blocks, and lists
- **Smart Excerpts**: AI-generated summaries that capture the essence of each article
- **Batch Processing**: Generate multiple articles at once with progress tracking

### 📚 Content Management
- **Full CRUD Operations**: Create, read, update, and delete articles
- **Draft & Publish Workflow**: Save articles as drafts before publishing
- **Rich Editor**: Live markdown preview with syntax highlighting
- **SEO-Friendly**: Automatic slug generation with uniqueness checks

### 🎨 Reader Experience
- **Beautiful Typography**: Serif fonts for readability, optimized line heights
- **Syntax Highlighting**: Code blocks with Prism and OneDark theme
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Fast Loading**: Optimized images and lazy loading

### 📊 Admin Dashboard
- **Analytics Overview**: Track total articles, published count, drafts, and weekly stats
- **Article Table**: Sortable, searchable table with inline actions
- **Status Management**: Toggle publish status with one click
- **Preview Mode**: View articles before publishing

---

## 🎬 Demo

### Public Blog
```
📱 Home Page → Hero section with CTA buttons
📝 Blog Listing → Grid of article cards with filters
📄 Article Detail → Full article with markdown rendering
```

### Admin Dashboard
```
🎛️  Dashboard → Stats cards + recent articles
📋 Articles → Full article management table
✨ Generate → AI-powered article creation
✏️  Edit → Rich editor with live preview
```

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Vercel Postgres)
- Google Gemini API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/irkky/AI-Article-Forge
   cd AI-Article-Forge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database (Vercel Postgres or local PostgreSQL)
   POSTGRES_URL="postgresql://user:password@host:5432/dbname"
   # OR
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   
   # Google Gemini API
   GEMINI_API_KEY="your-gemini-api-key"
   GEMINI_MODEL="gemini-2.0-flash"  # Optional, defaults to gemini-2.0-flash
   
   # Server
   PORT=5000  # Optional, defaults to 5000
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5000`

---

## 📘 Usage

### Generating Articles

1. Navigate to the **Admin Dashboard** at `/admin`
2. Click **Generate Articles** or go to `/admin/generate`
3. Enter article titles (one per line):
   ```
   How to Build a React Application
   The Future of AI in Web Development
   Understanding TypeScript Basics
   ```
4. Click **Generate** and watch the AI create your articles
5. Review, edit, and publish from the Articles page

### Managing Content

**Publish an Article:**
- Navigate to `/admin/articles`
- Click the checkmark icon next to a draft article
- It will instantly be published with a timestamp

**Edit an Article:**
- Click the edit icon in the article table
- Modify title, excerpt, content, or featured image
- See live preview on the right side
- Click **Save Changes**

**Delete an Article:**
- Click the trash icon in the article table
- Article is permanently deleted (no confirmation prompt currently)

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks |
| **TypeScript** | Type safety and developer experience |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Beautiful, accessible components |
| **Wouter** | Lightweight routing (~1KB) |
| **TanStack Query** | Server state management |
| **React Markdown** | Markdown rendering |
| **Prism** | Syntax highlighting |

### Backend

| Technology | Purpose |
|------------|---------|
| **Express.js** | Web server framework |
| **TypeScript** | Type-safe backend code |
| **Drizzle ORM** | Type-safe database queries |
| **Vercel Postgres** | Managed PostgreSQL |
| **Zod** | Runtime validation |
| **Google Gemini** | AI article generation |

### Developer Tools

| Tool | Purpose |
|------|---------|
| **tsx** | TypeScript execution |
| **esbuild** | Fast bundling |
| **Drizzle Kit** | Database migrations |
| **ESLint** | Code linting |

---

## 🏗️ Architecture

### Project Structure

```
ai-blog-platform/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── admin/    # Admin-specific components
│   │   │   ├── blog/     # Public blog components
│   │   │   └── ui/       # shadcn/ui components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and query client
│   │   └── index.css     # Global styles and theme
│   └── index.html        # Entry HTML file
│
├── server/                # Backend Express application
│   ├── app.ts            # Express app setup
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database abstraction layer
│   ├── gemini.ts         # AI generation logic
│   ├── db.ts             # Database connection
│   ├── vite.ts           # Vite dev middleware
│   ├── vercel.ts         # Vercel serverless handler
│   └── index.ts          # Server entry point
│
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and Zod validation
│
├── migrations/           # Drizzle database migrations
├── api/                  # Vercel serverless entry
└── attached_assets/      # Static images
```

### Data Flow

#### Article Generation Flow

```mermaid
graph TD
    A[👤 User Input<br/>Article Title] --> B[📝 Frontend Form<br/>React Hook Form + Zod]
    B --> C[🔄 TanStack Query<br/>POST Request]
    C --> D[🚀 Express API<br/>/api/articles/generate]
    D --> E[🤖 Gemini API<br/>Generate Content]
    E --> F[📄 Generate Article<br/>Full Markdown Content]
    E --> G[✂️ Generate Excerpt<br/>2-3 Sentence Summary]
    F --> H[🔗 Generate Slug<br/>slugify + uniqueness check]
    G --> H
    H --> I[💾 Drizzle ORM<br/>Insert Article]
    I --> J[(🗄️ PostgreSQL<br/>articles table)]
    J --> K[✅ Return Article<br/>with Metadata]
    K --> L[🔄 Invalidate Cache<br/>TanStack Query]
    L --> M[🎨 UI Update<br/>Redirect to Articles Page]

    style A fill:#e3f2fd
    style E fill:#fff3e0
    style J fill:#f3e5f5
    style M fill:#e8f5e9
```

#### Complete System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React App]
        B[Wouter Router]
        C[TanStack Query]
        D[shadcn/ui Components]
    end

    subgraph "API Layer"
        E[Express.js Server]
        F[Route Handlers]
        G[Validation Layer<br/>Zod Schemas]
    end

    subgraph "Business Logic"
        H[Storage Interface]
        I[AI Generation Service]
        J[Slug Generator]
    end

    subgraph "Data Layer"
        K[Drizzle ORM]
        L[(PostgreSQL Database)]
    end

    subgraph "External Services"
        M[Google Gemini API]
        N[Vercel Platform]
    end

    A --> B
    B --> C
    C --> D
    C -->|HTTP Requests| E
    E --> F
    F --> G
    G --> H
    G --> I
    G --> J
    H --> K
    I --> M
    K --> L
    L -->|Results| K
    K -->|Data| H
    H -->|Response| F
    F -->|JSON| E
    E -->|Data| C
    N -.->|Hosting| A
    N -.->|Database| L

    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style E fill:#68a063,stroke:#333,stroke-width:2px
    style L fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style M fill:#4285f4,stroke:#333,stroke-width:2px
```

#### Article CRUD Operations

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database
    participant AI as Gemini AI

    Note over U,AI: CREATE - Generate Article
    U->>F: Enter title & click Generate
    F->>A: POST /api/articles/generate
    A->>AI: Request article content
    AI-->>A: Return markdown content
    A->>AI: Request excerpt
    AI-->>A: Return excerpt
    A->>D: INSERT article (draft)
    D-->>A: Return article with ID
    A-->>F: Article data
    F-->>U: Show success & redirect

    Note over U,AI: READ - View Article
    U->>F: Click article card
    F->>A: GET /api/articles/slug/:slug
    A->>D: SELECT by slug
    D-->>A: Article data
    A-->>F: Article JSON
    F-->>U: Render article page

    Note over U,AI: UPDATE - Edit Article
    U->>F: Edit form & save
    F->>A: PATCH /api/articles/:id
    A->>D: UPDATE article
    D-->>A: Updated article
    A-->>F: Article data
    F-->>U: Show success message

    Note over U,AI: DELETE - Remove Article
    U->>F: Click delete button
    F->>A: DELETE /api/articles/:id
    A->>D: DELETE article
    D-->>A: Success confirmation
    A-->>F: {success: true}
    F-->>U: Remove from list
```

---


## 🚢 Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import project to Vercel**
   - Connect your GitHub repository
   - Vercel will auto-detect the configuration

3. **Set environment variables**
   
   In Vercel dashboard, add:
   ```
   POSTGRES_URL=your-postgres-connection-string
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Deploy**
   
   Vercel will automatically:
   - Run `npm run vercel-build`
   - Deploy the serverless function
   - Serve static assets from CDN

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

3. **Configure reverse proxy** (nginx, Apache, etc.)

---

## 🧪 Development

### Running Tests

```bash
# Type checking
npm run check

# Database operations
npm run db:push    # Push schema changes
```

### Environment Setup

The project uses different configurations for development and production:

**Development:**
- Vite dev server with HMR
- Hot module replacement
- Source maps enabled

**Production:**
- Static files served from `dist/public`
- Optimized bundles with esbuild
- Serverless function for API

### Code Style

- **TypeScript Strict Mode**: Enabled
- **ESM Modules**: Throughout the project
- **Path Aliases**: 
  - `@/` → `client/src/`
  - `@shared/` → `shared/`
  - `@assets/` → `attached_assets/`

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Add Zod schemas for new data types
- Use semantic commit messages
- Test your changes thoroughly

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Google Gemini** - AI article generation
- **shadcn/ui** - Beautiful component library
- **Vercel** - Hosting and PostgreSQL
- **Drizzle ORM** - Type-safe database queries
- **TanStack Query** - Server state management

---


<div align="center">

**Built with ❤️ using React, TypeScript, and AI**

⭐ Star this repo if you find it helpful!

</div>
