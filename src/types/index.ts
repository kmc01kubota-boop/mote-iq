export type FactorKey =
  | "cleanliness"
  | "conversation"
  | "money"
  | "distance"
  | "sexAppeal";

export const FACTOR_LABELS: Record<FactorKey, string> = {
  cleanliness: "清潔感・生活感コントロール",
  conversation: "会話の余白力",
  money: "お金と余裕の見せ方",
  distance: "距離感と安心感",
  sexAppeal: "大人の色気",
};

export const FACTOR_KEYS: FactorKey[] = [
  "cleanliness",
  "conversation",
  "money",
  "distance",
  "sexAppeal",
];

export interface Question {
  id: number;
  text: string;
  factor: FactorKey;
  weight: 1 | 2 | 3;
  reverse: boolean;
  options: [string, string, string, string];
}

export interface FactorScore {
  raw: number;
  max: number;
  normalized: number; // 0-100
}

export interface Scores {
  factors: Record<FactorKey, FactorScore>;
  total: number;
  grade: string;
  percentile: number;
}

export interface Attempt {
  id: string;
  anon_id: string;
  answers: Record<number, number>; // questionId -> selectedIndex
  scores: Scores;
  created_at: string;
}

export interface Purchase {
  id: string;
  attempt_id: string;
  anon_id: string;
  stripe_session_id: string;
  status: string;
  created_at: string;
}
