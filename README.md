# OrbitOps — Commerce Operations Dashboard

OrbitOps is a frontend-first dashboard prototype for a fictional fashion and quick-commerce operation. It is designed to demonstrate polished internal tooling: order management, inventory health, reporting visualisations, and reusable responsive UI patterns.

> This is an independent portfolio demo, not an official Slikk, Mode Commerce, or production operations tool. All names, orders, numbers, inventory records, and KPIs are mock data. No production APIs, payment providers, or warehouse systems are connected.

## Preview

The app opens on **Overview**. Use the left navigation to move between Overview, Orders, Inventory, Analytics, and Settings. Most controls are interactive so the project can be explored without a backend.

## Tech stack

- **Next.js App Router** with React and TypeScript
- **Tailwind CSS v4** installed for utility-first styling, plus a custom CSS design system for the dashboard's visual polish and responsive breakpoints
- **Recharts** for sales, channel-mix, inventory-health, and fulfilment charts
- **Lucide React** icons
- Local typed mock data and React state; no environment variables required

## Features

### Overview
- Four KPI cards with trend indicators
- Revenue area chart with tooltip and date-range selector
- Inventory health donut chart
- Recent orders, searchable order table, and status filter
- Top-moving products and activity timeline
- Notification popover and responsive mobile sidebar

### Orders
- Search across order ID, customer, email, city, channel, and item names
- Filter by Processing, Packed, Dispatched, Delivered, or Delayed
- Export the currently filtered orders as a CSV file
- Create a sample order through a form
- Open any order in a details drawer and advance its status through the fulfilment lifecycle

### Inventory
- Stock-health KPIs and searchable SKU table
- Low-stock-only filter and stock-level progress indicators
- Add a sample SKU through a form
- Export the currently filtered inventory list as CSV
- Mock warehouse, reorder-point, price, and sales-velocity information

### Analytics
- Revenue trend, sales-channel contribution, and on-time dispatch trend charts
- Tooltips, legends, axis labels, and responsive chart containers

### Settings
- Editable profile and workspace fields
- Working notification and display preference toggles
- Reset demo preferences

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To create a production build:

```bash
npm run build
npm start
```

## Project structure

```text
OrbitOps_Frontend_Dashboard/
├── app/
│   ├── globals.css           # Design tokens, components, responsive styles
│   ├── layout.tsx            # Root layout and metadata
│   └── page.tsx              # Dashboard entry point
├── components/
│   └── ops-dashboard.tsx     # Dashboard views, state, tables, dialogs, charts
├── lib/
│   └── data.ts               # Typed mock orders, products, and chart series
├── package.json
├── postcss.config.mjs
├── next.config.ts
└── tsconfig.json
```

## Key frontend concepts demonstrated

- **Reusable UI:** KPI cards, status badges, table controls, section headings, avatars, and buttons share consistent styling.
- **Client-side state:** search, filters, navigation, notification popover, create-order and add-SKU forms, order status transitions, and settings toggles update the UI immediately.
- **Derived data:** `useMemo` filters order and inventory records from current search/filter state rather than maintaining duplicate arrays.
- **Responsive layout:** the sidebar becomes a mobile drawer; metric cards, visualisations, forms, and table containers adapt at multiple breakpoints.
- **Accessible interactions:** icon-only buttons have labels, the table supports Enter on focused rows, controls use labels, and dialogs expose dialog semantics.
- **Data visualisation:** charts use responsive containers and contextual tooltip formats.
- **CSV export:** filtered order data is serialised and downloaded from the browser without a server.

## Suggested next improvements

1. Replace `lib/data.ts` with typed REST API services and explicit loading, error, and empty states.
2. Add component tests for search/filter combinations and order status transitions.
3. Add Playwright end-to-end tests for the key workflows.
4. Add pagination and server-side filtering for large datasets.
5. Add an authentication layer and permission-aware navigation if connecting to a real backend.

## Portfolio note

Before listing this project on a CV, run it locally, test the main workflows, push it to your GitHub, and replace this repository's generic information with your own links. Describe it as a **frontend portfolio prototype built with mock data**, not as a production system.

## Developer
<table>
    <tr align="center">
        <td>
        Sandhit Karmakar
        <p align="center">
            <img src = "https://avatars.githubusercontent.com/u/90787826?v=4" width="150" height="150" alt="Dhruv Shah">
        </p>
            <p align="center">
                <a href="https://github.com/Sandhit06">
                    <img src="https://res.cloudinary.com/dyz1paeem/image/upload/v1793130084/round-collaboration-social-github-code-circle-network-icon_rk5x5t.svg" width="36" height="36" alt="GitHub"/>
                </a>
                <a href="https://www.linkedin.com/in/sandhit-karmakar/" target="_blank">
                    <img src="https://res.cloudinary.com/dyz1paeem/image/upload/v1793130084/network-linkedin-social-connection-circular-circle-media-icon_vdou3m.svg" width="36" height="36" alt="LinkedIn"/>
                </a>
                <a href="mailto:sandhitkarmakar@gmail.com" target="_blank">
                    <img src="https://res.cloudinary.com/dyz1paeem/image/upload/v1793129062/share-send-email-chat-circle-message-mail-icon_u4rx53.svg" width="36" height="36" alt="Email"/>
                </a>
            </p>
        </td>
    </tr>
</table>

<p align="center">
    Made with ❤️ by <a href="https://github.com/Sandhit06">Sandhit Karmakar</a>
</p>
