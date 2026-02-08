import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import { calculateScores } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  // Supabase未設定時
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const { anon_id, answers } = await request.json();

    if (!anon_id || !answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const scores = calculateScores(answers);

    const { data, error } = await supabaseAdmin
      .from("attempts")
      .insert({ anon_id, answers, scores })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        {
          error: "Failed to save",
          details: error.message,
          code: error.code,
          hint: error.hint || null
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (e) {
    console.error("Attempt API error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
