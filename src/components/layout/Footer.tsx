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
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-text-muted mb-2">関連診断サイト</p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://jujutsu-shindan.vercel.app"
              target="_blank"
              rel="noopener"
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              呪術廻戦キャラ診断
            </a>
            <a
              href="https://frieren-shindan.vercel.app"
              target="_blank"
              rel="noopener"
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              フリーレン キャラ診断
            </a>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <a
            href="mailto:info@mote-iq.com"
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            info@mote-iq.com
          </a>
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} モテIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
