import { getLegalContentWithMeta } from "@/lib/legal-content";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata = { title: "プライバシーポリシー｜モテIQ" };

// ISRで5分ごとに再検証
export const revalidate = 300;

export default async function PrivacyPage() {
  const { content, updatedAt } = await getLegalContentWithMeta("legal_privacy");
  const sections = content.split("\n\n").filter(Boolean);

  return (
    <LegalPageLayout title="プライバシーポリシー" updatedAt={updatedAt ?? undefined}>
      <div className="space-y-6">
        {sections.map((section, idx) => {
          const lines = section.split("\n");
          const firstLine = lines[0];
          const rest = lines.slice(1);
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
                    <p key={lineIdx} className="pl-4">{line}</p>
                  );
                }
                return line ? <p key={lineIdx}>{line}</p> : null;
              })}
            </section>
          );
        })}
      </div>
    </LegalPageLayout>
  );
}
