# LekhyaAI V2 - GST Accounting & Compliance SaaS

> 🇮🇳 **AI-powered GST accounting platform for Indian SMEs**

A modern, POS-style SaaS application built with Next.js 15, featuring Indian UI/UX design principles, comprehensive GST compliance tools, and intelligent automation.

![LekhyaAI](https://img.shields.io/badge/Status-In%20Development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Features

### 🎨 **Indian-Themed POS Interface**
- **Color Palette**: Saffron (#FF9933), Green (#138808), Navy Blue accents
- **Touch-Friendly**: Large buttons, optimized spacing for tablets and smartphones
- **Tile-Based Navigation**: Quick access dashboard with colorful gradient tiles
- **Receipt-Style Displays**: Familiar POS-like invoice and voucher views
- **1000+ Open-Source Icons**: Lucide React icons for all menus and actions

### 📊 **GST Accounting Core**
- **Sales Invoices**: Create GST-compliant invoices with automatic tax calculation
- **Purchase Bills**: Record purchases with ITC tracking
- **Vouchers**: Journal, Payment, Receipt, and Contra entries
- **Double-Entry Bookkeeping**: Complete ledger and group management
- **HSN/SAC Codes**: Autocomplete with GST rate lookup

### 🧾 **GST Compliance**
- **GSTR-1**: Outward supplies return preparation
- **GSTR-3B**: Monthly return with auto-calculation
- **GSTR-2B**: ITC reconciliation
- **Automatic Tax Calculation**: CGST/SGST for intrastate, IGST for interstate
- **Compliance Alerts**: Deadline reminders and risk assessment

### 🤖 **AI Features** (Planned)
- **Bill Scanning**: OCR-powered invoice data extraction
- **Smart Categorization**: Auto-categorize transactions
- **Compliance Advisor**: AI-powered GST guidance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd LekhyaAIV2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your DATABASE_URL

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
LekhyaAIV2/
├── app/                      # Next.js app directory
│   ├── dashboard/           # Dashboard page
│   ├── invoices/            # Invoice management
│   ├── vouchers/            # Voucher entry
│   ├── gst/                 # GST returns
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx       # POS-style buttons
│   │   ├── card.tsx         # Card components
│   │   ├── tile-button.tsx  # Dashboard tiles
│   │   └── ...
│   └── layout/
│       └── pos-layout.tsx   # Main POS layout
├── lib/
│   └── utils.ts             # GST calculations, formatters
├── prisma/
│   └── schema.prisma        # Database schema
└── tailwind.config.ts       # Tailwind with Indian colors
```

## 🎨 Design System

### Color Palette
- **Primary (Saffron)**: `#FF9933` - Main actions, headers
- **Success (Green)**: `#138808` - Positive actions, compliant status
- **Navy Blue**: `#0369a1` - Secondary actions
- **Warning**: `#f59e0b` - Alerts, pending items
- **Danger**: `#ef4444` - Errors, critical alerts

### Typography
- **Font**: Inter (English), Noto Sans Devanagari (Hindi)
- **POS Sizes**: Larger than standard for touch-friendly interface

### Components
All components follow POS design principles:
- Minimum touch target: 44px
- Large, colorful buttons with icons
- Elevated cards with shadows
- Gradient backgrounds for tiles

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React (1000+ open-source icons)
- **Authentication**: NextAuth.js v5 (planned)
- **OCR**: Tesseract.js (planned)

## 📊 Database Schema

Multi-tenant architecture with:
- **Tenants**: Company/business entities
- **Users**: Role-based access control
- **Ledgers & Groups**: Chart of accounts
- **Vouchers**: Double-entry transactions
- **Invoices**: GST-compliant sales invoices
- **Purchase Bills**: Purchase tracking with ITC
- **HSN Codes**: Master data for GST rates
- **GST Returns**: GSTR-1, 3B, 2B tracking

## 🛠️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npm run db:studio

# Generate Prisma client
npm run db:generate
```

## 📝 GST Calculation Logic

### Intrastate Supply
```typescript
// Same state: CGST + SGST
CGST = (Amount × GST Rate) / 2
SGST = (Amount × GST Rate) / 2
```

### Interstate Supply
```typescript
// Different states: IGST
IGST = Amount × GST Rate
```

The system automatically detects supply type based on seller and buyer state codes from GSTIN.

## 🎯 Roadmap

- [x] Project setup with Next.js 15
- [x] Indian-themed design system
- [x] POS-style layout and navigation
- [x] Dashboard with quick actions
- [x] Invoice creation with GST calculation
- [x] Voucher management
- [x] GST returns overview
- [ ] Authentication & multi-tenancy
- [ ] API routes for CRUD operations
- [ ] AI bill scanning (OCR)
- [ ] GSTR-1/3B generation
- [ ] ITC reconciliation engine
- [ ] Reports and analytics
- [ ] Mobile app (React Native)

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- **Google Fonts**: Inter and Noto Sans Devanagari
- **Lucide Icons**: Beautiful open-source icon set
- **Radix UI**: Accessible component primitives
- **Vercel**: Next.js framework and deployment platform

---

**Built with ❤️ for Indian businesses**

*Simplifying GST compliance, one invoice at a time.*
