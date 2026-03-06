import type { Metadata } from "next";
import QuizClient from "@/components/quiz/QuizClient";

export const metadata: Metadata = {
  title: "診断開始｜15問であなたのモテ力を測定",
  description:
    "直感で答えるだけ。約3分でモテIQスコアを算出し、5因子のバランスをレーダーチャートで可視化。",
  robots: {
    index: false,
    follow: true,
  },
};

export default function QuizPage() {
  return <QuizClient />;
}
