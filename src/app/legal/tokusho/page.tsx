import { PRICING } from "@/lib/pricing";

export const metadata = { title: "特定商取引法に基づく表記｜モテIQ" };

export default function TokushoPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">特定商取引法に基づく表記</h1>
      <div className="space-y-4 text-sm">
        {[
          { label: "販売事業者", value: "【事業者名を記載】" },
          { label: "運営責任者", value: "【責任者名を記載】" },
          { label: "所在地", value: "【住所を記載】" },
          { label: "電話番号", value: "【電話番号を記載（請求があった場合に遅滞なく開示）】" },
          { label: "メールアドレス", value: "【メールアドレスを記載】" },
          { label: "販売URL", value: "【サイトURLを記載】" },
          { label: "販売価格", value: `${PRICING.TOTAL_PRICE.toLocaleString()}円（税込）` },
          { label: "商品内容", value: "モテIQ 詳細レポート（デジタルコンテンツ）" },
          {
            label: "商品の引渡し時期",
            value: "決済完了後、即時にウェブ上で閲覧可能",
          },
          { label: "支払い方法", value: "クレジットカード（Stripe経由）" },
          { label: "支払い時期", value: "ご注文時に即時決済" },
          {
            label: "返品・返金ポリシー",
            value:
              "デジタルコンテンツの性質上、コンテンツ閲覧開始後の返金はお受けできません。技術的な理由で閲覧できない場合はお問い合わせください。",
          },
          {
            label: "追加費用",
            value:
              "表示価格以外の費用は発生しません（通信料等はお客様負担）。サブスクリプション（定期課金）ではありません。",
          },
          {
            label: "動作環境",
            value:
              "最新版のChrome, Safari, Firefox, Edge。JavaScript有効。インターネット接続環境が必要です。",
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="grid grid-cols-[140px_1fr] gap-4 border-b border-border pb-4"
          >
            <span className="text-text-muted font-bold">{label}</span>
            <span className="text-text-secondary">{value}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-muted mt-8">
        ※ 【】内の項目は、実際の事業者情報に差し替えてください。
      </p>
    </div>
  );
}
