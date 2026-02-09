import { getLegalContent, DEFAULT_LEGAL_CONTENT } from "@/lib/legal-content";

export const metadata = { title: "特定商取引法に基づく表記｜モテIQ" };

// ISRで5分ごとに再検証
export const revalidate = 300;

interface TokushoField {
  label: string;
  value: string;
}

export default async function TokushoPage() {
  const content = await getLegalContent("legal_tokusho");

  let fields: TokushoField[];
  try {
    const parsed = JSON.parse(content);
    fields = Array.isArray(parsed) ? parsed : JSON.parse(DEFAULT_LEGAL_CONTENT.legal_tokusho);
  } catch {
    fields = JSON.parse(DEFAULT_LEGAL_CONTENT.legal_tokusho);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">特定商取引法に基づく表記</h1>
      <div className="space-y-4 text-sm">
        {fields.map(({ label, value }: TokushoField) => (
          <div
            key={label}
            className="grid grid-cols-[140px_1fr] gap-4 border-b border-border pb-4"
          >
            <span className="text-text-muted font-bold">{label}</span>
            <span className="text-text-secondary">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
