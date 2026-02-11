import { supabase, isSupabaseConfigured } from "./supabase";
import { supabaseAdmin, isSupabaseAdminConfigured } from "./supabase";

// 法的ページのキー
export type LegalPageKey = "legal_tokusho" | "legal_privacy" | "legal_terms";

// 特定商取引法のフィールド型
export interface TokushoField {
  label: string;
  value: string;
}

// 法的ページのコンテンツ型
export interface LegalContent {
  key: LegalPageKey;
  title: string;
  content: string; // マークダウン的なプレーンテキスト
  updated_at: string;
}

// デフォルトコンテンツ（DBに未保存の場合に使用）
export const DEFAULT_LEGAL_CONTENT: Record<LegalPageKey, string> = {
  legal_tokusho: JSON.stringify([
    { label: "販売事業者", value: "【事業者名を記載】" },
    { label: "運営責任者", value: "【責任者名を記載】" },
    { label: "所在地", value: "【住所を記載】" },
    { label: "電話番号", value: "【電話番号を記載】" },
    { label: "メールアドレス", value: "info@mote-iq.com" },
    { label: "販売URL", value: "https://mote-iq.com" },
    { label: "販売価格", value: "550円（税込）" },
    { label: "商品内容", value: "モテIQ 詳細レポート（デジタルコンテンツ）" },
    { label: "商品の引渡し時期", value: "決済完了後、即時にウェブ上で閲覧可能" },
    { label: "支払い方法", value: "クレジットカード（Stripe経由）" },
    { label: "支払い時期", value: "ご注文時に即時決済" },
    { label: "返品・返金ポリシー", value: "デジタルコンテンツの性質上、コンテンツ閲覧開始後の返金はお受けできません。技術的な理由で閲覧できない場合はお問い合わせください。" },
    { label: "追加費用", value: "表示価格以外の費用は発生しません（通信料等はお客様負担）。サブスクリプション（定期課金）ではありません。" },
    { label: "動作環境", value: "最新版のChrome, Safari, Firefox, Edge。JavaScript有効。インターネット接続環境が必要です。" },
  ]),
  legal_privacy: `1. 収集する情報
本サービスでは以下の情報を収集します。
・匿名識別子（anon_id）：ブラウザのlocalStorageに生成されるランダムなIDです。氏名、メールアドレス等の個人情報は収集しません。
・診断回答データ：25問の選択回答とスコア計算結果を保存します。
・決済情報：Stripe経由で処理されます。クレジットカード情報は本サービスのサーバーには保存されません。

2. 情報の利用目的
・診断結果の表示およびレポートの提供
・購入状態の管理
・サービスの改善（統計データとしての利用）

3. 第三者への提供
収集した情報は、法令に基づく場合を除き、第三者に提供しません。ただし、以下のサービスを利用しています。
・Supabase：データベースおよびバックエンドサービスとして利用
・Stripe：決済処理として利用

4. Cookieについて
本サービスではCookieは使用していません。ユーザー識別にはlocalStorageを使用しています。

5. データの保持期間
診断データは無期限に保持されますが、ユーザーからの削除依頼があった場合は速やかに対応します。

6. お問い合わせ
プライバシーに関するお問い合わせは、特定商取引法に基づく表記に記載の連絡先までお願いいたします。`,
  legal_terms: `第1条（適用）
本規約は、モテIQ（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本サービスを利用することにより、本規約に同意したものとみなします。

第2条（サービス内容）
本サービスは、娯楽目的の自己診断コンテンツを提供するものです。診断結果および有料レポートの内容は、医学的・心理学的な診断、カウンセリング、または専門的な助言を構成するものではありません。
「IQ」という表記は本サービス独自のスコアリング指標であり、知能指数（Intelligence Quotient）とは一切関係ありません。

第3条（有料コンテンツ）
有料レポートは買い切り型のコンテンツです。一度のお支払いで該当する診断結果の詳細レポートを閲覧できます。サブスクリプション（定期課金）ではありません。
デジタルコンテンツの性質上、購入後のコンテンツ閲覧開始後の返金はお受けできません。ただし、技術的な理由でコンテンツを閲覧できない場合は個別にご相談ください。

第4条（免責事項）
本サービスの診断結果やレポート内容に基づいてユーザーが行った行動について、運営者は一切の責任を負いません。
本サービスは、年齢差のある関係や金銭が関わる関係において違法行為を助長する意図は一切ありません。すべてのコミュニケーションにおいて、相手の意思を尊重し、健全で安全な距離感を保つことを推奨します。

第5条（禁止事項）
ユーザーは以下の行為を行ってはなりません。
・本サービスの不正利用またはシステムへの攻撃
・診断結果を利用した他者への誹謗中傷
・コンテンツの無断転載・再配布

第6条（規約の変更）
運営者は必要に応じて本規約を変更できるものとします。変更後の規約は本ページに掲載した時点で効力を生じます。`,
};

/**
 * 法的ページのコンテンツを取得
 */
export async function getLegalContent(key: LegalPageKey): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    return DEFAULT_LEGAL_CONTENT[key];
  }

  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) {
      return DEFAULT_LEGAL_CONTENT[key];
    }

    return (data.value as { content: string }).content || DEFAULT_LEGAL_CONTENT[key];
  } catch {
    return DEFAULT_LEGAL_CONTENT[key];
  }
}

/**
 * 法的ページのコンテンツと更新日時を取得
 */
export async function getLegalContentWithMeta(
  key: LegalPageKey
): Promise<{ content: string; updatedAt: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { content: DEFAULT_LEGAL_CONTENT[key], updatedAt: null };
  }

  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("value, updated_at")
      .eq("key", key)
      .single();

    if (error || !data) {
      return { content: DEFAULT_LEGAL_CONTENT[key], updatedAt: null };
    }

    const content =
      (data.value as { content: string }).content || DEFAULT_LEGAL_CONTENT[key];
    return { content, updatedAt: data.updated_at || null };
  } catch {
    return { content: DEFAULT_LEGAL_CONTENT[key], updatedAt: null };
  }
}

/**
 * 法的ページのコンテンツを更新（管理者用）
 */
export async function setLegalContent(key: LegalPageKey, content: string): Promise<boolean> {
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return false;
  }

  try {
    const { error } = await supabaseAdmin
      .from("site_config")
      .upsert(
        {
          key,
          value: { content },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (error) {
      console.error(`Failed to update legal content (${key}):`, error);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * 全法的ページのコンテンツを取得（管理画面用）
 */
export async function getAllLegalContent(): Promise<Record<LegalPageKey, string>> {
  if (!isSupabaseConfigured() || !supabase) {
    return { ...DEFAULT_LEGAL_CONTENT };
  }

  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("key, value")
      .in("key", ["legal_tokusho", "legal_privacy", "legal_terms"]);

    const result = { ...DEFAULT_LEGAL_CONTENT };

    if (!error && data) {
      for (const row of data) {
        const k = row.key as LegalPageKey;
        const val = row.value as { content: string };
        if (val.content) {
          result[k] = val.content;
        }
      }
    }

    return result;
  } catch {
    return { ...DEFAULT_LEGAL_CONTENT };
  }
}
