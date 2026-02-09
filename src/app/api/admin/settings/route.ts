import { NextRequest, NextResponse } from "next/server";
import { isSitePublished, setSitePublished, clearSiteConfigCache } from "@/lib/site-config";

export async function GET(request: NextRequest) {
  // 認証チェック
  const password = request.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isPublished = await isSitePublished();
  return NextResponse.json({ is_published: isPublished });
}

export async function POST(request: NextRequest) {
  // 認証チェック
  const password = request.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { is_published } = await request.json();

    if (typeof is_published !== "boolean") {
      return NextResponse.json({ error: "Invalid value" }, { status: 400 });
    }

    // キャッシュをクリアしてから更新
    clearSiteConfigCache();
    const success = await setSitePublished(is_published);

    if (!success) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ is_published });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
