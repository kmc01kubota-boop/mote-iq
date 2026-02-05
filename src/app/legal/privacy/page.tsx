export const metadata = { title: "プライバシーポリシー｜モテIQ" };

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">プライバシーポリシー</h1>
      <div className="prose prose-sm text-text-secondary space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">1. 収集する情報</h2>
          <p>本サービスでは以下の情報を収集します。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>匿名識別子（anon_id）</strong>：ブラウザのlocalStorageに生成される
              ランダムなIDです。氏名、メールアドレス等の個人情報は収集しません。
            </li>
            <li>
              <strong>診断回答データ</strong>：30問の選択回答とスコア計算結果を保存します。
            </li>
            <li>
              <strong>決済情報</strong>：Stripe経由で処理されます。クレジットカード情報は
              本サービスのサーバーには保存されません。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">2. 情報の利用目的</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>診断結果の表示およびレポートの提供</li>
            <li>購入状態の管理</li>
            <li>サービスの改善（統計データとしての利用）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">3. 第三者への提供</h2>
          <p>
            収集した情報は、法令に基づく場合を除き、第三者に提供しません。
            ただし、以下のサービスを利用しています。
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Supabase</strong>：データベースおよびバックエンドサービスとして利用
            </li>
            <li>
              <strong>Stripe</strong>：決済処理として利用
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">4. Cookieについて</h2>
          <p>
            本サービスではCookieは使用していません。
            ユーザー識別にはlocalStorageを使用しています。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">5. データの保持期間</h2>
          <p>
            診断データは無期限に保持されますが、ユーザーからの削除依頼があった場合は
            速やかに対応します。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">6. お問い合わせ</h2>
          <p>
            プライバシーに関するお問い合わせは、特定商取引法に基づく表記に記載の
            連絡先までお願いいたします。
          </p>
        </section>

        <p className="text-text-muted">最終更新日：2025年1月1日</p>
      </div>
    </div>
  );
}
