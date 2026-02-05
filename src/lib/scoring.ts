import { questions } from "@/data/questions";
import { FactorKey, FACTOR_KEYS, Scores, FactorScore } from "@/types";

/**
 * Calculate scores from answers.
 * answers: Record<questionId, selectedOptionIndex (0-3)>
 */
export function calculateScores(answers: Record<number, number>): Scores {
  // Accumulate raw and max per factor
  const factorRaw: Record<FactorKey, number> = {
    cleanliness: 0,
    conversation: 0,
    money: 0,
    distance: 0,
    sexAppeal: 0,
  };
  const factorMax: Record<FactorKey, number> = {
    cleanliness: 0,
    conversation: 0,
    money: 0,
    distance: 0,
    sexAppeal: 0,
  };

  for (const q of questions) {
    const selected = answers[q.id] ?? 0;
    const points = q.reverse ? 3 - selected : selected;
    factorRaw[q.factor] += points * q.weight;
    factorMax[q.factor] += 3 * q.weight;
  }

  const factors = {} as Record<FactorKey, FactorScore>;
  let totalSum = 0;

  for (const key of FACTOR_KEYS) {
    const raw = factorRaw[key];
    const max = factorMax[key];
    const normalized = max > 0 ? Math.round((raw / max) * 100) : 0;
    factors[key] = { raw, max, normalized };
    totalSum += normalized;
  }

  const total = Math.round(totalSum / FACTOR_KEYS.length);
  const grade = getGrade(total);
  const percentile = getPercentile(total);

  return { factors, total, grade, percentile };
}

function getGrade(total: number): string {
  if (total >= 90) return "S";
  if (total >= 75) return "A";
  if (total >= 55) return "B";
  if (total >= 35) return "C";
  return "D";
}

/**
 * Simple percentile approximation (no real distribution data for MVP).
 * Higher score = higher percentile (top X%).
 */
function getPercentile(total: number): number {
  if (total >= 95) return 3;
  if (total >= 90) return 5;
  if (total >= 85) return 10;
  if (total >= 80) return 15;
  if (total >= 75) return 22;
  if (total >= 70) return 30;
  if (total >= 65) return 38;
  if (total >= 60) return 45;
  if (total >= 55) return 52;
  if (total >= 50) return 60;
  if (total >= 45) return 68;
  if (total >= 40) return 75;
  if (total >= 35) return 82;
  if (total >= 30) return 88;
  return 95;
}
