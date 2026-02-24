// UTMパラメータ追跡
// 広告経由ユーザーのソース・キャンペーンを記録

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid", // Google Ads Click ID
  "fbclid", // Facebook Click ID
] as const;

type UTMParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "moteiq_utm";

/** URLからUTMパラメータを抽出して保存（初回訪問時のみ） */
export function captureUTM(): void {
  if (typeof window === "undefined") return;

  // すでに保存済みならスキップ（ファーストタッチ優先）
  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) return;

  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};
  let hasAny = false;

  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) {
      utm[key] = val;
      hasAny = true;
    }
  }

  if (hasAny) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  }
}

/** 保存済みUTMパラメータを取得 */
export function getUTM(): UTMParams {
  if (typeof window === "undefined") return {};
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/** UTMパラメータをAPI送信用に取得 */
export function getUTMForAPI(): Record<string, string> {
  const utm = getUTM();
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(utm)) {
    if (v) result[k] = v;
  }
  return result;
}
