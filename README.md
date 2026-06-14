# The Blog - A Modern Blog Platform

A production-ready blog platform built with Next.js 16, TypeScript, Tailwind CSS, and Prisma.

## Features

- **Modern UI**: Beautiful, responsive design with dark mode support
- **Admin Panel**: Complete dashboard for managing posts, categories, and tags
- **Rich Editor**: Markdown-based blog editor with live preview
- **SEO Optimized**: Dynamic metadata, sitemap, robots.txt, and structured data
- **AdSense Ready**: Pre-configured ad placements (disabled by default)
- **Fast Performance**: Server components, ISR, and optimized images
- **Secure**: Authentication, input validation, and CSRF protection
- **Accessible**: WCAG AA compliant with ARIA labels and keyboard navigation

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js Server Actions, Route Handlers
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Auth.js (NextAuth.js)
- **Image Storage**: Cloudinary
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon or Supabase recommended)
- Cloudinary account (for image storage)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
- Database connection string
- NextAuth secret and URL
- Cloudinary credentials
- AdSense ID (optional)

5. Run database migrations:
```bash
npx prisma migrate dev --name init
```

6. Seed the database (optional):
```bash
npx prisma db seed
```

7. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── admin/        # Admin panel pages
│   ├── blog/         # Blog pages
│   └── ...
├── components/       # React components
│   ├── admin/        # Admin components
│   ├── blog/         # Blog components
│   ├── layout/       # Layout components
│   └── ui/           # UI components
├── lib/              # Utility functions
├── hooks/            # Custom hooks
└── ...
```

## Pages

### Public Pages
- Home
- Blog listing
- Blog details
- About
- Contact
- Privacy Policy
- Terms & Conditions
- 404

### Admin Panel
- Dashboard
- Posts management (CRUD)
- Categories management
- Tags management
- Settings

## SEO Features

- Dynamic metadata per page
- Open Graph tags
- Twitter Cards
- Canonical URLs
- Automatic sitemap generation
- Robots.txt
- Structured data (JSON-LD)
- Breadcrumb schema
- Article schema

## AdSense Integration

AdSense is disabled by default. To enable:

1. Set `NEXT_PUBLIC_ADSENSE_ENABLED=true` in your `.env`
2. Add your AdSense ID to `NEXT_PUBLIC_ADSENSE_ID`
3. Ad placements are available in:
   - Header
   - Sidebar
   - In-content
   - Footer

## Performance

- Server Components where possible
- Dynamic imports
- Code splitting
- Image optimization with Next.js Image
- Font optimization
- ISR (Incremental Static Regeneration)
- Caching strategies

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states
- Proper heading hierarchy
- Color contrast compliance

## Security

- Input validation with Zod
- Rate limiting
- CSRF protection
- XSS protection
- Secure authentication with Auth.js
- Environment variable protection

## Deployment

Deploy to Vercel:

```bash
vercel
```

Make sure to set environment variables in your Vercel project settings.

## License

MIT
