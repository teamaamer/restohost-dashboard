# Restaurant Analytics Dashboard

A modern analytics dashboard for restaurants powered by **Sammai AI**. View and manage calls, orders, reservations, and menu items with real-time data from the Sammai API.

## Features

- 📊 **Overview Dashboard** - Real-time stats for calls, orders, and reservations from Sammai API
- 📞 **Calls Management** - View call transcripts, recordings, and outcomes (read-only)
- 📦 **Orders Management** - View and update orders with detailed item information
- � **Reservations** - Manage restaurant reservations with customer details
- �️ **Menu Viewer** - Browse menu items with categories, pricing, and dietary info
- 🔐 **Authentication** - Secure login with Sammai API credentials
- 📱 **Responsive Design** - Mobile-friendly with modern UI
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- ⚡ **Real-time Data** - Direct integration with Sammai API

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Backend**: Sammai API (Python FastAPI)
- **UI**: TailwindCSS + shadcn/ui components
- **State Management**: Zustand (auth)
- **Authentication**: JWT tokens from Sammai API
- **TypeScript**: Full type safety
- **API Client**: Custom Sammai client with auth

## Getting Started

### Prerequisites

- Node.js 18+
- Sammai API running on `http://localhost:8000`
- npm or yarn

### Installation

1. **Clone and install dependencies**:
```bash
cd restaurant-analytics
npm install
```

2. **Set up environment variables**:

Create a `.env` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
SAMMAI_API_URL=http://localhost:8000
SAMMAI_TENANT_ID=your-tenant-id-here
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

3. **Start the Sammai API** (in separate terminal):
```bash
cd /path/to/sammai-api
source venv/bin/activate
uvicorn app.main:app --reload
```

4. **Seed demo data** (optional):
```bash
cd /path/to/sammai-api
source venv/bin/activate
python -m app.db.seed_full
```

5. **Run the dashboard**:
```bash
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login) and login with:
- Email: `admin@loman.ai`
- Password: `admin123`

Or super admin:
- Email: `super@loman.ai`
- Password: `super123`

## API Integration

The dashboard integrates with the Sammai API and provides the following endpoints:

### Dashboard API Routes (Proxy to Sammai)

- **GET** `/api/calls` - List calls with pagination
- **GET** `/api/calls/stats` - Call statistics summary
- **GET** `/api/orders` - List orders with pagination
- **GET** `/api/orders/stats` - Order statistics and revenue
- **GET** `/api/reservations` - List reservations with pagination
- **GET** `/api/reservations/stats` - Reservation statistics
- **GET** `/api/menu` - List menu items with category filtering

### Sammai API Endpoints Used

- `POST /auth/login` - User authentication
- `GET /tenants/{id}` - Get tenant details
- `GET /tenants/{id}/calls` - List calls
- `GET /tenants/{id}/calls/stats/summary` - Call stats
- `GET /tenants/{id}/orders` - List orders
- `GET /tenants/{id}/orders/stats/summary` - Order stats
- `GET /tenants/{id}/reservations` - List reservations
- `GET /tenants/{id}/reservations/stats/summary` - Reservation stats
- `GET /tenants/{id}/menu_items` - List menu items
- `PUT /tenants/{id}/orders/{order_id}` - Update order
- `PUT /tenants/{id}/reservations/{res_id}` - Update reservation

## Data Models (from Sammai API)

### Calls
- Read-only (created by phone system)
- Includes transcripts, recordings, outcomes
- Linked to orders and reservations

### Orders
- View and update (created by AI agent)
- Customer info, items, pricing, payment status
- Linked to originating call

### Reservations
- View and update (created by AI agent)
- Party size, date/time, customer details
- Status tracking (pending, confirmed, seated, completed)

### Menu Items
- Read-only view
- Categories, pricing, dietary info
- Modifiers and availability status

### Tenants
- Multi-tenant support
- Restaurant settings and configuration

## Project Structure

```
restaurant-analytics/
├── app/
│   ├── api/                    # API routes (proxy to Sammai)
│   │   ├── calls/             # Calls API + stats
│   │   ├── orders/            # Orders API + stats
│   │   ├── reservations/      # Reservations API + stats
│   │   └── menu/              # Menu items API
│   ├── dashboard/             # Dashboard pages
│   │   ├── calls/             # Calls page
│   │   ├── orders/            # Orders page
│   │   ├── reservations/      # Reservations page
│   │   ├── menu/              # Menu page
│   │   ├── layout.tsx         # Dashboard layout
│   │   ├── page.tsx           # Overview page
│   │   └── overview-content.tsx
│   ├── login/                 # Login page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── dashboard-navrail.tsx  # Navigation sidebar
│   ├── kpi-card.tsx           # KPI display component
│   └── ProtectedRoute.tsx     # Auth wrapper
├── lib/
│   ├── sammai-client.ts       # Sammai API client
│   ├── sammai-types.ts        # TypeScript types
│   ├── sammai-adapter.ts      # Data adapters
│   ├── auth-store.ts          # Zustand auth store
│   ├── api-client.ts          # Auth API client
│   └── utils.ts               # Utility functions
└── middleware.ts              # Route middleware
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Features Aligned with Sammai API

✅ **Calls** - Read-only (created by phone system)
✅ **Orders** - View and update (created by AI agent)
✅ **Reservations** - View and update (created by AI agent)
✅ **Menu** - Read-only (view items and categories)
✅ **Authentication** - JWT tokens from Sammai API
✅ **Multi-tenant** - Uses Sammai tenant system

## Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Sammai API URL (for client-side)
- `SAMMAI_API_URL` - Sammai API URL (for server-side)
- `SAMMAI_TENANT_ID` - Your tenant UUID from Sammai database
- `NEXTAUTH_SECRET` - Secret for session encryption
- `NEXTAUTH_URL` - Dashboard URL

### Getting Tenant ID

Your tenant ID can be found in the Sammai database:
```sql
SELECT id, name FROM tenants;
```

Or check the seed script output when running `seed_full.py`.

## License

MIT
