import { AlertTriangle, TrendingDown, Activity, Clock, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { getAtRiskStocks, getRiskLevel } from "../data/stocks";
import { useState } from "react";

const riskConfig = {
  Critical: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    badge: "bg-red-500/20 text-red-300 border border-red-500/40",
    bar: "bg-red-500",
    icon: "text-red-400",
    glow: "shadow-red-500/10",
  },
  High: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-300 border border-orange-500/40",
    bar: "bg-orange-500",
    icon: "text-orange-400",
    glow: "shadow-orange-500/10",
  },
  Moderate: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
    bar: "bg-amber-500",
    icon: "text-amber-400",
    glow: "shadow-amber-500/10",
  },
};

const riskAdvice: Record<string, string> = {
  Critical: "Immediate review recommended. Consider reducing position or setting a stop-loss.",
  High: "Monitor closely. Evaluate exit strategy and portfolio exposure.",
  Moderate: "Watch for further decline. Review fundamentals before taking action.",
};

const additionalInfo: Record<string, { volume: string; support: string; analyst: string }> = {
  STEELCAST: { volume: "+42% above avg", support: "₹248.50", analyst: "Reduce" },
  HDFCBANK: { volume: "+18% above avg", support: "₹1,512.00", analyst: "Hold" },
  SUNPHARMA: { volume: "+31% above avg", support: "₹1,034.20", analyst: "Reduce" },
  ZYDUSLIFE: { volume: "+27% above avg", support: "₹765.80", analyst: "Hold" },
  ONGC: { volume: "+22% above avg", support: "₹198.40", analyst: "Reduce" },
  TDPOWERS: { volume: "+15% above avg", support: "₹312.60", analyst: "Hold" },
  ICICIBANK: { volume: "+9% above avg", support: "₹1,092.30", analyst: "Hold" },
};

type RiskLevel = "Critical" | "High" | "Moderate" | null;

export default function AtRiskTab() {
  const atRiskStocks = getAtRiskStocks();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<RiskLevel>(null);

  const criticalCount = atRiskStocks.filter((s) => getRiskLevel(s.returnPct) === "Critical").length;
  const highCount = atRiskStocks.filter((s) => getRiskLevel(s.returnPct) === "High").length;
  const moderateCount = atRiskStocks.filter((s) => getRiskLevel(s.returnPct) === "Moderate").length;

  const filteredStocks =
    selectedRiskLevel === null
      ? atRiskStocks
      : atRiskStocks.filter((s) => getRiskLevel(s.returnPct) === selectedRiskLevel);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-3 pb-2 border-b border-white/5 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {filteredStocks.length} Stocks Down &gt;10%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setSelectedRiskLevel(selectedRiskLevel === "Critical" ? null : "Critical")}
            className={`rounded-lg px-3 py-2 text-center transition-all ${
              selectedRiskLevel === "Critical"
                ? "bg-red-500/25 border border-red-500/50 ring-1 ring-red-400/50"
                : "bg-red-500/10 border border-red-500/20 hover:bg-red-500/15"
            }`}
          >
            <div className="text-lg font-bold text-red-400">{criticalCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">Critical</div>
            <div className="text-xs text-slate-600">&lt;-15%</div>
          </button>
          <button
            onClick={() => setSelectedRiskLevel(selectedRiskLevel === "High" ? null : "High")}
            className={`rounded-lg px-3 py-2 text-center transition-all ${
              selectedRiskLevel === "High"
                ? "bg-orange-500/25 border border-orange-500/50 ring-1 ring-orange-400/50"
                : "bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/15"
            }`}
          >
            <div className="text-lg font-bold text-orange-400">{highCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">High Risk</div>
            <div className="text-xs text-slate-600">-12% to -15%</div>
          </button>
          <button
            onClick={() => setSelectedRiskLevel(selectedRiskLevel === "Moderate" ? null : "Moderate")}
            className={`rounded-lg px-3 py-2 text-center transition-all ${
              selectedRiskLevel === "Moderate"
                ? "bg-amber-500/25 border border-amber-500/50 ring-1 ring-amber-400/50"
                : "bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15"
            }`}
          >
            <div className="text-lg font-bold text-amber-400">{moderateCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">Moderate</div>
            <div className="text-xs text-slate-600">-10% to -12%</div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {filteredStocks.map((stock) => {
          const level = getRiskLevel(stock.returnPct);
          const config = riskConfig[level];
          const info = additionalInfo[stock.symbol];
          const isExpanded = expanded === stock.symbol;
          const lossDepth = Math.min(100, Math.abs(stock.returnPct) * 3);

          return (
            <div
              key={stock.symbol}
              className={`transition-all duration-200 ${isExpanded ? config.bg : "hover:bg-white/3"}`}
            >
              <button
                className="w-full text-left px-4 py-3"
                onClick={() => setExpanded(isExpanded ? null : stock.symbol)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-md ${config.bg} border ${config.border}`}>
                      <TrendingDown className={`w-3.5 h-3.5 ${config.icon}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{stock.symbol}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${config.badge}`}>
                          {level}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{stock.sector}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-red-400 tabular-nums">
                        {stock.returnPct.toFixed(2)}%
                      </div>
                      <div className="text-xs text-slate-500">
                        {stock.returnPerDay.toFixed(2)}%/day
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>

                <div className="mt-2.5">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Decline depth</span>
                    <span>{Math.abs(stock.returnPct).toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${config.bar}`}
                      style={{ width: `${lossDepth}%` }}
                    />
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className={`px-4 pb-4 border-t ${config.border} mx-4 pt-3 mt-0`}>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-white/5 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        <Activity className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">Volume</span>
                      </div>
                      <span className="text-xs font-semibold text-orange-300">
                        {info?.volume ?? "N/A"}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        <Shield className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">Support</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-300">
                        {info?.support ?? "N/A"}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">Analyst</span>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          info?.analyst === "Reduce" ? "text-red-300" : "text-amber-300"
                        }`}
                      >
                        {info?.analyst ?? "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 ${config.bg} border ${config.border}`}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${config.icon}`} />
                      <p className="text-xs text-slate-300 leading-relaxed">{riskAdvice[level]}</p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>Allocation: <span className="text-slate-300 font-medium">{stock.allocation.toFixed(2)}%</span></div>
                    <div>Tracked: <span className="text-slate-300 font-medium">{stock.daysTracked} days</span></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
