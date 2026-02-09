import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-bg-primary border-b border-border">
      <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          <span className="text-accent">モテ</span>
          <span className="text-text-primary">IQ</span>
        </Link>
        <span className="text-sm font-semibold tracking-tight text-[#1d1d1f] hidden sm:block">
          大人の魅力、数値化します。
        </span>
      </div>
    </header>
  );
}
