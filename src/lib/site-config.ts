import { supabase, isSupabaseConfigured } from "./supabase";
import { supabaseAdmin, isSupabaseAdminConfigured } from "./supabase";

// メモリキャッシュ（30秒TTL）
let cachedStatus: boolean | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30 * 1000; // 30秒

/**
 * サイト公開状態を取得（キャッシュ付き）
 */
export async function isSitePublished(): Promise<boolean> {
  const now = Date.now();

  // キャッシュが有効ならそれを返す
  if (cachedStatus !== null && now - cacheTimestamp < CACHE_TTL) {
    return cachedStatus;
  }

  if (!isSupabaseConfigured() || !supabase) {
    return true; // DB未設定時は公開状態
  }

  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "site_status")
      .single();

    if (error || !data) {
      return true; // エラー時は公開状態（安全側）
    }

    const isPublished = (data.value as { is_published: boolean }).is_published;
    cachedStatus = isPublished;
    cacheTimestamp = now;
    return isPublished;
  } catch {
    return true;
  }
}

/**
 * サイト公開状態を更新（管理者用）
 */
export async function setSitePublished(isPublished: boolean): Promise<boolean> {
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return false;
  }

  try {
    const { error } = await supabaseAdmin
      .from("site_config")
      .update({
        value: { is_published: isPublished },
        updated_at: new Date().toISOString(),
      })
      .eq("key", "site_status");

    if (error) {
      console.error("Failed to update site status:", error);
      return false;
    }

    // キャッシュを即時更新
    cachedStatus = isPublished;
    cacheTimestamp = Date.now();
    return true;
  } catch {
    return false;
  }
}

/**
 * キャッシュをクリア（トグル後の即時反映用）
 */
export function clearSiteConfigCache(): void {
  cachedStatus = null;
  cacheTimestamp = 0;
}
