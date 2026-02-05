import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-accent">モテ</span>IQ
        </Link>
        <span className="text-xs text-text-muted">大人の魅力、数値化します。</span>
      </div>
    </header>
  );
}
