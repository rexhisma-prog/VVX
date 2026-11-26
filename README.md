# VVX Construction – faqja e prezantimit

Faqe premium për VVX Construction (ndërtim dhe shitje apartamentesh), në gjuhën shqipe.
Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4**. Floor plans are pure SVG.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → ./out (deploy to any static host)
```

The site is exported as static HTML (`output: "export"` in `next.config.ts`), so no server is required.
Remove that line when a backend (CMS, admin, form API) is added.

## Pages

| Route | Content |
| --- | --- |
| `/` | Video hero, statement, featured projects, about, why us, floor-plan teaser, architecture showcase, CTA |
| `/rreth-nesh/` | Company, mission, vision, values, philosophy, quality |
| `/projektet/` | Royal Residence and Royal Residence 2 |
| `/projektet/[slug]/` | Project detail: specs, galleries, construction details, **interactive floor plans**, apartment types |
| `/projektet/[slug]/apartamentet/[apt]/` | Apartment detail: large plan with dimensions, room table, key plan, CTA (49 pages) |
| `/apartamentet/` | Apartment selector across all buildings (building → floor → apartment) |
| `/galeria/` | Filterable gallery with lightbox |
| `/kontakti/` | Validated contact form, contact data, WhatsApp, map placeholder |

## Editing content (admin-ready data)

Everything shown on the site comes from `src/data/`:

| File | What it holds |
| --- | --- |
| `site.ts` | Address, phone, e-mail, WhatsApp number, navigation |
| `projects.ts` | Projects: texts, status, specifications, construction details, images |
| `buildings.ts` | Buildings, residential floors, floor plate and the position of each apartment slot |
| `layouts.ts` | **Floor-plan drawings**: rooms, doors, windows, furniture (in metres) |
| `apartment-status.ts` | Status of every apartment (`available` / `reserved` / `sold`) |
| `apartments.ts` | Inventory derived from buildings × floors × slots (no manual editing needed) |
| `images.ts`, `gallery.ts` | Image library (alt texts, categories) and gallery order |

### How the floor plans work

`src/lib/plan/` contains a small drawing engine. A layout is a list of room rectangles (to wall
centre-lines), openings and furniture. **Walls are generated automatically** from the room geometry
(exterior 30 cm, interior 12 cm, balcony railings), openings are cut into them, and doors are drawn
with their swing. Layouts can be mirrored when placed on a floor, so one drawing serves several
positions. Room areas, dimensions and apartment totals are calculated from the same data.

To replace the demo with real apartments: draw each real layout in `layouts.ts`, describe the
floor plate in `buildings.ts` and set statuses in `apartment-status.ts`.

## Contact form

Client-side validation is complete. Delivery is **not** configured: without
`NEXT_PUBLIC_CONTACT_ENDPOINT` the form tells the visitor clearly that the message was not sent and
offers e-mail / WhatsApp with the message pre-filled. Set the variable to any endpoint that accepts
a JSON `POST` (e.g. Formspree or your own API) to enable real delivery and success/error states.

## Hero video

`public/video/vvx-hero.mp4` is the supplied original video (autoplay, muted, loop, playsInline, no
controls, `object-fit: cover`). The emerald overlay strength is set in `src/app/globals.css`:

```css
--hero-overlay-opacity: 0.6; /* 0.55 – 0.65 recommended */
```

Visitors with *reduced motion* enabled, or browsers that cannot play the video, see a still frame
from the same video (`public/images/hero-poster.webp`).

## Brand

- Primary `#04413C`, white, warm neutral greys (`@theme` tokens in `globals.css`).
- The logo file `public/brand/vvx-logo.jpg` is the original, unmodified. `BrandLogo.tsx` displays
  it cropped to the mark with its white background made transparent at render time, so it can sit
  on emerald or white backgrounds. A vector (SVG) logo from the designer can replace it later.

## Demonstration content

The project names **Royal Residence** and **Royal Residence 2** are real. Their descriptions,
apartments, statuses, floor plans and specifications are still fictional and are labelled as
demonstration content on the site. (`layouts.ts` also keeps three unused spare layouts, `kroi-c1..c3`.)

Payment terms (5 or 10 years of instalments, no interest, no guarantor) are defined once in
`paymentTerms` in `src/data/site.ts`.
No company history, awards, certificates or statistics have been invented.

Photography: demonstration images from Unsplash (Unsplash License), stored locally in
`public/images/`. Replace them with the client's own renders and photos.
