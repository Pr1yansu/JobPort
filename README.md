This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Overview

JobPort is a modern job marketplace built with Next.js 14 and Drizzle ORM on Neon Postgres. Candidates can discover jobs and apply, while recruiters manage companies and postings. Includes social auth, payments, and a resume builder (Convex-backed).

## Features
- Fast, App Router-based Next.js app (React 18)
- Auth with NextAuth (Credentials + providers)
- Drizzle ORM on Neon Postgres
- Rich job filters, bookmarking, and applications
- Recruiter flow with company approvals
- Payments (Razorpay integration)
- Convex-backed resume builder (data seeded separately in Convex)
- Seed scripts with Faker and Unsplash Source images

## Tech Stack
- Next.js 14, React 18, TypeScript, Tailwind
- NextAuth, Drizzle ORM, Neon (Postgres)
- Hono + React Query
- Convex (resume features)
- Razorpay

## Getting Started
Ensure `.env` contains:

```
DATABASE_URL=postgresql://...  # Neon connection
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
GITHUB_ID=...
GITHUB_SECRET=...
GOOGLE_ID=...
GOOGLE_SECRET=...
FACEBOOK_ID=...
FACEBOOK_SECRET=...
```

Install and run locally (PowerShell):

```powershell
npm install --legacy-peer-deps
npm run run:migration
npm run dev
```

Visit http://localhost:3000

## Database Seeding

Seeding uses Drizzle on Postgres. It clears all existing data first, then inserts demo data.

Commands (PowerShell):

```powershell
npm run db:reset  # clear with per-table counts
npm run db:seed   # clear + seed with per-table insert counts
```

Seeds include:
- Users (Admin, Recruiter, User) with demo credentials
- Experience Levels, Job Types, Job Locations
- Skills, Companies (Unsplash Source logos)
- Jobs, Job-Skills, Applicants
- Recruiter Applications, Orders

Demo credentials (also shown on the login page):
- Admin: `admin@demo.com` / `demo1234`
- Recruiter: `recruiter@demo.com` / `demo1234`
- User: `user@demo.com` / `demo1234`

Images are link-only via Unsplash Source.

## SEO & Metadata
- Global metadata configured in `app/layout.tsx` (title template, OpenGraph, Twitter card, canonical, robots, theme color, viewport).
- Set `NEXT_PUBLIC_APP_URL` in `.env` to generate correct canonical/OG URLs.

## Deploy
- Provision a Neon PostgreSQL instance and set `DATABASE_URL`.
- Set NextAuth provider secrets and `NEXTAUTH_SECRET`.
- Build and start:

```powershell
npm run build
npm start
```

## Scripts
- `dev` — run dev server
- `build` — production build
- `start` — start production server
- `run:migration` — apply Drizzle migrations
- `db:reset` — clear all tables with counts
- `db:seed` — full reseed with logs

