# VS Engineering — Precision Machining & Heavy Industrial Fabrication Web Application

A full-stack, production-quality enterprise web platform built for **VS Engineering**, an engineering and manufacturing company operating in Chennai and Coimbatore, India.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with custom industrial blueprint design tokens:
  - **Primary**: Deep Navy (`#0B1F3A`)
  - **Surfaces**: Steel Grays (`#F8FAFC` to `#0F172A`)
  - **Accent**: Safety Orange (`#F26B1D`)
  - **Grid**: Custom Engineering Blueprint Patterns
- **Database & ORM**: PostgreSQL / SQLite dual-compatibility with **Prisma ORM**
- **Authentication**: Role-based access control (`ADMIN`, `CUSTOMER`) with bcrypt password hashing and secure JWT session cookies
- **Invoicing & PDF Generation**: `jspdf` & `jspdf-autotable` vector PDF generation with Indian GST calculations (Intra-state CGST+SGST vs Inter-state IGST) and amount in words
- **Icons**: Lucide React
- **Forms & Validation**: Controlled multi-step wizards with autosave to `localStorage`

---

## 🚀 Quick Start (One Command)

The application includes a zero-friction local SQLite database setup out of the box with rich seed data.

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Push Prisma database schema & generate client
npm run prisma:push

# 3. Seed demo accounts, quotes, orders, and stock items
npm run prisma:seed

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts & Credentials

Use the **Quick Demo Switcher** directly on the [Login Page](/login) to sign in with one click, or use the credentials below:

| Role | Name & Company | Email | Password | Access Area |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Suresh Ramanathan (VS Engineering Team) | `admin@vsengineering.com` | `AdminPassword123!` | `/admin` |
| **Customer 1** | Rajesh Kulkarni (Precision Auto Components, Pune, MH) | `rajesh@precisionauto.in` | `Customer123!` | `/dashboard` |
| **Customer 2** | Vikram Menon (AeroTech Dynamics, Bengaluru, KA) | `vikram@aerotechindia.com` | `Customer123!` | `/dashboard` |
| **Customer 3** | Ananya Deshmukh (Heavy Infra Mining, Coimbatore, TN) | `ananya@heavyinfra.co.in` | `Customer123!` | `/dashboard` |

---

## 🌐 Application Architecture & Pages

### 1. Public Website Pages
- **Home (`/`)**: Industrial blueprint hero with value propositions, stats (±0.005mm tolerance, 4h turnaround, 45,000+ parts), 4 core capabilities, 4-step production workflow, certifications, and client testimonials.
- **About (`/about`)**: 40,000+ sq. ft. workshop facilities, 25 MT crane capacity, machinery & calibration table, ISO 9001:2015 certification details, and AWS/ASME welder qualifications.
- **Services (`/services`)**: Detailed engineering specs, working envelopes, materials handled (SS304/316, EN8/19/24, Titanium, 7075-T6), and surface treatments.
- **Gallery (`/gallery`)**: Filterable past work portfolio with interactive modal lightbox.
- **Available Stock (`/stock`)**: Standard pre-machined flanges, machine mounting bases, turned shaft blanks, and hydraulic manifold subplates ready for 24h dispatch.
- **Contact (`/contact`)**: Workshop address, Google Maps embed, phone, email, WhatsApp click-to-chat, bank details, and enquiry form connected to DB.
- **Sticky Widgets**: Floating WhatsApp chat (`+91 98765 43210`) & sticky "Get Fast Quote" button.

### 2. Multi-Step Quoting Engine (`/quote`)
- **Step 1: Contact Info**: Name, email, phone, company, optional 15-digit GSTIN.
- **Step 2: Technical Specifications**: Process selection, material, quantity, dimensions, tolerance (±0.005mm to ±0.5mm), finish, required-by date, notes.
- **Step 3: Drawings Upload**: Supports PDF, DWG, DXF, STEP, STP up to 25 MB with progress indicator and file removal.
- **Step 4: Review & Indian State**: Dropdown of Indian states with automatic intra-state vs inter-state tax regime preview.
- **Draft Autosave**: Automatically persists form progress to `localStorage`.
- **Guest Auto-Account**: Creates customer account automatically if visitor is new.

### 3. Customer Dashboard (`/dashboard`)
- **KPI Overview**: Active Orders, Pending Quotes, Payments Due.
- **My Orders**:
  - Live 6-stage timeline: `Confirmed` → `In Production` → `QC Passed` → `Packed` → `Dispatched` → `Delivered`.
  - Shop floor progress photo gallery with timestamps.
  - Indian consignment logistics box (Transporter e.g. V-Trans, LR number, Vehicle number, 12-digit Indian GST E-Way Bill).
  - One-click "Reorder" button duplicating past specs into a new quote.
  - Download official GST Tax Invoices.
- **My Quotes**: List quotes with statuses, inspect quoted pricing, accept quotes (which automatically confirms and creates the Order), or request revisions.
- **Payments**: Bank account details (HDFC Bank, Current A/C, IFSC: `HDFC0001234`), UPI ID (`vsengineering@hdfcbank`), interactive UPI QR code, and UTR submission modal for offline bank reconciliation.
- **Profile**: Company details, GSTIN, and saved shipping addresses.

### 4. Admin Management Panel (`/admin`)
- **Executive Dashboard (`/admin`)**: KPIs, production stage distribution, pan-India state breakdown (Tamil Nadu, Maharashtra, Karnataka, Gujarat), recent quotes.
- **Quote Management (`/admin/quotes`)**: Inspect drawings, line-item pricing editor, live CGST+SGST/IGST calculation, validity days, and "Send Quote" button.
- **Order Tracking (`/admin/orders`)**: 1-click stage updates, upload shop floor inspection photos, enter transport & E-Way Bill logistics.
- **Payment Verification Queue (`/admin/payments`)**: Review customer payment slips and UTR numbers, 1-click verify & credit (which automatically updates order payment state to `ADVANCE_PAID` or `FULLY_PAID` and issues the Tax Invoice) or reject with reason.
- **Stock Management (`/admin/stock`)**: Add, edit, and delete ready inventory items.

### 5. Indian GST & Tax Invoicing
- **Intra-State**: If delivery state is **Tamil Nadu** (home state), calculates **9% CGST + 9% SGST**.
- **Inter-State**: If delivery state is outside Tamil Nadu (e.g. Maharashtra, Karnataka), calculates **18% IGST**.
- **Vector PDF Generator (`/api/invoices/[id]/pdf`)**: Generates compliant tax invoices with sequential numbering (`VSE-INV-2026-0001`), HSN/SAC codes, Place of Supply, Amount in words in Indian Rupees (e.g., "One Lakh Forty Seven Thousand Five Hundred Rupees Only"), bank remittance details, and authorized signature.

---

## 🧪 Automated Unit Tests

Run the test suite:

```bash
node tests/gst-and-status.test.js
```

Verifies:
1. Intra-state GST calculation (CGST 9% + SGST 9%)
2. Inter-state GST calculation (IGST 18%)
3. Number to Indian currency words conversion
4. 6-stage order lifecycle progression
5. Payment state derivation (`UNPAID` → `ADVANCE_PAID` → `FULLY_PAID`)

---

## 💡 Sensible Assumptions Made

1. **Company Location & Home State**: Headquartered in SIDCO Industrial Estate, Ambattur, Chennai with operations in Coimbatore, Tamil Nadu (State Code: 33).
2. **Standard Engineering Advance**: 50% advance payment standard for custom engineering fabrication in India, with the balance due before final dispatch.
3. **Database Dual-Compatibility**: Configured with SQLite locally for zero-friction setup without requiring Docker/Postgres installation, while maintaining full PostgreSQL compatibility for cloud deployment (Neon/Supabase) by simply switching the provider in `prisma/schema.prisma` and `.env`.
4. **Offline Manual Payment Verification**: Customers pay via NEFT/RTGS/IMPS or UPI QR code and submit their UTR transaction number; internal accounting approves the transaction in `/admin/payments` before credit is reflected.
