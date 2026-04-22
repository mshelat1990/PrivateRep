import { ChevronRight, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";
import { stocks, calculatePerformanceMetrics, getMonthsFromSuggestion } from "../data/stocks";
import { useState } from "react";

type PerformanceLevel = "yoy" | "qoq" | "mom" | "daily" | null;

const levelLabels: Record<PerformanceLevel, string> = {
  yoy: "Year-on-Year",
  qoq: "Quarter-on-Quarter",
  mom: "Month-on-Month",
  daily: "Daily",
  null: "Annual Returns",
};

const levelHierarchy: PerformanceLevel[] = ["yoy", "qoq", "mom", "daily"];

export default function PerformanceTab() {
  const [selectedLevel, setSelectedLevel] = useState<PerformanceLevel>(null);
  const [expandedStock, setExpandedStock] = useState<string | null>(null);

  const handleDrillDown = (level: PerformanceLevel) => {
    if (selectedLevel === level) {
      setSelectedLevel(null);
    } else {
      setSelectedLevel(level);
    }
    setExpandedStock(null);
  };

  const currentLevelIndex = selectedLevel ? levelHierarchy.indexOf(selectedLevel) : -1;
  const canDrillDown = currentLevelIndex < levelHierarchy.length - 1;
  const nextLevel = canDrillDown && selectedLevel ? levelHierarchy[currentLevelIndex + 1] : null;

  const sortedStocks = [...stocks].sort((a, b) => {
    const metricsA = calculatePerformanceMetrics(a);
    const metricsB = calculatePerformanceMetrics(b);
    const returnA = selectedLevel ? metricsA[selectedLevel] : metricsA.yoy;
    const returnB = selectedLevel ? metricsB[selectedLevel] : metricsB.yoy;
    return returnB - returnA;
  });

  const getReturnValue = (stock: typeof stocks[0]): number => {
    const metrics = calculatePerformanceMetrics(stock);
    return selectedLevel ? metrics[selectedLevel] : metrics.yoy;
  };

  const getReturnColor = (value: number) => {
    if (value >= 15) return "text-emerald-400";
    if (value >= 5) return "text-emerald-500";
    if (value >= 0) return "text-sky-400";
    if (value >= -10) return "text-orange-400";
    return "text-red-400";
  };

  const getBackgroundColor = (value: number) => {
    if (value >= 15) return "bg-emerald-500/10 border-emerald-500/20";
    if (value >= 5) return "bg-emerald-500/5 border-emerald-500/10";
    if (value >= 0) return "bg-sky-500/5 border-sky-500/10";
    if (value >= -10) return "bg-orange-500/5 border-orange-500/10";
    return "bg-red-500/5 border-red-500/10";
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-3 pb-3 border-b border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Performance Hierarchy</h3>
          {selectedLevel && (
            <button
              onClick={() => setSelectedLevel(null)}
              className="text-xs text-slate-400 hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-white/5"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleDrillDown(null)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              selectedLevel === null
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-white/5 text-slate-400 hover:text-slate-300 border border-white/10 hover:bg-white/10"
            }`}
          >
            Annual
          </button>

          {levelHierarchy.map((level) => (
            <div key={level} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <button
                onClick={() => handleDrillDown(level)}
                disabled={!selectedLevel && level !== "yoy"}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  selectedLevel === level
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-white/5 text-slate-400 hover:text-slate-300 border border-white/10 hover:bg-white/10 disabled:hover:bg-white/5 disabled:hover:text-slate-400"
                }`}
              >
                {level.toUpperCase()}
              </button>
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-500 italic">
          {selectedLevel === null && "Click YoY to drill down into quarterly performance"}
          {selectedLevel === "yoy" && "Click QoQ to drill down into monthly performance"}
          {selectedLevel === "qoq" && "Click MoM to drill down into daily performance"}
          {selectedLevel === "mom" && "Click Daily to see granular daily performance"}
          {selectedLevel === "daily" && "This is the most granular level"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {sortedStocks.map((stock) => {
          const returnValue = getReturnValue(stock);
          const isExpanded = expandedStock === stock.symbol;
          const metrics = calculatePerformanceMetrics(stock);
          const monthsSinceInvestment = getMonthsFromSuggestion(stock);
          const totalReturn = ((stock.currentPrice - stock.investmentPrice) / stock.investmentPrice) * 100;

          return (
            <div
              key={stock.symbol}
              className={`border border-white/5 transition-all ${getBackgroundColor(returnValue)}`}
            >
              <button
                onClick={() => setExpandedStock(isExpanded ? null : stock.symbol)}
                className="w-full text-left px-4 py-3 hover:bg-white/2 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {returnValue >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{stock.symbol}</span>
                        <span className="text-xs text-slate-500">{stock.sector}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Suggested {stock.suggestedDate} ({monthsSinceInvestment} months)
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-sm font-bold tabular-nums ${getReturnColor(returnValue)}`}>
                      {returnValue >= 0 ? "+" : ""}
                      {returnValue.toFixed(2)}%
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      ₹{stock.investmentPrice} → ₹{stock.currentPrice}
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-4 gap-2">
                  {["yoy", "qoq", "mom", "daily"].map((level) => {
                    const value = metrics[level as keyof typeof metrics];
                    const isActive = selectedLevel === level;
                    return (
                      <div
                        key={level}
                        className={`text-center p-2 rounded-md transition-all ${
                          isActive ? "bg-cyan-500/20 border border-cyan-500/40" : "bg-white/5 border border-white/10"
                        }`}
                      >
                        <div className="text-xs text-slate-500 uppercase font-semibold">{level}</div>
                        <div className={`text-xs font-bold mt-0.5 ${getReturnColor(value)}`}>
                          {value >= 0 ? "+" : ""}
                          {value.toFixed(2)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-3 border-t border-white/5 space-y-3 bg-white/2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">Entry Price</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-300">₹{stock.investmentPrice}</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">Current Price</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-300">₹{stock.currentPrice}</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">Absolute Return</span>
                      </div>
                      <span className={`text-sm font-semibold ${getReturnColor(totalReturn)}`}>
                        {totalReturn >= 0 ? "+" : ""}
                        {totalReturn.toFixed(2)}%
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">Period</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-300">{monthsSinceInvestment} months</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase mb-2">Performance Breakdown</h4>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">YoY Return</span>
                        <span className={`text-xs font-semibold ${getReturnColor(metrics.yoy)}`}>
                          {metrics.yoy >= 0 ? "+" : ""}
                          {metrics.yoy.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">QoQ Return</span>
                        <span className={`text-xs font-semibold ${getReturnColor(metrics.qoq)}`}>
                          {metrics.qoq >= 0 ? "+" : ""}
                          {metrics.qoq.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">MoM Return</span>
                        <span className={`text-xs font-semibold ${getReturnColor(metrics.mom)}`}>
                          {metrics.mom >= 0 ? "+" : ""}
                          {metrics.mom.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Daily Return</span>
                        <span className={`text-xs font-semibold ${getReturnColor(metrics.daily)}`}>
                          {metrics.daily >= 0 ? "+" : ""}
                          {metrics.daily.toFixed(4)}%
                        </span>
                      </div>
                    </div>
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
