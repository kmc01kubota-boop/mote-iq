import type { Metadata } from "next";
import QuizClient from "@/components/quiz/QuizClient";

export const metadata: Metadata = {
  title: "診断開始｜25問であなたのモテ力を測定",
  description:
    "直感で答えるだけ。約5分でモテIQスコアを算出し、5因子のバランスをレーダーチャートで可視化。",
  robots: {
    index: false,
    follow: true,
  },
};

export default function QuizPage() {
  return <QuizClient />;
}
