// ============================================
// Quiz Master Configuration
// 新しい診断を追加する場合は、このファイルに定義を追加するだけでOK
// コード本体の書き換えは不要
// ============================================

export interface ScoreBucket {
  range: string;
  label: string;
  min: number;
  max: number;
  color: string;
}

export interface QuizConfig {
  /** 一意の識別子 (DB の quiz_id カラムに格納) */
  id: string;
  /** 表示名 */
  name: string;
  /** 短い説明 */
  description: string;
  /** テーマカラー (プライマリ) */
  accentColor: string;
  /** テーマカラー (薄い背景用) */
  accentBg: string;
  /** テーマカラー (テキスト用) */
  accentText: string;
  /** ファネルのステップ色 */
  funnelColors: [string, string, string];
  /** スコア分布のバケット定義 */
  scoreBuckets: ScoreBucket[];
  /** 有料レポートがあるか */
  isPaid: boolean;
  /** レポート単価 (税込, 円) — isPaid: false なら 0 */
  reportPrice: number;
  /** 並び順 (セレクター内での表示順) */
  order: number;
}

// ============================================
// 診断マスタ定義
// ============================================

export const QUIZ_CONFIGS: QuizConfig[] = [
  {
    id: "mote-iq",
    name: "モテIQ診断",
    description: "5つの因子で測るあなたの真のモテ力",
    accentColor: "#007AFF",
    accentBg: "#EBF5FF",
    accentText: "#0055CC",
    funnelColors: ["#007AFF", "#34C759", "#FF9500"],
    scoreBuckets: [
      { range: "0-19",   label: "D",   min: 0,  max: 19,  color: "#FF3B30" },
      { range: "20-34",  label: "D-C", min: 20, max: 34,  color: "#FF9500" },
      { range: "35-54",  label: "C-B", min: 35, max: 54,  color: "#FFCC00" },
      { range: "55-74",  label: "B",   min: 55, max: 74,  color: "#34C759" },
      { range: "75-89",  label: "A",   min: 75, max: 89,  color: "#007AFF" },
      { range: "90-100", label: "S",   min: 90, max: 100, color: "#AF52DE" },
    ],
    isPaid: true,
    reportPrice: 550,
    order: 1,
  },
  {
    id: "jujutsu-quiz",
    name: "呪術廻戦診断",
    description: "あなたの呪術師としての等級を鑑定",
    accentColor: "#6B21A8",
    accentBg: "#F3E8FF",
    accentText: "#581C87",
    funnelColors: ["#6B21A8", "#A855F7", "#E879F9"],
    scoreBuckets: [
      { range: "0-15",   label: "4級",  min: 0,  max: 15,  color: "#94A3B8" },
      { range: "16-35",  label: "3級",  min: 16, max: 35,  color: "#64748B" },
      { range: "36-55",  label: "2級",  min: 36, max: 55,  color: "#8B5CF6" },
      { range: "56-75",  label: "準1級", min: 56, max: 75,  color: "#7C3AED" },
      { range: "76-90",  label: "1級",  min: 76, max: 90,  color: "#6D28D9" },
      { range: "91-100", label: "特級",  min: 91, max: 100, color: "#4C1D95" },
    ],
    isPaid: false,
    reportPrice: 0,
    order: 2,
  },
  {
    id: "frieren-quiz",
    name: "葬送のフリーレン診断",
    description: "あなたは誰タイプ？魔法使いの適性診断",
    accentColor: "#94A3B8",
    accentBg: "#F8FAFC",
    accentText: "#475569",
    funnelColors: ["#94A3B8", "#CBD5E1", "#E2E8F0"],
    scoreBuckets: [
      { range: "0-20",   label: "見習い",   min: 0,  max: 20,  color: "#CBD5E1" },
      { range: "21-40",  label: "3級魔法使い", min: 21, max: 40,  color: "#94A3B8" },
      { range: "41-60",  label: "2級魔法使い", min: 41, max: 60,  color: "#64748B" },
      { range: "61-80",  label: "1級魔法使い", min: 61, max: 80,  color: "#475569" },
      { range: "81-95",  label: "大魔法使い",  min: 81, max: 95,  color: "#334155" },
      { range: "96-100", label: "伝説級",    min: 96, max: 100, color: "#1E293B" },
    ],
    isPaid: false,
    reportPrice: 0,
    order: 3,
  },
];

// ============================================
// ヘルパー関数
// ============================================

/** ID から設定を取得 */
export function getQuizConfig(quizId: string): QuizConfig | undefined {
  return QUIZ_CONFIGS.find((q) => q.id === quizId);
}

/** デフォルトの診断 ID */
export const DEFAULT_QUIZ_ID = "mote-iq";

/** 全診断を order 順で返す */
export function getOrderedQuizzes(): QuizConfig[] {
  return [...QUIZ_CONFIGS].sort((a, b) => a.order - b.order);
}

/** 「全診断」を選択肢に含めたリスト (セレクター用) */
export function getQuizSelectorOptions(): { id: string; name: string; accentColor: string }[] {
  return [
    { id: "all", name: "全診断", accentColor: "#007AFF" },
    ...getOrderedQuizzes().map((q) => ({
      id: q.id,
      name: q.name,
      accentColor: q.accentColor,
    })),
  ];
}
