export const metadata = { title: "利用規約｜モテIQ" };

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">利用規約</h1>
      <div className="prose prose-sm text-text-secondary space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">第1条（適用）</h2>
          <p>
            本規約は、モテIQ（以下「本サービス」）の利用に関する条件を定めるものです。
            ユーザーは本サービスを利用することにより、本規約に同意したものとみなします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">第2条（サービス内容）</h2>
          <p>
            本サービスは、娯楽目的の自己診断コンテンツを提供するものです。
            診断結果および有料レポートの内容は、医学的・心理学的な診断、カウンセリング、
            または専門的な助言を構成するものではありません。
          </p>
          <p>
            「IQ」という表記は本サービス独自のスコアリング指標であり、
            知能指数（Intelligence Quotient）とは一切関係ありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">第3条（有料コンテンツ）</h2>
          <p>
            有料レポートは買い切り型のコンテンツです。一度のお支払いで該当する診断結果の
            詳細レポートを閲覧できます。サブスクリプション（定期課金）ではありません。
          </p>
          <p>
            デジタルコンテンツの性質上、購入後のコンテンツ閲覧開始後の返金はお受けできません。
            ただし、技術的な理由でコンテンツを閲覧できない場合は個別にご相談ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">第4条（免責事項）</h2>
          <p>
            本サービスの診断結果やレポート内容に基づいてユーザーが行った行動について、
            運営者は一切の責任を負いません。
          </p>
          <p>
            本サービスは、年齢差のある関係や金銭が関わる関係において
            違法行為を助長する意図は一切ありません。
            すべてのコミュニケーションにおいて、相手の意思を尊重し、
            健全で安全な距離感を保つことを推奨します。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">第5条（禁止事項）</h2>
          <p>ユーザーは以下の行為を行ってはなりません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>本サービスの不正利用またはシステムへの攻撃</li>
            <li>診断結果を利用した他者への誹謗中傷</li>
            <li>コンテンツの無断転載・再配布</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">第6条（規約の変更）</h2>
          <p>
            運営者は必要に応じて本規約を変更できるものとします。
            変更後の規約は本ページに掲載した時点で効力を生じます。
          </p>
        </section>

        <p className="text-text-muted">最終更新日：2025年1月1日</p>
      </div>
    </div>
  );
}
