/**
 * OGP画像生成用のタイプ別デザインデータ
 * グレードに応じたアクセントカラーで差別化
 */

export type OgTypeData = {
  emoji: string;
  accentColor: string; // グラデーション主色
};

const OG_TYPE_MAP: Record<string, OgTypeData> = {
  // S/A: プレミアム感
  S: { emoji: "👑", accentColor: "#C9A962" },
  A: { emoji: "⚔️", accentColor: "#B08A2E" },

  // B: ブルー系（改善余地あり）
  B_cleanliness: { emoji: "💎", accentColor: "#5B8FB9" },
  B_conversation: { emoji: "🎤", accentColor: "#5B8FB9" },
  B_money: { emoji: "💰", accentColor: "#5B8FB9" },
  B_distance: { emoji: "📐", accentColor: "#5B8FB9" },
  B_sexAppeal: { emoji: "🌫️", accentColor: "#5B8FB9" },

  // C: オレンジ系（警告）
  C_cleanliness: { emoji: "🪞", accentColor: "#C47A3B" },
  C_conversation: { emoji: "🙉", accentColor: "#C47A3B" },
  C_money: { emoji: "🪙", accentColor: "#C47A3B" },
  C_distance: { emoji: "🚨", accentColor: "#C47A3B" },
  C_sexAppeal: { emoji: "🍂", accentColor: "#C47A3B" },

  // D: レッド系（危機）
  D_cleanliness: { emoji: "🚫", accentColor: "#A04040" },
  D_conversation: { emoji: "🔇", accentColor: "#A04040" },
  D_money: { emoji: "📉", accentColor: "#A04040" },
  D_distance: { emoji: "🚷", accentColor: "#A04040" },
  D_sexAppeal: { emoji: "👻", accentColor: "#A04040" },
};

export function getOgTypeData(
  grade: string,
  weakestFactor?: string
): OgTypeData {
  if (grade === "S" || grade === "A") {
    return OG_TYPE_MAP[grade] || OG_TYPE_MAP["S"];
  }
  const key = `${grade}_${weakestFactor}`;
  return OG_TYPE_MAP[key] || { emoji: "📊", accentColor: "#C9A962" };
}
