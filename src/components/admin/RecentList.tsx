interface Purchase {
  id: string;
  created_at: string;
  attempt_id: string;
  amount: number;
}

interface RecentListProps {
  purchases: Purchase[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentList({ purchases }: RecentListProps) {
  if (purchases.length === 0) {
    return (
      <div className="py-12 text-center text-[#86868B]">
        購入履歴がありません
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {purchases.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-[#F5F5F7] transition-colors"
        >
          <span className="text-[#86868B] text-sm w-28">
            {formatDate(p.created_at)}
          </span>
          <span className="text-[#86868B] font-mono text-xs flex-1 text-center">
            {p.attempt_id.slice(0, 8)}...
          </span>
          <span className="text-[#1D1D1F] font-medium text-right w-20">
            ¥{p.amount.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
