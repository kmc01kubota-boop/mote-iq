"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past ~400px (below hero CTA)
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50 sm:hidden
        bg-white/95 backdrop-blur-sm border-t border-border
        px-4 py-3
        transition-transform duration-300
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <Link
        href="/quiz"
        className="block w-full bg-accent hover:bg-accent-dark text-white font-semibold text-base py-3.5 rounded-xl text-center transition-colors shadow-sm"
      >
        無料で診断する（約3分）
      </Link>
    </div>
  );
}
