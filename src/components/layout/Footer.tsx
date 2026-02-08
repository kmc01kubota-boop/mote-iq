import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border mt-auto">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <div className="flex flex-wrap gap-4 text-xs text-text-muted">
          <Link
            href="/legal/terms"
            className="hover:text-text-secondary transition-colors"
          >
            利用規約
          </Link>
          <Link
            href="/legal/privacy"
            className="hover:text-text-secondary transition-colors"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/legal/tokusho"
            className="hover:text-text-secondary transition-colors"
          >
            特定商取引法に基づく表記
          </Link>
        </div>
        <p className="text-xs text-text-muted mt-4">
          &copy; {new Date().getFullYear()} モテIQ. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
