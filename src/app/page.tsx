import Link from "next/link";
import { FACTOR_LABELS, FACTOR_KEYS } from "@/types";

export default function Home() {
  return (
    <div className="bg-bg-primary">
      {/* Hero */}
      <section className="max-w-2xl mx-auto px-5 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <h1 className="text-[2rem] sm:text-4xl md:text-5xl font-semibold text-text-primary leading-tight tracking-tight mb-6">
          あなたのモテIQは？
        </h1>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-3 max-w-md mx-auto px-2">
          25問で「男性としての魅力」を数値化。
          <span className="hidden sm:inline">　</span>
          <br className="sm:hidden" />
          女性が見ているポイントを可視化する。
        </p>
        <p className="text-text-muted text-sm mb-10">
          所要時間：約5分｜匿名・登録不要
        </p>
        <Link
          href="/quiz"
          className="inline-block w-full sm:w-auto bg-accent hover:bg-accent-dark text-white font-medium text-base sm:text-lg px-10 py-4 rounded-2xl transition-colors shadow-sm"
        >
          無料で診断する
        </Link>
      </section>

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
