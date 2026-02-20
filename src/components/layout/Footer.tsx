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
          <p className="text-xs text-text-muted mb-2">公式メディア</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://note.com/mote_iq_official/all"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.904 6.748l-5.652-5.652c-.746-.746-2.051-.697-2.907.159L2.404 13.197a2.252 2.252 0 00-.159 2.907l5.652 5.652c.746.746 2.051.697 2.907-.159L22.745 9.655c.856-.856.905-2.161.159-2.907zM10.856 18.344L5.656 13.144 14.4 4.4l5.2 5.2-8.744 8.744z"/>
              </svg>
              note
            </a>
            <a
              href="https://open.spotify.com/episode/3YOV8VlOOzOtG1rFeL5RWx?si=Rh2M_omSSSu4F3ZJlw0NFQ"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Podcast
            </a>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border">
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
