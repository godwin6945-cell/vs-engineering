import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyWidgets } from "@/components/layout/StickyWidgets";

import { AIChatbot } from "@/components/ui/AIChatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VS Engineering | Precision CNC Machining & Heavy Industrial Fabrication",
  description: "ISO 9001:2015 certified precision engineering enterprise in Coimbatore, India. Offering high-tolerance 3/4/5-axis CNC machining, sheet metal laser cutting, heavy fabrication, and custom spare assemblies.",
  keywords: [
    "CNC Machining India",
    "Precision Engineering Coimbatore",
    "Heavy Fabrication Tamil Nadu",
    "Sheet Metal Laser Cutting",
    "Industrial Spares Manufacturing",
    "VS Engineering",
    "Custom Machine Parts India"
  ],
  authors: [{ name: "VS Engineering" }],
  openGraph: {
    title: "VS Engineering | Precision CNC Machining & Fabrication",
    description: "High-precision manufacturing in India. Fast quotes on 2D/3D CAD drawings (PDF, DWG, STEP).",
    url: "https://vsengineering.in",
    siteName: "VS Engineering",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "VS Engineering Works",
    "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    "description": "ISO 9001:2015 certified engineering enterprise specializing in precision CNC machining, sheet metal fabrication, and custom industrial spare assemblies.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "VS Engineering Works",
      "addressLocality": "Coimbatore",
      "addressRegion": "Tamil Nadu",
      "postalCode": "641001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "11.0521548",
      "longitude": "76.9805393"
    },
    "telephone": "+91-9345804547",
    "priceRange": "₹₹ - ₹₹₹₹",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:30",
        "closes": "19:30"
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans selection:bg-orange-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyWidgets />
        <AIChatbot />
      </body>
    </html>
  );
}
