# Zotok Agent 2.0

AI-powered WhatsApp business intelligence platform. Automatically categorises messages, collects leads, and syncs group conversations to Google Sheets.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Components | shadcn/ui (Base UI primitives) |
| Language | TypeScript 5 |

## Features

- **Karamcharis (AI Agents)** — deploy workers for message categorisation, lead collection, and sheet syncing
- **Chat** — AI assistant with WhatsApp group context
- **Leads View** — auto-detected leads from WhatsApp groups with campaign assignment
- **Category View** — messages organised by AI-defined categories
- **Groups to Sheets** — WhatsApp conversations synced to Google Sheets
- **WhatsApp** — connect and manage synced groups
- **Connectors** — link Google Sheets and Zotok CRM
- **Login** — phone OTP → GST verification → WhatsApp linking flow
- **Dark mode** — full theme with smooth transition

## Project Structure

```
src/
├── app/              # Next.js routes (thin pages)
├── features/         # Feature-sliced business logic
│   ├── auth/         # Login flow
│   ├── agents/       # AI workers
│   ├── chat/         # AI chat interface
│   ├── category/     # Message category view
│   ├── connectors/   # External integrations
│   ├── groups-to-sheets/
│   ├── leads/        # Lead management
│   ├── profile/      # User profile
│   └── whatsapp/     # WhatsApp management
├── components/
│   ├── layout/       # App shell
│   └── ui/           # shadcn primitives
└── lib/              # Shared utilities
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
```
