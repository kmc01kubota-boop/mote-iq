"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="max-w-2xl mx-auto px-5 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
      {/* Logo - fade in + breathing float */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-8 sm:mb-10"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-[-0.03em]">
            <span className="text-accent">モテ</span>
            <span className="text-[#1d1d1f]">IQ</span>
          </span>
        </motion.div>
      </motion.div>

      {/* Catchphrase - staggered fade in from below */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-base sm:text-lg md:text-xl font-semibold tracking-tight bg-gradient-to-r from-[#1d1d1f] via-[#48484a] to-[#1d1d1f] bg-clip-text text-transparent mb-6 sm:mb-8"
      >
        大人の魅力、数値化します。
      </motion.p>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-[2.5rem] sm:text-5xl md:text-6xl font-bold text-[#1d1d1f] leading-[1.1] tracking-[-0.02em] mb-6"
      >
        あなたの
        <br className="sm:hidden" />
        モテIQは？
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.1, ease: "easeOut" }}
        className="text-[#48484a] text-base sm:text-lg leading-relaxed mb-3 max-w-md mx-auto px-2 tracking-[-0.01em]"
      >
        25問で「男性としての魅力」を数値化。
        <span className="hidden sm:inline">　</span>
        <br className="sm:hidden" />
        女性が見ているポイントを可視化する。
      </motion.p>

      {/* Meta */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="text-[#86868b] text-sm mb-10"
      >
        所要時間：約5分｜匿名・登録不要
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6, ease: "easeOut" }}
      >
        <Link
          href="/quiz"
          className="inline-block w-full sm:w-auto bg-accent hover:bg-accent-dark text-white font-semibold text-base sm:text-lg px-10 py-4 rounded-2xl transition-colors shadow-sm"
        >
          無料で診断する
        </Link>
      </motion.div>
    </section>
  );
}
