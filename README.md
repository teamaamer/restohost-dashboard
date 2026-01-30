# Restaurant Analytics Dashboard

A production-quality analytics dashboard for restaurants that ingests call transcripts from RestoHost.ai and generates detailed insights including sales, orders, calls, average ticket, and call minutes with detailed order/call views and audio playback.

## Features

- 📊 **Overview Dashboard** - KPIs, charts, and trends for sales, orders, calls, and conversion rates
- 📦 **Orders Management** - Detailed order views with items, payment methods, and linked calls
- 📞 **Calls Tracking** - Call transcripts, audio playback, and outcome tracking
- 🏪 **Restaurant Analytics** - Performance metrics per restaurant
- 🔐 **Authentication** - Secure admin login with NextAuth
- 🌓 **Dark Mode** - Full dark mode support
- 📱 **Responsive Design** - Mobile-friendly with collapsible sidebar
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MySQL with Prisma ORM
- **UI**: TailwindCSS + shadcn/ui components
- **Charts**: Recharts
- **Authentication**: NextAuth v5
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL database
- npm or yarn

### Installation

1. **Clone and install dependencies**:
```bash
cd restaurant-analytics
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="mysql://user:password@localhost:3306/restaurant_analytics"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@restaurant.com"
ADMIN_PASSWORD="admin123"
```

3. **Set up the database**:
```bash
npx prisma generate
npx prisma db push
```

4. **Seed sample data** (optional):
```bash
npx tsx scripts/seed.ts
```

5. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and login with:
- Email: `admin@restaurant.com`
- Password: `admin123`

## API Endpoints

### Ingestion Endpoint

**POST** `/api/ingest/restohost`

Ingests call transcripts and orders from RestoHost.ai:

```json
{
  "restaurant": {
    "externalId": "resto_001",
    "name": "Pizza Palace",
    "brand": "Palace Group",
    "phone": "+972599123456",
    "timezone": "Asia/Hebron"
  },
  "call": {
    "id": "call_001",
    "startedAt": "2026-01-30T10:10:00Z",
    "endedAt": "2026-01-30T10:14:40Z",
    "callerPhone": "+972599111222",
    "callerName": "Ahmad",
    "recordingUrl": "https://example.com/recording.mp3",
    "isRecorded": true,
    "transcriptText": "Full call transcript...",
    "summaryText": "Call summary...",
    "outcome": "ORDER_PLACED"
  },
  "orders": [
    {
      "id": "order_001",
      "orderType": "PICKUP",
      "paymentMethod": "CASH",
      "subtotal": 80.0,
      "tax": 0,
      "tip": 0,
      "total": 80.0,
      "status": "PLACED",
      "customerName": "Ahmad",
      "customerPhone": "+972599111222",
      "items": [
        {
          "itemName": "Shawarma",
          "quantity": 2,
          "unitPrice": 25,
          "modifiersJson": { "noOnions": true }
        }
      ]
    }
  ]
}
```

### Other Endpoints

- **GET** `/api/metrics` - Dashboard metrics with filters
- **GET** `/api/restaurants` - List all restaurants
- **GET** `/api/restaurants/stats` - Restaurant performance stats
- **GET** `/api/orders` - Paginated orders list
- **GET** `/api/calls` - Paginated calls list

## Database Schema

### Restaurants
- id, name, brand, phone, timezone, externalId

### Calls
- id, restaurantId, startedAt, endedAt, durationSeconds
- callerPhone, callerName, transcriptText, summaryText
- outcome (ORDER_PLACED, INQUIRY, MISSED, CANCELED, OTHER)
- recordingUrl, isRecorded

### Orders
- id, callId, restaurantId, orderType (PICKUP, DELIVERY)
- paymentMethod (CASH, CARD, ONLINE, OTHER, UNKNOWN)
- subtotal, tax, tip, total
- status (PLACED, CANCELED, FAILED, NEEDS_FOLLOWUP)
- customerName, customerPhone

### OrderItems
- id, orderId, itemName, quantity, unitPrice, modifiersJson

## Project Structure

```
restaurant-analytics/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # NextAuth endpoints
│   │   ├── calls/             # Calls API
│   │   ├── ingest/            # Ingestion endpoint
│   │   ├── metrics/           # Metrics API
│   │   ├── orders/            # Orders API
│   │   └── restaurants/       # Restaurants API
│   ├── dashboard/             # Dashboard pages
│   │   ├── calls/             # Calls page
│   │   ├── orders/            # Orders page
│   │   ├── restaurants/       # Restaurants page
│   │   ├── layout.tsx         # Dashboard layout
│   │   ├── page.tsx           # Overview page
│   │   └── overview-content.tsx
│   ├── login/                 # Login page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── date-range-picker.tsx
│   └── kpi-card.tsx
├── lib/
│   ├── auth.ts                # Auth configuration
│   ├── prisma.ts              # Prisma client
│   └── utils.ts               # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
└── scripts/
    └── seed.ts                # Database seeding
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name
```

## License

MIT
