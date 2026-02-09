export async function generateMetadata() {
  return { title: "メンテナンス中｜モテIQ" };
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-4xl sm:text-5xl font-bold tracking-[-0.03em]">
            <span className="text-[#C9A962]">モテ</span>
            <span className="text-white">IQ</span>
          </span>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
          <svg
            className="w-7 h-7 text-[#C9A962]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.193-.14 1.743"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
          ただいまメンテナンス中です
        </h1>
        <p className="text-[#86868b] text-sm sm:text-base leading-relaxed mb-8">
          サービス向上のため、一時的にサイトを停止しています。
          <br />
          しばらくお待ちください。
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-[#2a2a2a] mx-auto mb-6" />

        <p className="text-[#48484a] text-xs">
          © モテIQ
        </p>
      </div>
    </div>
  );
}
