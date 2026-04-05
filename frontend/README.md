# 📮 PinCode Explorer — Frontend

A modern, responsive React dashboard for exploring India's 1.5 lakh+ PIN code records. Built with **React 19**, **Redux Toolkit**, **Tailwind CSS**, **Recharts**, and **Vite**.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- Backend server running on `http://localhost:5000`

### Installation

```bash
cd frontend
npm install
npm run dev
```

The app will start at **http://localhost:5173**

### Production Build

```bash
npm run build
npm run preview
```

---

## 🗂️ Project Structure

```
frontend/
├── index.html                  # HTML entry point
├── tailwind.config.cjs         # Tailwind CSS configuration
├── vite.config.js              # Vite bundler config
├── package.json
└── src/
    ├── main.jsx                # React entry (Redux Provider)
    ├── App.jsx                 # Router & layout shell
    ├── index.css               # Global styles & design tokens
    ├── store/
    │   ├── store.js            # Redux store configuration
    │   └── slices/
    │       └── pincodeSlice.js # All async thunks & state
    ├── components/
    │   ├── Navbar.jsx          # Sticky glassmorphic navbar
    │   ├── Footer.jsx          # Minimal footer with tech stack
    │   ├── SearchBar.jsx       # Debounced search with suggestions
    │   ├── StatsCard.jsx       # Dashboard stat card
    │   ├── FilterPanel.jsx     # State/District/Taluk filters
    │   └── DataTable.jsx       # Paginated PIN code table
    └── pages/
        ├── Dashboard.jsx       # National dashboard with charts
        ├── Explore.jsx         # Filterable data explorer
        ├── Pincode.jsx         # Single PIN code lookup/details
        └── About.jsx           # About page with tech stack
```

---

## 🧭 Frontend Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Redirects to the national dashboard |
| `/dashboard` | Dashboard | Stats, charts, office breakdown, state distribution |
| `/explore` | Explore | Filterable table with search, export CSV |
| `/pincode` | PIN Lookup | Search prompt with empty state illustration |
| `/pincode/:id` | PIN Details | Detailed record for a specific 6-digit PIN code |
| `/about` | About | How it works, CTA, tech stack with official logos |

---

## 🔌 Backend API Reference

All API endpoints are served from **`http://localhost:5000/api`**

### Core Data

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `GET` | `/api/states` | List all unique states/UTs | `http://localhost:5000/api/states` |
| `GET` | `/api/states/:state/districts` | Districts within a state | `http://localhost:5000/api/states/DELHI/districts` |
| `GET` | `/api/states/:state/districts/:district/taluks` | Taluks within a district | `http://localhost:5000/api/states/DELHI/districts/Central Delhi/taluks` |
| `GET` | `/api/pincodes` | Paginated & filtered PIN codes | `http://localhost:5000/api/pincodes?state=DELHI&page=1&limit=20` |
| `GET` | `/api/search` | Search by PIN, office, district, state | `http://localhost:5000/api/search?q=380001` |
| `GET` | `/api/pincode/:pincode` | Get details for a specific PIN code | `http://localhost:5000/api/pincode/110001` |

### Dashboard Statistics

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `GET` | `/api/stats` | Total PINs, states, delivery/non-delivery counts | `http://localhost:5000/api/stats` |
| `GET` | `/api/stats/state-distribution` | State-wise office count (sorted desc) | `http://localhost:5000/api/stats/state-distribution` |
| `GET` | `/api/stats/delivery-distribution` | Delivery vs non-delivery counts | `http://localhost:5000/api/stats/delivery-distribution` |
| `GET` | `/api/stats/office-type-distribution` | H.O / S.O / B.O breakdown | `http://localhost:5000/api/stats/office-type-distribution` |
| `GET` | `/api/stats/region-distribution` | Top 15 regions by office count | `http://localhost:5000/api/stats/region-distribution` |
| `GET` | `/api/stats/top-districts` | Top 10 districts by office count | `http://localhost:5000/api/stats/top-districts` |

### Export

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `GET` | `/api/export` | Download filtered data as CSV | `http://localhost:5000/api/export?state=DELHI` |

---

## 📊 API Response Examples

### `GET /api/stats`

```json
{
  "totalPincodes": 154823,
  "totalStates": 35,
  "deliveryOffices": 145251,
  "nonDeliveryOffices": 9572
}
```

### `GET /api/stats/state-distribution`

```json
[
  { "state": "UTTAR PRADESH", "count": 17665 },
  { "state": "ANDHRA PRADESH", "count": 16167 },
  { "state": "MAHARASHTRA", "count": 12617 }
]
```

### `GET /api/stats/office-type-distribution`

```json
{
  "B.O": 129213,
  "S.O": 24800,
  "H.O": 810
}
```

### `GET /api/stats/delivery-distribution`

```json
{
  "delivery": 145251,
  "nonDelivery": 9572
}
```

### `GET /api/stats/top-districts`

```json
[
  { "district": "Bangalore", "count": 2456 },
  { "district": "Hyderabad", "count": 2103 }
]
```

### `GET /api/stats/region-distribution`

```json
[
  { "region": "Andhra Pradesh", "count": 16167 },
  { "region": "Maharashtra", "count": 12617 }
]
```

### `GET /api/pincodes?state=DELHI&page=1&limit=2`

```json
{
  "data": [
    {
      "pincode": 110001,
      "officeName": "Baroda House S.O",
      "officeType": "S.O",
      "deliveryStatus": "Non-Delivery",
      "divisionName": "New Delhi Central",
      "districtName": "Central Delhi",
      "stateName": "DELHI"
    }
  ],
  "total": 650,
  "page": 1,
  "limit": 2
}
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| **Brand Coral** | `#FF6B4E` | Buttons, active states, accents |
| **Ink** | `#111827` | Primary text |
| **Muted** | `#6B7280` | Secondary text, labels |
| **Surface** | `#F9FAFB` | Page background |
| **Card** | `#FFFFFF` | Card backgrounds |
| **Font (Body)** | `Inter` | All UI text |
| **Font (Mono)** | `JetBrains Mono` | PIN codes, numbers, labels |
| **Border Radius** | `1.25rem` | Cards, inputs |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Redux Toolkit** | Global state management |
| **React Router v7** | Client-side routing |
| **Tailwind CSS v3** | Utility-first styling |
| **Recharts** | Charts & data visualization |
| **Axios** | HTTP client for API calls |
| **Vite** | Dev server & bundler |
| **Heroicons** | UI icons |

---

## 📝 License

This project is for educational and informational purposes. Data attribution belongs to **India Post**.
