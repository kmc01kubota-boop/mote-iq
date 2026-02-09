import { NextRequest, NextResponse } from "next/server";

// メモリキャッシュ（Edge Runtimeでも使える）
let cachedStatus: boolean | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30 * 1000; // 30秒

async function checkSiteStatus(): Promise<boolean> {
  const now = Date.now();

  // キャッシュが有効ならそれを返す
  if (cachedStatus !== null && now - cacheTimestamp < CACHE_TTL) {
    return cachedStatus;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return true; // 未設定時は公開
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/site_config?key=eq.site_status&select=value`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) return true;

    const data = await res.json();
    if (data.length > 0 && data[0].value) {
      const isPublished = data[0].value.is_published;
      cachedStatus = isPublished;
      cacheTimestamp = now;
      return isPublished;
    }

    return true;
  } catch {
    return true; // エラー時は公開（安全側）
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 管理画面・API・メンテナンスページ・静的ファイルはスキップ
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPublished = await checkSiteStatus();

  if (!isPublished) {
    // 非公開時はメンテナンスページへリダイレクト
    const maintenanceUrl = new URL("/maintenance", request.url);
    return NextResponse.rewrite(maintenanceUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
