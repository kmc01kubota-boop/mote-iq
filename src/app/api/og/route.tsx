import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getOgTypeData } from "@/lib/og-types";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "診断完了";
  const subtitle = searchParams.get("subtitle") || "";
  const score = searchParams.get("score") || "0";
  const grade = searchParams.get("grade") || "B";
  const weakest = searchParams.get("weakest") || "";

  const typeData = getOgTypeData(grade, weakest);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#111111",
          position: "relative",
          overflow: "hidden",
          fontFamily: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", sans-serif',
        }}
      >
        {/* 背景グラデーション */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(ellipse at 20% 50%, ${typeData.accentColor}22 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, ${typeData.accentColor}15 0%, transparent 50%)`,
            display: "flex",
          }}
        />

        {/* 上部アクセントライン */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, transparent, ${typeData.accentColor}, transparent)`,
            display: "flex",
          }}
        />

        {/* コンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: "48px 64px",
            position: "relative",
          }}
        >
          {/* ロゴ */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <span
              style={{
                fontSize: "28px",
                color: typeData.accentColor,
                fontWeight: 700,
                letterSpacing: "4px",
              }}
            >
              モテIQ
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "#888888",
                marginLeft: "16px",
                letterSpacing: "2px",
              }}
            >
              大人の魅力診断
            </span>
          </div>

          {/* スコアとグレード */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              marginBottom: "24px",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontSize: "96px",
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1,
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: "32px",
                color: "#666666",
                fontWeight: 400,
              }}
            >
              / 100
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                border: `2px solid ${typeData.accentColor}`,
                marginLeft: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: 800,
                  color: typeData.accentColor,
                }}
              >
                {grade}
              </span>
            </div>
          </div>

          {/* タイプ名 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "36px" }}>{typeData.emoji}</span>
            <span
              style={{
                fontSize: "42px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "2px",
              }}
            >
              {title}
            </span>
          </div>

          {/* サブタイトル */}
          {subtitle && (
            <span
              style={{
                fontSize: "22px",
                color: typeData.accentColor,
                fontWeight: 500,
                letterSpacing: "1px",
              }}
            >
              {subtitle}
            </span>
          )}
        </div>

        {/* フッター */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 64px",
            borderTop: "1px solid #222222",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              color: "#555555",
            }}
          >
            mote-iq.vercel.app
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "#555555",
            }}
          >
            25問であなたのモテ力を数値化
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
