import Link from "next/link";
import { FACTOR_LABELS, FACTOR_KEYS } from "@/types";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          あなたの<span className="text-accent">モテIQ</span>、
          <br className="md:hidden" />
          知る覚悟はあるか。
        </h1>
        <p className="text-text-secondary text-lg mb-2">
          30問の診断で、5つの因子からあなたの「大人の魅力」を数値化する。
        </p>
        <p className="text-text-muted text-sm mb-8">
          所要時間：約5分｜匿名・登録不要
        </p>
        <Link
          href="/quiz"
          className="inline-block bg-accent hover:bg-accent-light text-bg-primary font-bold text-lg px-10 py-4 rounded transition-colors"
        >
          無料で診断する
        </Link>
      </section>

      {/* 5 Factors */}
      <section className="py-12">
        <h2 className="text-xl font-bold text-center mb-8 text-text-secondary">
          診断する5つの因子
        </h2>
        <div className="grid gap-4">
          {FACTOR_KEYS.map((key, i) => (
            <div
              key={key}
              className="flex items-center gap-4 bg-bg-card border border-border rounded-lg p-4"
            >
              <span className="text-accent font-bold text-2xl w-8 text-right">
                {i + 1}
              </span>
              <span className="text-text-primary">{FACTOR_LABELS[key]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <h2 className="text-xl font-bold text-center mb-8 text-text-secondary">
          診断の流れ
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "30問に回答", desc: "直感で選ぶだけ。深く考えなくていい。" },
            { step: "02", title: "スコア算出", desc: "5因子のバランスをレーダーチャートで可視化。" },
            { step: "03", title: "詳細レポート", desc: "弱点の具体的な改善法と実践テンプレを提供。" },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-bg-card border border-border rounded-lg p-6 text-center"
            >
              <div className="text-accent text-3xl font-bold mb-2">{item.step}</div>
              <div className="font-bold mb-1">{item.title}</div>
              <div className="text-text-muted text-sm">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 text-center">
        <p className="text-xs text-text-muted max-w-xl mx-auto leading-relaxed">
          ※ 本診断は娯楽目的のエンターテインメントコンテンツです。
          医学的・心理学的な診断やカウンセリングではありません。
          「IQ」という表現は独自のスコアリング指標であり、
          知能指数とは一切関係ありません。
          結果はあくまで参考としてお楽しみください。
        </p>
      </section>
    </div>
  );
}
