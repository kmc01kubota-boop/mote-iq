import Link from "next/link";

interface LegalPageLayoutProps {
  title: string;
  children: React.ReactNode;
  updatedAt?: string;
}

const LEGAL_NAV = [
  { href: "/legal/terms", label: "利用規約" },
  { href: "/legal/privacy", label: "プライバシーポリシー" },
  { href: "/legal/tokusho", label: "特定商取引法に基づく表記" },
];

export default function LegalPageLayout({
  title,
  children,
  updatedAt,
}: LegalPageLayoutProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* パンくず */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
        <Link href="/" className="hover:text-text-secondary transition-colors">
          ホーム
        </Link>
        <span>/</span>
        <span className="text-text-secondary">{title}</span>
      </nav>

      {/* タイトル */}
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 tracking-tight">
        {title}
      </h1>

      {/* 更新日 */}
      {updatedAt && (
        <p className="text-xs text-text-muted mb-8">
          最終更新日: {new Date(updatedAt).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      {/* 区切り線 */}
      <div className="h-px bg-gradient-to-r from-accent/30 via-accent/10 to-transparent mb-8" />

      {/* コンテンツ */}
      <div className="text-sm sm:text-base leading-relaxed text-text-secondary">
        {children}
      </div>

      {/* 他のページへのナビ */}
      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-xs text-text-muted mb-3 font-medium">関連ページ</p>
        <div className="flex flex-wrap gap-3">
          {LEGAL_NAV.filter((nav) => nav.label !== title).map((nav) => (
            <Link
              key={nav.href}
              href={nav.href}
              className="text-xs text-text-muted hover:text-accent transition-colors px-3 py-1.5 rounded-full border border-border hover:border-accent/30"
            >
              {nav.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
