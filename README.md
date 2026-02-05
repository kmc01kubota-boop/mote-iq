# モテIQ - 大人の魅力診断サイト

30問の診断で5つの因子からモテ力を数値化する、買い切り型の診断サイト。

## 技術スタック

- **Next.js 15** (App Router)
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL)
- **Stripe** (Checkout / 買い切り決済)

## セットアップ手順

### 1. 依存パッケージのインストール

```bash
cd mote-iq
npm install
```

### 2. 環境変数の設定

```bash
cp .env.local.example .env.local
```

`.env.local` を開き、以下を設定:

| 変数名 | 取得先 |
|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase ダッシュボード > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 同上 |
| `SUPABASE_SERVICE_ROLE_KEY` | 同上（service_role key） |
| `STRIPE_SECRET_KEY` | Stripe ダッシュボード > API Keys (sk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI or Dashboard (whsec_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe ダッシュボード > API Keys (pk_test_...) |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000`（本番では実URL） |

### 3. Supabase データベース設定

Supabase SQL Editor で `supabase/schema.sql` を実行:

```sql
-- supabase/schema.sql の内容をコピー＆ペーストして実行
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 にアクセス。

### 5. Stripe Webhook のテスト（ローカル）

```bash
# Stripe CLI をインストール済みの場合
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

表示される `whsec_...` を `.env.local` の `STRIPE_WEBHOOK_SECRET` に設定。

## ページ構成

| パス | 概要 |
|------|------|
| `/` | LP（診断開始） |
| `/quiz` | 30問の診断フォーム |
| `/result/[attemptId]` | 結果表示（無料） |
| `/report/[attemptId]` | 詳細レポート（有料） |
| `/legal/terms` | 利用規約 |
| `/legal/privacy` | プライバシーポリシー |
| `/legal/tokusho` | 特商法表記 |

## 5つの診断因子

1. 清潔感・生活感コントロール
2. 会話の余白力
3. 金と余裕の見せ方
4. 距離感と安心感
5. 大人の色気

## ユーザーフロー

1. LP で「無料で診断する」をクリック
2. 30問に回答（5問ずつページング）
3. 結果ページでスコア・レーダーチャート表示
4. 「レポートを購入する」→ Stripe Checkout (¥1,980)
5. 支払い完了 → 詳細レポート閲覧

## 質問データの差し替え

`src/data/questions.ts` を編集。各質問のフォーマット:

```ts
{
  id: number,        // 一意のID
  text: string,      // 質問文
  factor: FactorKey, // 所属因子
  weight: 1 | 2 | 3, // 重み
  reverse: boolean,  // 逆転項目か
  options: [string, string, string, string] // 4択（0→3点）
}
```

## 本番デプロイ

- Vercel にデプロイ推奨
- 環境変数をすべて Vercel のプロジェクト設定に追加
- `NEXT_PUBLIC_BASE_URL` を本番URLに変更
- Stripe Dashboard で本番用 Webhook エンドポイントを設定
- `legal/tokusho` の【】内を実際の事業者情報に差し替え
