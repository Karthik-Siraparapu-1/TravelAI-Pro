# TravelAI Pro - Your Personal AI Travel Companion

TravelAI Pro is an intelligent, production-ready travel planner that creates personalized trips using the Google Gemini AI. It builds highly detailed day-wise itineraries, estimates budgets, generates interactive maps, and provides dynamic packing checklists.

Designed with premium Airbnb and Apple aesthetics.

## Features

- **Destination Suggestions**: AI suggests the best places based on your style.
- **Day-wise Itinerary**: Detailed morning/afternoon/evening schedules.
- **Budget Estimation**: Accurate cost breakdowns visualized with Recharts.
- **Packing Checklist**: Dynamic checklists based on the destination weather.
- **Supabase Auth & DB**: Scalable backend architecture.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Charts**: Recharts

## Getting Started

1. Clone the repository and install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Copy the environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

3. Set your API Keys in \`.env.local\`:
   - \`GEMINI_API_KEY\`
   - \`NEXT_PUBLIC_SUPABASE_URL\`
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

Run the SQL queries provided in \`supabase_schema.sql\` in your Supabase project's SQL Editor to create the necessary tables, Row Level Security (RLS) policies, and triggers.

## Deployment

### Vercel
This project is optimized for Vercel. Simply import the repository in your Vercel dashboard and add the environment variables.

### Railway / Docker
A \`railway.json\` and \`Dockerfile\` are included for seamless deployments to Railway, Render, or any Docker-compatible hosting environment.

---
*Built for the AI Travel Hackathon.*
