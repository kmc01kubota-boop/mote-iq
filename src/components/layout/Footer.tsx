import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 text-xs text-text-muted">
          <Link href="/legal/terms" className="hover:text-text-secondary transition-colors">
            利用規約
          </Link>
          <Link href="/legal/privacy" className="hover:text-text-secondary transition-colors">
            プライバシーポリシー
          </Link>
          <Link href="/legal/tokusho" className="hover:text-text-secondary transition-colors">
            特定商取引法に基づく表記
          </Link>
        </div>
        <p className="text-xs text-text-muted mt-4">
          本診断は娯楽目的のコンテンツです。医学的・心理学的な診断ではありません。
        </p>
        <p className="text-xs text-text-muted mt-1">
          &copy; {new Date().getFullYear()} モテIQ. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
