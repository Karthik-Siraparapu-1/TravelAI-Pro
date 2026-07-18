# TravelAI Pro - Your Personal AI Travel Companion

TravelAI Pro is an intelligent, production-ready travel planner that creates personalized trips using the Google Gemini AI. It builds highly detailed day-wise itineraries, estimates budgets in multiple currencies, generates activity visuals, and provides weather forecasts and dynamic packing checklists.

**Submission Vertical Chosen:** AI Travel Planner (Persona and Logic)
**Live Web App (Vercel):** [travel-ai-pro-brown.vercel.app](https://travel-ai-pro-brown.vercel.app/)

---

## 📖 Chosen Vertical, Approach & Logic

This solution is designed around the **AI Travel Planner** vertical. The goal is to solve the classic travel planning problem (combining flights, local transport, food, accommodation, and day-by-day activities) within seconds.

### 🧠 Core Decision Logic & Flow
1. **Validation & Context Gathering**: The multi-step wizard (`PlannerForm`) collects essential traveler context (Mandatory fields: Leaving from, Going to, Dates, and Adults. Optional: Children, Budget levels, Travel Styles, Dietary choices, and special requests).
2. **Dynamic Currency Scaling**: To ensure global usability, travelers can select their home currency (USD, INR, EUR, GBP, AUD, CAD, JPY).
3. **Structured Response Schema**: The app communicates with the Gemini Pro API using a strict JSON schema (`itinerarySchema`), guaranteeing consistent structure, day-by-day nested arrays, and accurate type checking.
4. **Smart Local Mock Database (Offline Fail-safe)**:
   - *Scenario*: If network connection fails or the API key is not configured.
   - *Logic*: The backend catches the error and serves a realistic mock itinerary (supporting detailed real landmarks, custom image URLs, weather statistics, and converted currency values).
   - *Location Specifics*: If the user inputs **Hyderabad**, the mock details Charminar, Golconda Fort, Shadab Cafe thalis, pearl bazaars, and local auto-rickshaw/metro price estimates.
5. **Interactive UI Visualization**: Day-by-day plan rendering, Recharts interactive pie charts for cost segments, and checkbox packing lists.

---

## 🛠 Tech Stack

- **Frontend Framework**: Next.js 16 (App Router), React, TypeScript
- **Styling & Motion**: Tailwind CSS, Shadcn UI, Framer Motion (Glassmorphic cards)
- **Database & Authentication**: Supabase (PostgreSQL schema included in `supabase_schema.sql`)
- **AI Engine**: Google Gemini API SDK (`@google/generative-ai`)
- **Visuals**: Recharts (interactive SVGs)

---

## ♿ Accessibility, Security, and Code Quality

### 1. Accessibility (A11y)
- **Keyboard Navigation**: Form inputs, select dropdowns, and button links are built using semantic HTML5 elements for full keyboard reachability.
- **Image Fallbacks**: Custom `onError` handlers prevent blank image placeholders in case of dead links; loading a fallback travel image seamlessly.
- **Contrasting Color System**: Curated Tailwind classes conforming to high contrast ratios (minimum 4.5:1 for standard text).

### 2. Security
- **API Protection**: The `GEMINI_API_KEY` is completely isolated in Server Side API Routes (`src/app/api/generate-itinerary/route.ts`). It is never leaked to the client browser logs.
- **Data Validation**: Inputs are validated client-side and sanitized in Next.js endpoints.

### 3. Efficiency
- **Optimized Standalone Output**: Enabled Next.js standalone server option for smaller docker sizes.
- **Node 20 Docker Containerization**: Configured `node:20-alpine` multi-stage build scripts to speed up builds and limit image sizes to less than 10MB in deployment environments.

---

## 🚀 Getting Started

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Set your API Keys in `.env.local`:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

---
*Developed for the AI Hackathon.*
