# Career Forward Platform

A comprehensive workforce development platform designed to guide job seekers through their employment journey, from career discovery to job placement.

![Career Forward Logo](./public/career-forward-logo.png)

## Overview

Career Forward provides job seekers with a guided pathway that starts with profile creation, moves through career assessments, resume building, interview preparation, and culminates in job tracking — all while working alongside a career coach in a workforce development setting.

## Features

### For Job Seekers
- **Career Forward 5-Stage Pathway** - Guided journey from research to employment
- **Resume Builder** - Professional templates with side-by-side editing
- **Cover Letter Builder** - Job-matched content suggestions
- **Job Application Tracker** - Stoplight status system (Green/Yellow/Red)
- **Interview Training** - Video workshops organized by topic
- **Career Assessments** - Guided external assessment recommendations
- **Achievement System** - Badges and progress tracking

### For Career Coaches
- Client search and connection management
- Read-only client progress views
- Private notes per client
- Caseload management and filtering
- Progress reports

### For Administrators
- Content management (videos, resources, templates)
- User management
- Full audit logging

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **UI:** shadcn/ui + Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Custom JWT-based sessions
- **Email:** Resend (planned)
- **Resume Parsing:** Affinda API (planned)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/maliekmartin/career-forward-platform.git
   cd career-forward-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your database credentials and API keys.

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
career-forward-platform/
├── docs/                    # Project documentation
│   ├── PROJECT_SPECIFICATION.md
│   ├── SCREEN_SPECIFICATIONS.md
│   └── API_SPECIFICATION.md
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (dashboard)/     # Protected dashboard pages
│   │   ├── api/             # API routes
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   └── forms/           # Form components
│   ├── lib/
│   │   ├── auth/            # Authentication utilities
│   │   ├── db/              # Database client
│   │   ├── utils/           # Helper functions
│   │   └── validations/     # Zod schemas
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript types
└── README.md
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `RESEND_API_KEY` | Resend API key for emails |
| `AFFINDA_API_KEY` | Affinda API key for resume parsing |
| `NEXT_PUBLIC_APP_URL` | Public application URL |

## Development

### Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name migration_name
```

### Code Style

The project uses ESLint and TypeScript for code quality. Run linting with:

```bash
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Other Platforms

Build the production application:

```bash
npm run build
npm start
```

## Documentation

Detailed specifications are available in the `/docs` directory:

- **PROJECT_SPECIFICATION.md** - Complete requirements and technical decisions
- **SCREEN_SPECIFICATIONS.md** - UI/UX specifications for design
- **API_SPECIFICATION.md** - API endpoint documentation

## Language Support

- English (default)
- Spanish
- Russian
- Ukrainian
- Marshallese (planned)

## License

Proprietary - Martin Built Strategies LLC

---

Built with care for workforce development professionals and job seekers.
