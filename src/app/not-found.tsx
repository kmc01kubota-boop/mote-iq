import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-text-muted mb-8">ページが見つかりませんでした。</p>
      <Link
        href="/"
        className="inline-block bg-accent hover:bg-accent-light text-bg-primary font-bold px-8 py-3 rounded transition-colors"
      >
        トップに戻る
      </Link>
    </div>
  );
}
