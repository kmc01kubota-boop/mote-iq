import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { calculateScores } from "@/lib/scoring";

export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (e) {
    console.error("Attempt API error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
