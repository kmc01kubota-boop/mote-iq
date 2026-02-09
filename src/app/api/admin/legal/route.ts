import { NextRequest, NextResponse } from "next/server";
import { getAllLegalContent, setLegalContent, LegalPageKey } from "@/lib/legal-content";

const VALID_KEYS: LegalPageKey[] = ["legal_tokusho", "legal_privacy", "legal_terms"];

export async function GET(request: NextRequest) {
  const password = request.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getAllLegalContent();
  return NextResponse.json(content);
}

export async function POST(request: NextRequest) {
  const password = request.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key, content } = await request.json();

    if (!VALID_KEYS.includes(key)) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }

    if (typeof content !== "string") {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const success = await setLegalContent(key, content);

    if (!success) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ success: true, key });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
