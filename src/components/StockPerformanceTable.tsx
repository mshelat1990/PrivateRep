import { stocks, getPerformanceLabel } from "../data/stocks";
import { TrendingUp, TrendingDown } from "lucide-react";

const performanceColors: Record<string, string> = {
  Best: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  Good: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  Average: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  Bad: "bg-red-500/20 text-red-300 border border-red-500/30",
};

export default function StockPerformanceTable() {
  const sorted = [...stocks].sort((a, b) => b.returnPct - a.returnPct);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="grid grid-cols-3 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
        <span>Stock</span>
        <span className="text-right">Return (%)</span>
        <span className="text-right">Performance</span>
      </div>
      {sorted.map((stock) => {
        const label = getPerformanceLabel(stock.returnPct);
        return (
          <div
            key={stock.symbol}
            className="grid grid-cols-3 items-center px-4 py-3 border-b border-white/5 hover:bg-white/3 transition-colors group"
          >
            <div>
              <div className="flex items-center gap-1.5">
                {stock.returnPct >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400 flex-shrink-0" />
                )}
                <span className="text-sm font-semibold text-white">{stock.symbol}</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 pl-4.5">{stock.sector}</div>
              <div className="text-xs text-slate-600 mt-0.5 pl-4.5">in {stock.daysTracked} days</div>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-bold tabular-nums ${
                  stock.returnPct >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {stock.returnPct >= 0 ? "+" : ""}
                {stock.returnPct.toFixed(2)}%
              </span>
              <div className="text-xs text-slate-500 mt-0.5">
                {stock.returnPerDay >= 0 ? "+" : ""}
                {stock.returnPerDay.toFixed(2)}% per day
              </div>
            </div>
            <div className="flex justify-end">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${performanceColors[label]}`}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
