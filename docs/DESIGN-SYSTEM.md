# DESIGN-SYSTEM.md

## DESIGN-REFERENCE-001

The approved design reference for the dashboard is the image located at:

- docs/dashboard-reference.png

This reference defines the official information architecture and visual composition for the Realtor AI Office dashboard. It establishes the expected product framing, including the layout, ordering, density, and pacing that future surfaces should follow without hard-coding a pixel-perfect implementation.

## Documented design intent

Key design characteristics from the reference image include:

- left navigation rail with a strong product brand and hierarchy
- centralized work surface for the Chispita assistant area
- strong command entry pattern using "Ask Chispita anything..."
- KPI cards positioned directly under the assistant area
- property cards showing image-led cards, pricing, city, and details
- utility panels for tasks, publishing queue, and calendar
- compact but readable spacing and high-density information layout
- dark premium SaaS visual atmosphere with subtle blue glow and depth

## Approved default theme

The approved production default remains a dark mode experience:

- deep navy / dark blue outer background
- soft blue radiance toward the center
- controlled luminosity and depth
- premium SaaS palette without heavy neon or saturated extremes
- readable surfaces and careful contrast for utility cards and forms

This atmosphere must remain the default visual baseline for production-ready dashboard surfaces.

## Future light mode architecture

Light mode is required as a supported future mode, but it must not duplicate the full dashboard structure. Instead, the application should use theme tokens connected to CSS variables so each surface, panel, border, and text color can adapt cleanly between dark and light modes.

Required token categories include:

- background
- background glow
- surface
- surface elevated
- border
- text primary
- text secondary
- accent
- success
- warning
- danger
- muted

## Component guidance

The dashboard should remain oriented around reusable, responsive primitives:

- shell layout
- sidebar navigation
- filter/search surface
- cards
- status chips
- list rows
- utility panels
- data cards
- tenant-aware surfaces

The goal is to preserve the design reference while building a maintainable architecture that can support future product features without breaking the approved visual identity.

## Deferred work boundaries

This checkpoint does not implement:

- MLS integrations
- Zillow or other listing syndication work
- social publishing automation
- autonomous external execution
- productized marketing automation
- real data ingestion

The design system only establishes the approved structure and design tokens needed to support those capabilities later.
