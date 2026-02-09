import { getLegalContent } from "@/lib/legal-content";

export const metadata = { title: "プライバシーポリシー｜モテIQ" };

// ISRで5分ごとに再検証
export const revalidate = 300;

export default async function PrivacyPage() {
  const content = await getLegalContent("legal_privacy");

  // テキストをセクションに分割して表示
  const sections = content.split("\n\n").filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">プライバシーポリシー</h1>
      <div className="prose prose-sm text-text-secondary space-y-6 text-sm leading-relaxed">
        {sections.map((section, idx) => {
          const lines = section.split("\n");
          const firstLine = lines[0];
          const rest = lines.slice(1);

          // 番号で始まる行はセクションヘッダー
          const isHeader = /^\d+\./.test(firstLine);

          return (
            <section key={idx}>
              {isHeader ? (
                <h2 className="text-lg font-bold text-text-primary mb-2">
                  {firstLine}
                </h2>
              ) : (
                <p>{firstLine}</p>
              )}
              {rest.map((line, lineIdx) => {
                if (line.startsWith("・")) {
                  return (
                    <p key={lineIdx} className="pl-4">
                      {line}
                    </p>
                  );
                }
                return line ? <p key={lineIdx}>{line}</p> : null;
              })}
            </section>
          );
        })}
      </div>
    </div>
  );
}
