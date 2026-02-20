import type { Metadata } from "next";
import Link from "next/link";
import { FACTOR_LABELS, FACTOR_KEYS } from "@/types";
import HeroSection from "@/components/home/HeroSection";
import JsonLd from "@/components/layout/JsonLd";

export const metadata: Metadata = {
  title: "モテ度診断で大人の魅力を数値化｜25問・無料・匿名",
  description:
    "5因子であなたのモテ力を残酷なまでに客観的に数値化。約5分で完了、登録不要。恋愛偏差値を知りたいならここから。",
  alternates: {
    canonical: "https://mote-iq.com",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "モテIQ",
      url: "https://mote-iq.com",
      description:
        "5つの因子であなたのモテ力を数値化する25問診断。残酷なまでに客観的な数値が出る。",
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
        description: "基本診断は無料。詳細レポートは有料（税込¥550）。",
      },
      inLanguage: "ja",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "モテIQ診断は何分で完了しますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "全25問で約5分で完了します。直感で答えるだけなので深く考える必要はありません。",
          },
        },
        {
          "@type": "Question",
          name: "どのような因子を診断しますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "清潔感・生活感コントロール、会話の余白力、お金と余裕の見せ方、距離感と安心感、大人の色気の5因子を分析します。",
          },
        },
        {
          "@type": "Question",
          name: "診断結果は他の人に見られますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "完全匿名で登録不要です。結果は固有URLで発行されますが、そのURLを共有しない限り他人には見られません。",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <div className="bg-bg-primary">
      <JsonLd data={jsonLdData} />
      {/* Hero */}
      <HeroSection />

      {/* 5 Factors */}
      <section className="max-w-2xl mx-auto px-5 py-12 sm:py-16">
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-8 text-text-primary">
          診断する5つの因子
        </h2>
        <div className="grid gap-3">
          {FACTOR_KEYS.map((key, i) => (
            <div
              key={key}
              className="flex items-center gap-4 bg-bg-card border border-border rounded-2xl p-4 sm:p-5"
            >
              <span className="text-accent font-semibold text-xl w-8 text-center">
                {i + 1}
              </span>
              <span className="text-text-primary text-sm sm:text-base">
                {FACTOR_LABELS[key]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-2xl mx-auto px-5 py-12 sm:py-16">
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-8 text-text-primary">
          診断の流れ
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "25問に回答",
              desc: "直感で選ぶだけ。深く考えなくていい。",
            },
            {
              step: "02",
              title: "スコア算出",
              desc: "5因子のバランスをチャートで可視化。",
            },
            {
              step: "03",
              title: "改善ヒント",
              desc: "弱点の改善法と実践テンプレを提供。",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-bg-card border border-border rounded-2xl p-6 text-center"
            >
              <div className="text-accent text-2xl font-semibold mb-3">
                {item.step}
              </div>
              <div className="font-medium text-text-primary mb-2">
                {item.title}
              </div>
              <div className="text-text-muted text-sm leading-relaxed">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-2xl mx-auto px-5 py-12 sm:py-16">
        <div className="bg-accent-bg rounded-3xl p-8 sm:p-12 text-center">
          <p className="text-text-secondary text-sm sm:text-base mb-6">
            「なぜかモテる人」には理由がある。
            <br />
            あなたの現在地を、まず知ることから。
          </p>
          <Link
            href="/quiz"
            className="inline-block w-full sm:w-auto bg-accent hover:bg-accent-dark text-white font-medium text-base px-10 py-4 rounded-2xl transition-colors shadow-sm"
          >
            無料で診断する（約5分）
          </Link>
        </div>
      </section>

      {/* Media Links */}
      <section className="max-w-2xl mx-auto px-5 py-6">
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://note.com/mote_iq_official/all"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.904 6.748l-5.652-5.652c-.746-.746-2.051-.697-2.907.159L2.404 13.197a2.252 2.252 0 00-.159 2.907l5.652 5.652c.746.746 2.051.697 2.907-.159L22.745 9.655c.856-.856.905-2.161.159-2.907zM10.856 18.344L5.656 13.144 14.4 4.4l5.2 5.2-8.744 8.744z"/>
            </svg>
            note
          </a>
          <span className="text-border">|</span>
          <a
            href="https://open.spotify.com/episode/3YOV8VlOOzOtG1rFeL5RWx?si=Rh2M_omSSSu4F3ZJlw0NFQ"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Podcast
          </a>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <p className="text-xs text-text-muted text-center leading-relaxed">
          ※ 本診断は娯楽目的のエンターテインメントコンテンツです。
          医学的・心理学的な診断やカウンセリングではありません。
          「IQ」という表現は独自のスコアリング指標であり、知能指数とは一切関係ありません。
        </p>
      </section>
    </div>
  );
}
