import { stocks, sectors } from "../data/stocks";

interface Props {
  selectedSector: string | null;
  onSectorSelect: (sector: string | null) => void;
}

export default function StockAllocationMap({ selectedSector, onSectorSelect }: Props) {
  const sectorGroups = sectors.map((sector) => ({
    name: sector,
    stocks: stocks.filter((s) => s.sector === sector),
  }));

  const getStockColor = (returnPct: number) => {
    if (returnPct >= 15) return "bg-emerald-600 hover:bg-emerald-500";
    if (returnPct >= 8) return "bg-emerald-700 hover:bg-emerald-600";
    if (returnPct >= 0) return "bg-emerald-800 hover:bg-emerald-700";
    if (returnPct >= -5) return "bg-red-700 hover:bg-red-600";
    if (returnPct >= -10) return "bg-red-800 hover:bg-red-700";
    return "bg-red-600 hover:bg-red-500 ring-2 ring-red-400 ring-opacity-70";
  };

  const totalAllocation = stocks.reduce((sum, s) => sum + s.allocation, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 grid grid-cols-3 gap-1 p-1 overflow-hidden">
        {sectorGroups.map((group) => (
          <div
            key={group.name}
            className={`flex flex-col rounded-lg overflow-hidden border transition-all cursor-pointer ${
              selectedSector === group.name
                ? "border-cyan-400 shadow-lg shadow-cyan-400/20"
                : "border-white/5 hover:border-white/15"
            }`}
            onClick={() => onSectorSelect(selectedSector === group.name ? null : group.name)}
          >
            <div className="px-2 py-1 bg-white/5 border-b border-white/5">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {group.name}
              </span>
            </div>
            <div className="flex-1 grid gap-0.5 p-0.5" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              {group.stocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className={`relative flex flex-col justify-center items-center p-1 rounded transition-colors ${getStockColor(stock.returnPct)}`}
                  style={{ minHeight: `${Math.max(40, (stock.allocation / totalAllocation) * 600)}px` }}
                >
                  <span className="text-white font-bold text-xs leading-tight text-center">{stock.symbol}</span>
                  <span className="text-white/75 text-xs mt-0.5">
                    {stock.allocation.toFixed(1)}%
                  </span>
                  <span className={`text-xs font-semibold ${stock.returnPct >= 0 ? "text-green-300" : "text-red-200"}`}>
                    {stock.returnPct >= 0 ? "+" : ""}
                    {stock.returnPct.toFixed(2)}%
                  </span>
                  {stock.returnPct < -10 && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 py-2 border-t border-white/5 flex items-center gap-3">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium cursor-pointer transition-colors ${
            selectedSector === null
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => onSectorSelect(null)}
        >
          All Selected
        </span>
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-emerald-600" />
            <span className="text-xs text-slate-400">Positive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-red-600" />
            <span className="text-xs text-slate-400">Negative</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <span className="text-xs text-slate-400">At Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
