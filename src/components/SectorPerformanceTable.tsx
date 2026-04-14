import { stocks, sectors } from "../data/stocks";
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";

export default function SectorPerformanceTable() {
  const sectorData = sectors.map((sector) => {
    const sectorStocks = stocks.filter((s) => s.sector === sector);
    const avgReturn = sectorStocks.reduce((sum, s) => sum + s.returnPct, 0) / sectorStocks.length;
    const totalAllocation = sectorStocks.reduce((sum, s) => sum + s.allocation, 0);
    const atRiskCount = sectorStocks.filter((s) => s.returnPct < -10).length;
    return { sector, avgReturn, totalAllocation, stockCount: sectorStocks.length, atRiskCount };
  }).sort((a, b) => b.avgReturn - a.avgReturn);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="grid grid-cols-3 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
        <span>Sector</span>
        <span className="text-right">Avg Return</span>
        <span className="text-right">Allocation</span>
      </div>
      {sectorData.map((item) => (
        <div
          key={item.sector}
          className="grid grid-cols-3 items-center px-4 py-3 border-b border-white/5 hover:bg-white/3 transition-colors"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="text-sm font-semibold text-white">{item.sector}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 pl-4.5">
              {item.stockCount} stocks
              {item.atRiskCount > 0 && (
                <span className="ml-1.5 text-red-400">&bull; {item.atRiskCount} at risk</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-sm font-bold tabular-nums ${
                item.avgReturn >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {item.avgReturn >= 0 ? "+" : ""}
              {item.avgReturn.toFixed(2)}%
            </span>
            <div className="flex items-center justify-end gap-0.5 mt-0.5">
              {item.avgReturn >= 0 ? (
                <TrendingUp className="w-3 h-3 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className="text-xs text-slate-500">avg</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-slate-300">{item.totalAllocation.toFixed(1)}%</span>
            <div className="w-full mt-1.5 bg-white/5 rounded-full h-1">
              <div
                className={`h-1 rounded-full ${item.avgReturn >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(100, item.totalAllocation * 2)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
