# Design Guidelines: AI-Powered Blog Platform

## Design Approach

**Hybrid Strategy**: Combining Medium/Substack's reader-focused blog experience with Linear's clean admin interface aesthetics.

**Public Blog**: Prioritizes readability and content discovery with generous whitespace and typography-first design
**Admin Dashboard**: Emphasizes efficiency and clear information hierarchy for content management

## Core Design Elements

### Typography System

**Public Blog:**
- Headlines: Serif font (Merriweather, Lora, or Playfair Display) at 48px (mobile: 32px) for article titles
- Body: Sans-serif (Inter or Source Sans Pro) at 18px with 1.7 line-height for optimal readability
- Article excerpts: 16px with slightly tighter line-height (1.5)
- Metadata (dates, tags): 14px, reduced opacity

**Admin Interface:**
- All sans-serif (Inter) for consistency
- Section headers: 24px semibold
- Form labels: 14px medium
- Input text: 16px regular

### Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20, 24 (e.g., p-4, gap-8, my-12)

**Public Blog Layouts:**
- Hero: Full-width with centered content, max-w-4xl container, py-20 to py-32
- Article listing: max-w-6xl container, grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-8
- Article detail: max-w-prose (optimal reading width ~65ch), generous py-16
- Sidebars (if needed): max-w-sm with sticky positioning

**Admin Dashboard:**
- Full viewport height with sidebar navigation (w-64)
- Main content area: max-w-7xl with px-8, py-6
- Form sections: max-w-3xl for focused input areas

### Component Library

**Public Blog Components:**

1. **Hero Section**
   - Large background image (subtle gradient overlay)
   - Centered headline + tagline
   - CTA button with backdrop-blur-md background
   - Height: 70vh minimum

2. **Article Cards**
   - Vertical layout with hover elevation transition
   - Featured image: aspect-ratio-16/9
   - Title, excerpt (2-3 lines with truncation), read time, publish date
   - Rounded corners (rounded-xl), subtle border

3. **Article Content**
   - Markdown rendering with proper heading hierarchy (h1 excluded, h2-h6 styled)
   - Code blocks: syntax highlighting, monospace font, contrasting background
   - Blockquotes: border-l-4, italic, pl-6
   - Images: full-width within prose container, rounded-lg, my-8
   - Lists: proper indentation, marker styling

4. **Navigation**
   - Top bar: logo left, main links center/right, search icon, sticky on scroll
   - Footer: multi-column (3-4 cols on desktop) with links, social icons, newsletter signup

**Admin Dashboard Components:**

1. **Sidebar Navigation**
   - Fixed width (w-64), full height
   - Section groups: Dashboard, Articles, Generate, Settings
   - Active state: filled background, icon emphasis

2. **Title Input Interface**
   - Large textarea for bulk title entry (min-h-64)
   - Helper text: "Enter one title per line"
   - Character counter, title count display
   - Generate button: prominent, full-width within form

3. **Article Management Table**
   - Column headers: Title, Status, Date, Actions
   - Row actions: Edit, Preview, Publish/Unpublish, Delete
   - Status badges: rounded-full pills with icons
   - Pagination controls at bottom

4. **Article Editor**
   - Split view: metadata form left (w-1/3), markdown preview right (w-2/3)
   - Live markdown preview with same styling as public view
   - Auto-save indicator in header

5. **Status & Filters**
   - Tab navigation: All, Published, Drafts
   - Search input: prominent placement, icon prefix
   - Sort dropdown: date, title, status

### Images

**Hero Section**: Large, high-quality background image of modern workspace or abstract tech pattern (3:1 aspect ratio minimum). Apply subtle dark gradient overlay (opacity 40%) to ensure text readability.

**Article Cards**: Each card includes a featured image placeholder. For AI-generated content, use abstract patterns, gradients, or tech-themed illustrations. Size: 16:9 aspect ratio.

**Empty States**: Illustration for "no articles yet" in both admin and public views. Style: friendly, minimal line art.

### Vertical Rhythm & Spacing

**Public Blog:**
- Section padding: py-20 (desktop), py-12 (mobile)
- Article spacing: space-y-16 between major sections
- Paragraph spacing: space-y-6 within article content

**Admin Dashboard:**
- Page padding: p-8 on main content area
- Form field spacing: space-y-6
- Card/panel internal padding: p-6

### Accessibility & Interaction

- Focus rings: 2px offset, high contrast
- Interactive elements: minimum 44px touch target
- Form validation: inline error messages below inputs
- Loading states: skeleton screens for article cards, spinner for generation
- Toast notifications: top-right, auto-dismiss after 5s
- Modal overlays: backdrop-blur-sm, centered with max-w-2xl

### Specific Layout Patterns

**Blog Listing Page:**
- Header with search bar (max-w-2xl centered)
- Filter tabs below header
- 3-column grid on desktop, 2 on tablet, 1 on mobile
- Load more button at bottom (no pagination UI initially)

**Article Detail Page:**
- Breadcrumb navigation above title
- Hero: title, metadata, featured image
- Content: single column, max-w-prose
- Related articles: 3-card grid at bottom
- Share buttons: floating sidebar on desktop, bottom on mobile

**Admin Generate Page:**
- Two-step flow: Input titles → Review generated articles
- Step indicator at top
- Bulk actions toolbar when articles selected
- Progress indicator during generation (progress bar with count)

**Admin Dashboard Home:**
- Stats cards: 4-column grid (Total, Published, Drafts, This Week)
- Recent articles table below
- Quick actions: prominent "Generate Articles" button

### Animations

Use sparingly:
- Card hover: subtle elevation increase (translate-y-1, shadow-lg)
- Navigation transitions: smooth color changes
- Loading states: pulse animation on skeletons
- Page transitions: none (instant navigation)