# Multi-Entity Financial Management Webapp

A comprehensive financial management system built with Next.js, TypeScript, Tailwind CSS, Shadcn/ui, and Drizzle ORM with PostgreSQL.

## Features

- Multi-entity support for managing multiple companies, organizations, or individuals
- Account management with different account types (assets, liabilities, equity, revenue, expenses)
- Transaction tracking and management
- Financial reporting and analytics
- Modern UI with Tailwind CSS and Shadcn/ui components
- Type-safe database operations with Drizzle ORM

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: PostgreSQL with Drizzle ORM
- **Charts**: Tremor React
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Install dependencies:

```bash
npm install --legacy-peer-deps
```

2. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
POSTGRES_URL="postgresql://username:password@localhost:5432/financial_management"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

3. Set up the database:

```bash
# Generate database migrations
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed the database with sample data
npm run db:seed
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # Shadcn/ui components
├── lib/                  # Utility functions and configurations
│   ├── db/              # Database configuration and schema
│   └── utils.ts         # Utility functions
└── actions/             # Server actions
```

## Database Schema

The application uses three main tables:

- **entities**: Stores information about different entities (companies, individuals, organizations)
- **accounts**: Manages financial accounts for each entity
- **transactions**: Records all financial transactions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
