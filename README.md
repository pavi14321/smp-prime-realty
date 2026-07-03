# SMP Prime Realty — Frontend

A Vite + React + Tailwind CSS real estate website, cloned from the provided design reference.

## Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## What's included

- **Home page** — hero with search bar, category browser, featured properties, "why choose us".
- **Properties page** (`/properties`) — search, filter by status/category, sort by price.
- **Property Details page** (`/properties/:id`) — image gallery, specs, tabs (Overview / Amenities / Floor Plan / Location / Nearby Places), embedded Google Map (Bengaluru), OTP-style contact box, contact info card.
- **Admin Panel** (`/admin`) — add new properties through a form. Each property gets an **auto-generated ID** (e.g. `SMP1005`, incrementing). Newly added properties immediately appear on the Home and Properties pages. You can also toggle "Featured" or delete a listing from the Manage tab.

## Data / "Database"

This is a **frontend-only** build. Properties are stored in the browser's `localStorage`
(see `src/data/db.js`), seeded with 5 demo listings matching the reference design.
This acts as a stand-in database so the Admin panel → website flow works end-to-end without a backend.

To connect a real backend later, replace the functions in `src/data/db.js`
(`getAllProperties`, `getPropertyById`, `addProperty`, `updateProperty`, `deleteProperty`)
with API calls (e.g. `fetch('/api/properties')`), keeping the same function signatures.

## Replacing placeholder content

- **Images**: all property photos currently use placeholder images
  (`https://placehold.co/...`). Replace them by:
  - Editing the `images` array for each seed property in `src/data/db.js`, or
  - Using the Admin Panel's "Image URLs" field when adding a new property.
- **Map location**: every property has `lat` / `lng` fields (defaulted to Bengaluru
  coordinates). Update these per property in `src/data/db.js` or via the Admin form's
  Latitude/Longitude fields — the embedded map on the Property Details page updates automatically.

## Tech stack

- React 18 + React Router
- Vite
- Tailwind CSS
- lucide-react (icons)

## Project structure

```
src/
  components/        Navbar, Footer, PropertyCard, home/ (Hero, Categories, FeaturedProperties, WhyChooseUs)
  pages/              Home, Properties, PropertyDetails, Admin, About, Blog, Contact
  data/db.js          localStorage-backed mock database + seed data
  index.css           Tailwind base + custom utility classes
```
