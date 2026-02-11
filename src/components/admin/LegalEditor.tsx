"use client";

import { useState } from "react";
import { Save, Check, AlertCircle, Plus, Trash2, FileText, Eye, Pencil } from "lucide-react";

interface TokushoField {
  label: string;
  value: string;
}

interface LegalEditorProps {
  password: string;
  initialData: {
    legal_tokusho: string;
    legal_privacy: string;
    legal_terms: string;
  };
}

type TabKey = "legal_tokusho" | "legal_privacy" | "legal_terms";

const TAB_LABELS: Record<TabKey, string> = {
  legal_tokusho: "特定商取引法",
  legal_privacy: "プライバシーポリシー",
  legal_terms: "利用規約",
};

export default function LegalEditor({ password, initialData }: LegalEditorProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("legal_tokusho");
  const [contents, setContents] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [showPreview, setShowPreview] = useState(false);

  // 特定商取引法のフィールドをパース
  function parseTokushoFields(): TokushoField[] {
    try {
      const parsed = JSON.parse(contents.legal_tokusho);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // パースに失敗した場合はデフォルト
    }
    return [{ label: "", value: "" }];
  }

  function updateTokushoFields(fields: TokushoField[]) {
    setContents((prev) => ({
      ...prev,
      legal_tokusho: JSON.stringify(fields),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveStatus("idle");

    try {
      const res = await fetch("/api/admin/legal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          key: activeTab,
          content: contents[activeTab],
        }),
      });

      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 5000);
      }
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 5000);
    } finally {
      setSaving(false);
    }
  }

  const tokushoFields = parseTokushoFields();

  // プレビュー描画
  function renderPreview() {
    if (activeTab === "legal_tokusho") {
      return (
        <div className="space-y-4 text-sm">
          {tokushoFields
            .filter((f) => f.label || f.value)
            .map(({ label, value }, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[140px_1fr] gap-4 border-b border-[#E5E5E5] pb-4"
              >
                <span className="text-[#86868B] font-bold">{label}</span>
                <span className="text-[#4A4A4A]">{value}</span>
              </div>
            ))}
        </div>
      );
    }

    // プライバシー / 利用規約
    const content = contents[activeTab];
    const sections = content.split("\n\n").filter(Boolean);
    const isTerms = activeTab === "legal_terms";

    return (
      <div className="space-y-6 text-sm leading-relaxed text-[#4A4A4A]">
        {sections.map((section, idx) => {
          const lines = section.split("\n");
          const firstLine = lines[0];
          const rest = lines.slice(1);
          const isHeader = isTerms
            ? /^第\d+条/.test(firstLine)
            : /^\d+\./.test(firstLine);

          return (
            <section key={idx}>
              {isHeader ? (
                <h2 className="text-base font-bold text-[#1D1D1F] mb-2">
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
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#86868B]" strokeWidth={1.5} />
          <h2 className="text-lg font-semibold text-[#1D1D1F]">法的ページ管理</h2>
        </div>

        {/* 編集/プレビュー切替 */}
        <div className="flex bg-[#F5F5F7] rounded-lg p-1">
          <button
            onClick={() => setShowPreview(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              !showPreview
                ? "bg-white text-[#1D1D1F] shadow-sm"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            編集
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              showPreview
                ? "bg-white text-[#1D1D1F] shadow-sm"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            プレビュー
          </button>
        </div>
      </div>

      {/* タブ */}
      <div className="flex gap-2 mb-8">
        {(Object.entries(TAB_LABELS) as [TabKey, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              setSaveStatus("idle");
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-[#007AFF] text-white"
                : "bg-[#F5F5F7] text-[#86868B] hover:bg-[#E8E8ED]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* コンテンツ部分 */}
      {showPreview ? (
        /* プレビューモード */
        <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 min-h-[300px]">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#E5E5E5]">
            <Eye className="w-4 h-4 text-[#86868B]" />
            <span className="text-xs text-[#86868B] font-medium">
              公開ページと同じレイアウトでプレビュー中
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1D1D1F] mb-8">
            {TAB_LABELS[activeTab]}
            {activeTab === "legal_tokusho" && "に基づく表記"}
          </h1>
          {renderPreview()}
        </div>
      ) : activeTab === "legal_tokusho" ? (
        /* 特定商取引法 — ラベル＋値のテーブル形式 */
        <div className="space-y-3">
          {tokushoFields.map((field, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <input
                type="text"
                value={field.label}
                onChange={(e) => {
                  const updated = [...tokushoFields];
                  updated[idx] = { ...updated[idx], label: e.target.value };
                  updateTokushoFields(updated);
                }}
                placeholder="項目名"
                className="w-40 shrink-0 px-3 py-2.5 bg-[#F5F5F7] rounded-lg text-sm text-[#1D1D1F] placeholder-[#C7C7CC] focus:outline-none focus:ring-2 focus:ring-[#007AFF] font-medium"
              />
              <textarea
                value={field.value}
                onChange={(e) => {
                  const updated = [...tokushoFields];
                  updated[idx] = { ...updated[idx], value: e.target.value };
                  updateTokushoFields(updated);
                }}
                placeholder="内容"
                rows={1}
                className="flex-1 px-3 py-2.5 bg-[#F5F5F7] rounded-lg text-sm text-[#1D1D1F] placeholder-[#C7C7CC] focus:outline-none focus:ring-2 focus:ring-[#007AFF] resize-y"
                style={{ minHeight: "42px" }}
              />
              <button
                onClick={() => {
                  const updated = tokushoFields.filter((_, i) => i !== idx);
                  updateTokushoFields(updated.length > 0 ? updated : [{ label: "", value: "" }]);
                }}
                className="shrink-0 p-2 text-[#FF3B30] hover:bg-[#FEF2F2] rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              updateTokushoFields([...tokushoFields, { label: "", value: "" }]);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#007AFF] hover:bg-[#F0F5FF] rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            項目を追加
          </button>
        </div>
      ) : (
        /* プライバシーポリシー・利用規約 — テキストエリア */
        <textarea
          value={contents[activeTab]}
          onChange={(e) =>
            setContents((prev) => ({ ...prev, [activeTab]: e.target.value }))
          }
          rows={20}
          className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#1D1D1F] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#007AFF] resize-y font-mono"
          placeholder="ここにコンテンツを入力..."
        />
      )}

      {/* フッター：保存ボタン + ステータス */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#F5F5F7]">
        <div className="text-xs text-[#86868B]">
          保存すると即座にサイトに反映されます（ISR: 最大5分の遅延あり）
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || showPreview}
            className="flex items-center gap-2 px-6 py-3 bg-[#007AFF] hover:bg-[#0066CC] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>

      {/* トースト通知 */}
      {saveStatus !== "idle" && (
        <div
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium flex items-center gap-2"
          style={{
            backgroundColor: saveStatus === "success" ? "#F0FDF4" : "#FEF2F2",
            color: saveStatus === "success" ? "#16A34A" : "#DC2626",
            border: `1px solid ${saveStatus === "success" ? "#BBF7D0" : "#FECACA"}`,
            animation: "slideUp 0.3s ease-out",
          }}
        >
          {saveStatus === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {saveStatus === "success"
            ? `${TAB_LABELS[activeTab]}を保存しました`
            : "保存に失敗しました。再度お試しください"}
        </div>
      )}
    </div>
  );
}
