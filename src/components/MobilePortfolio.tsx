import { useState } from "react";
import { TrendingUp, TrendingDown, Eye, EyeOff, Settings, MoreVertical, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { stocks, calculatePerformanceMetrics, getMonthsFromSuggestion } from "../data/stocks";

type Tab = "overview" | "holdings" | "performance";

export default function MobilePortfolio() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showBalance, setShowBalance] = useState(true);
  const [expandedHolding, setExpandedHolding] = useState<string | null>(null);

  const totalInvested = stocks.reduce((sum, stock) => sum + stock.investmentPrice * (stock.allocation / 100), 0);
  const totalCurrent = stocks.reduce((sum, stock) => sum + stock.currentPrice * (stock.allocation / 100), 0);
  const totalReturn = totalCurrent - totalInvested;
  const totalReturnPct = (totalReturn / totalInvested) * 100;

  const topGainers = [...stocks]
    .sort((a, b) => {
      const metricsA = calculatePerformanceMetrics(a);
      const metricsB = calculatePerformanceMetrics(b);
      return metricsB.yoy - metricsA.yoy;
    })
    .slice(0, 5);

  const topLosers = [...stocks]
    .sort((a, b) => {
      const metricsA = calculatePerformanceMetrics(a);
      const metricsB = calculatePerformanceMetrics(b);
      return metricsA.yoy - metricsB.yoy;
    })
    .slice(0, 5);

  const byAllocation = [...stocks].sort((a, b) => b.allocation - a.allocation);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-white">Portfolio</h1>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Portfolio Overview Card */}
      <div className="px-4 pt-4 pb-3">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-6 space-y-4">
          {/* Balance */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-400">Total Value</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                {showBalance ? (
                  <Eye className="w-4 h-4 text-slate-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">
              {showBalance ? `₹${totalCurrent.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "••••••"}
            </div>
          </div>

          {/* Returns */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-xs text-slate-400 mb-1">Invested</div>
              <div className="text-lg font-semibold text-slate-200">
                ₹{totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className={`rounded-lg p-3 border ${totalReturnPct >= 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
              <div className="text-xs text-slate-400 mb-1">Return</div>
              <div className={`text-lg font-semibold flex items-center gap-1 ${totalReturnPct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {totalReturnPct >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {totalReturnPct >= 0 ? "+" : ""}{totalReturnPct.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Value Change */}
          <div className={`flex items-center gap-2 p-2.5 rounded-lg ${totalReturn >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
            {totalReturn >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ArrowDownLeft className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${totalReturn >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {totalReturn >= 0 ? "+" : ""}₹{Math.abs(totalReturn).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[68px] z-10 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-4">
        <div className="flex gap-6">
          {(["overview", "holdings", "performance"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 font-medium text-sm transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-cyan-400 border-cyan-400"
                  : "text-slate-400 border-transparent hover:text-slate-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Top Gainers */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Top Gainers</h3>
              <div className="space-y-2">
                {topGainers.map((stock) => {
                  const metrics = calculatePerformanceMetrics(stock);
                  return (
                    <div key={stock.symbol} className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-white">{stock.symbol}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{stock.sector}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                            <TrendingUp className="w-4 h-4" />
                            +{metrics.yoy.toFixed(1)}%
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">₹{stock.currentPrice}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Losers */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Top Losers</h3>
              <div className="space-y-2">
                {topLosers.map((stock) => {
                  const metrics = calculatePerformanceMetrics(stock);
                  return (
                    <div key={stock.symbol} className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-white">{stock.symbol}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{stock.sector}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-400 font-semibold flex items-center gap-1 justify-end">
                            <TrendingDown className="w-4 h-4" />
                            {metrics.yoy.toFixed(1)}%
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">₹{stock.currentPrice}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Portfolio Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-slate-500 mb-1">Holdings</div>
                <div className="text-2xl font-bold text-white">{stocks.length}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-slate-500 mb-1">Avg Return</div>
                <div className={`text-2xl font-bold ${totalReturnPct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {totalReturnPct >= 0 ? "+" : ""}{(totalReturnPct).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Holdings Tab */}
        {activeTab === "holdings" && (
          <div className="space-y-2">
            {byAllocation.map((stock) => {
              const metrics = calculatePerformanceMetrics(stock);
              const isExpanded = expandedHolding === stock.symbol;
              const holdingValue = stock.currentPrice * (stock.allocation / 100);
              const investedValue = stock.investmentPrice * (stock.allocation / 100);
              const holdingReturn = holdingValue - investedValue;

              return (
                <div key={stock.symbol}>
                  <button
                    onClick={() => setExpandedHolding(isExpanded ? null : stock.symbol)}
                    className="w-full bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">{stock.symbol}</div>
                            <div className="text-xs text-slate-500 mt-1">{stock.allocation.toFixed(1)}% allocation</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">₹{holdingValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                        <div className={`text-sm font-medium ${metrics.yoy >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {metrics.yoy >= 0 ? "+" : ""}{metrics.yoy.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          metrics.yoy >= 0 ? "bg-emerald-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(Math.abs(metrics.yoy) / 2, 100)}%` }}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 mt-2 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 rounded p-2">
                          <div className="text-xs text-slate-500">Entry Price</div>
                          <div className="text-sm font-semibold text-slate-300 mt-1">₹{stock.investmentPrice}</div>
                        </div>
                        <div className="bg-white/5 rounded p-2">
                          <div className="text-xs text-slate-500">Current Price</div>
                          <div className="text-sm font-semibold text-slate-300 mt-1">₹{stock.currentPrice}</div>
                        </div>
                        <div className="bg-white/5 rounded p-2">
                          <div className="text-xs text-slate-500">Invested</div>
                          <div className="text-sm font-semibold text-slate-300 mt-1">₹{investedValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                        </div>
                        <div className={`rounded p-2 ${holdingReturn >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                          <div className="text-xs text-slate-500">P&L</div>
                          <div className={`text-sm font-semibold mt-1 ${holdingReturn >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {holdingReturn >= 0 ? "+" : ""}₹{holdingReturn.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">YoY Return</span>
                          <span className={`font-semibold ${metrics.yoy >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {metrics.yoy >= 0 ? "+" : ""}{metrics.yoy.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">QoQ Return</span>
                          <span className={`font-semibold ${metrics.qoq >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {metrics.qoq >= 0 ? "+" : ""}{metrics.qoq.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">MoM Return</span>
                          <span className={`font-semibold ${metrics.mom >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {metrics.mom >= 0 ? "+" : ""}{metrics.mom.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Suggested</span>
                          <span className="text-slate-400">{stock.suggestedDate} ({getMonthsFromSuggestion(stock)}mo)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20 p-4 space-y-3">
              <h3 className="font-semibold text-white">Performance Metrics</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Portfolio YoY</span>
                  <span className={`text-lg font-bold ${totalReturnPct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {totalReturnPct >= 0 ? "+" : ""}{totalReturnPct.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Best Performer</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    {topGainers[0]?.symbol} (+{calculatePerformanceMetrics(topGainers[0]).yoy.toFixed(1)}%)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Worst Performer</span>
                  <span className="text-sm font-semibold text-red-400">
                    {topLosers[0]?.symbol} ({calculatePerformanceMetrics(topLosers[0]).yoy.toFixed(1)}%)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Most Allocated</span>
                  <span className="text-sm font-semibold text-cyan-400">
                    {byAllocation[0]?.symbol} ({byAllocation[0]?.allocation.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <h3 className="font-semibold text-white mb-3">Sector Allocation</h3>
              <div className="space-y-2">
                {(() => {
                  const sectors: Record<string, number> = {};
                  stocks.forEach((stock) => {
                    sectors[stock.sector] = (sectors[stock.sector] || 0) + stock.allocation;
                  });

                  return Object.entries(sectors)
                    .sort(([, a], [, b]) => b - a)
                    .map(([sector, allocation]) => (
                      <div key={sector}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-slate-400">{sector}</span>
                          <span className="text-sm font-semibold text-slate-300">{allocation.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                            style={{ width: `${allocation}%` }}
                          />
                        </div>
                      </div>
                    ));
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
