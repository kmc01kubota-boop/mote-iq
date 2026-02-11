import { getLegalContentWithMeta, DEFAULT_LEGAL_CONTENT } from "@/lib/legal-content";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata = { title: "特定商取引法に基づく表記｜モテIQ" };

// ISRで5分ごとに再検証
export const revalidate = 300;

interface TokushoField {
  label: string;
  value: string;
}

export default async function TokushoPage() {
  const { content, updatedAt } = await getLegalContentWithMeta("legal_tokusho");

  let fields: TokushoField[];
  try {
    const parsed = JSON.parse(content);
    fields = Array.isArray(parsed) ? parsed : JSON.parse(DEFAULT_LEGAL_CONTENT.legal_tokusho);
  } catch {
    fields = JSON.parse(DEFAULT_LEGAL_CONTENT.legal_tokusho);
  }

  return (
    <LegalPageLayout title="特定商取引法に基づく表記" updatedAt={updatedAt ?? undefined}>
      <div className="space-y-0">
        {fields.map(({ label, value }: TokushoField) => (
          <div
            key={label}
            className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-4 border-b border-border py-4 first:pt-0"
          >
            <span className="text-text-muted font-bold text-sm">{label}</span>
            <span className="text-text-secondary text-sm">{value}</span>
          </div>
        ))}
      </div>
    </LegalPageLayout>
  );
}
