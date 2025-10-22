# BinaRig

A small Next.js app to help pick PC parts with a responsive, localized UI. It supports English and Malay, dark/light themes, and a full-screen "choose" modal powered by TanStack Table for sorting and filtering.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui primitives
- TanStack Table (`@tanstack/react-table`)

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000/en` or `http://localhost:3000/ms`.
   
   If port 3000 is busy, you can specify a different port:
   ```bash
   npm run dev -- -p 3008
   ```

## Features
- Responsive navbar with language toggle (`EN/MS` on mobile, full labels on desktop) and theme toggle.
- Full-screen choose modal on mobile with large layout on desktop.
- Sort and filter parts in the modal using a reusable TanStack Table component.

## Localization
- Dictionaries: `src/dictionaries/en.ts` and `src/dictionaries/ms.ts`
- Locale routes: `/{locale}` where `locale` is `en` or `ms`
- Navbar language switch updates the path segment between `en` and `ms`

## Data Table
- Generic component: `src/components/data-table.tsx`
- Example usage and columns: `src/app/[locale]/page.tsx`
- Supports:
  - Column sorting via header buttons
  - Simple text filtering (name column)
  - Row action to select a part

To add or modify columns, edit the `ColumnDef[]` in `page.tsx` (see `getPartColumns`) and pass them to the `DataTable` along with your data.

## UI & Styling
- Tailwind provides responsive, utility-first styling
- shadcn/ui `Dialog`, `Button`, `Table` replaced by custom `DataTable` for the choose modal content
- The modal uses full-viewport sizing on mobile and large sizing on desktop

## Scripts
- `npm run dev` – start dev server
- `npm run build` – build for production
- `npm start` – run built app

## License
This project is licensed under the MIT License. See `LICENSE` for details.
