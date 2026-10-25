"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, FileText, ChevronUp } from "lucide-react";

export const StickyWidgets: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-3 sm:left-6 z-40 flex flex-col items-start gap-2 sm:gap-3 pointer-events-none">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="pointer-events-auto p-2 sm:p-2.5 rounded-full bg-steel-800 text-white shadow-lg hover:bg-steel-700 transition-all hover:scale-105 focus:outline-none"
        >
          <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      )}

      {/* Sticky Get a Quote CTA */}
      <Link
        href="/quote"
        className="pointer-events-auto group hidden md:flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs tracking-wide uppercase px-4 py-2.5 rounded-full shadow-xl border border-navy-700 transition-all hover:-translate-y-0.5"
      >
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
        <FileText className="w-4 h-4 text-orange-400 group-hover:rotate-12 transition-transform" />
        <span>Get Fast Quote</span>
      </Link>

      {/* Sticky WhatsApp Click-to-Chat */}
      <a
        href="https://wa.me/919345804547?text=Hello%20VS%20Engineering%20team,%20I%20would%20like%20to%20discuss%20a%20manufacturing%20quotation."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-emerald-600/30 font-medium text-xs border border-white/20"
      >
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white shrink-0" />
        <span className="font-semibold hidden sm:inline">WhatsApp (+91 93458 04547)</span>
        <span className="font-semibold sm:hidden text-[11px]">WhatsApp</span>
      </a>
    </div>
  );
};
