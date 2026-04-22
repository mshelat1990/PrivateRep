import { useState } from "react";
import { ChevronRight, ChevronDown, TrendingUp, TrendingDown, Calendar, DollarSign, BarChart2 } from "lucide-react";
import { stocks, calculatePerformanceMetrics, getMonthsFromSuggestion } from "../data/stocks";

type DrillLevel = "yoy" | "qoq" | "mom" | "stock";

interface DrillNode {
  id: string;
  label: string;
  value: number;
  count: number;
  children?: DrillNode[];
  stock?: typeof stocks[0];
}

function buildHierarchy(): DrillNode[] {
  const yoyBuckets: Record<string, typeof stocks[]> = {
    "Above 20%": [],
    "10% - 20%": [],
    "0% - 10%": [],
    "-10% - 0%": [],
    "Below -10%": [],
  };

  stocks.forEach((stock) => {
    const metrics = calculatePerformanceMetrics(stock);
    if (metrics.yoy >= 20) yoyBuckets["Above 20%"].push(stock);
    else if (metrics.yoy >= 10) yoyBuckets["10% - 20%"].push(stock);
    else if (metrics.yoy >= 0) yoyBuckets["0% - 10%"].push(stock);
    else if (metrics.yoy >= -10) yoyBuckets["-10% - 0%"].push(stock);
    else yoyBuckets["Below -10%"].push(stock);
  });

  return Object.entries(yoyBuckets)
    .filter(([_, s]) => s.length > 0)
    .map(([range, rangeStocks]) => {
      const avgYoy = rangeStocks.reduce((sum, s) => sum + calculatePerformanceMetrics(s).yoy, 0) / rangeStocks.length;

      const qoqBuckets: Record<string, typeof stocks[]> = {
        "Above 15%": [],
        "5% - 15%": [],
        "0% - 5%": [],
        "-5% - 0%": [],
        "Below -5%": [],
      };

      rangeStocks.forEach((stock) => {
        const metrics = calculatePerformanceMetrics(stock);
        if (metrics.qoq >= 15) qoqBuckets["Above 15%"].push(stock);
        else if (metrics.qoq >= 5) qoqBuckets["5% - 15%"].push(stock);
        else if (metrics.qoq >= 0) qoqBuckets["0% - 5%"].push(stock);
        else if (metrics.qoq >= -5) qoqBuckets["-5% - 0%"].push(stock);
        else qoqBuckets["Below -5%"].push(stock);
      });

      const qoqChildren = Object.entries(qoqBuckets)
        .filter(([_, s]) => s.length > 0)
        .map(([qoqRange, qoqStocks]) => {
          const avgQoq = qoqStocks.reduce((sum, s) => sum + calculatePerformanceMetrics(s).qoq, 0) / qoqStocks.length;

          const momBuckets: Record<string, typeof stocks[]> = {
            "Above 10%": [],
            "3% - 10%": [],
            "0% - 3%": [],
            "-3% - 0%": [],
            "Below -3%": [],
          };

          qoqStocks.forEach((stock) => {
            const metrics = calculatePerformanceMetrics(stock);
            if (metrics.mom >= 10) momBuckets["Above 10%"].push(stock);
            else if (metrics.mom >= 3) momBuckets["3% - 10%"].push(stock);
            else if (metrics.mom >= 0) momBuckets["0% - 3%"].push(stock);
            else if (metrics.mom >= -3) momBuckets["-3% - 0%"].push(stock);
            else momBuckets["Below -3%"].push(stock);
          });

          const momChildren = Object.entries(momBuckets)
            .filter(([_, s]) => s.length > 0)
            .map(([momRange, momStocks]) => {
              const avgMom = momStocks.reduce((sum, s) => sum + calculatePerformanceMetrics(s).mom, 0) / momStocks.length;

              const stockChildren = momStocks.map((stock) => {
                const metrics = calculatePerformanceMetrics(stock);
                return {
                  id: stock.symbol,
                  label: stock.symbol,
                  value: metrics.yoy,
                  count: 1,
                  stock: stock,
                };
              });

              return {
                id: `${range}-${qoqRange}-${momRange}`,
                label: momRange,
                value: avgMom,
                count: momStocks.length,
                children: stockChildren,
              };
            });

          return {
            id: `${range}-${qoqRange}`,
            label: qoqRange,
            value: avgQoq,
            count: qoqStocks.length,
            children: momChildren,
          };
        });

      return {
        id: range,
        label: range,
        value: avgYoy,
        count: rangeStocks.length,
        children: qoqChildren,
      };
    });
}

function getLevelColor(value: number, level: DrillLevel): string {
  const thresholds = level === "yoy" ? [20, 10, 0, -10] : level === "qoq" ? [15, 5, 0, -5] : level === "mom" ? [10, 3, 0, -3] : [20, 10, 0, -10];

  if (value >= thresholds[0]) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (value >= thresholds[1]) return "text-emerald-500 bg-emerald-500/5 border-emerald-500/10";
  if (value >= thresholds[2]) return "text-sky-400 bg-sky-500/5 border-sky-500/10";
  if (value >= thresholds[3]) return "text-orange-400 bg-orange-500/5 border-orange-500/10";
  return "text-red-400 bg-red-500/10 border-red-500/20";
}

function getLevelBg(value: number, level: DrillLevel): string {
  const thresholds = level === "yoy" ? [20, 10, 0, -10] : level === "qoq" ? [15, 5, 0, -5] : level === "mom" ? [10, 3, 0, -3] : [20, 10, 0, -10];

  if (value >= thresholds[0]) return "bg-emerald-500/10";
  if (value >= thresholds[1]) return "bg-emerald-500/5";
  if (value >= thresholds[2]) return "bg-sky-500/5";
  if (value >= thresholds[3]) return "bg-orange-500/5";
  return "bg-red-500/10";
}

export default function PerformanceDrillDown() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedStock, setSelectedStock] = useState<typeof stocks[0] | null>(null);

  const hierarchy = buildHierarchy();

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const renderNode = (node: DrillNode, level: DrillLevel, depth: number) => {
    const isExpanded = expanded.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isStock = !!node.stock;

    const nextLevel: DrillLevel = level === "yoy" ? "qoq" : level === "qoq" ? "mom" : "stock";

    return (
      <div key={node.id}>
        <button
          onClick={() => {
            if (isStock) {
              setSelectedStock(selectedStock?.symbol === node.id ? null : node.stock!);
            } else if (hasChildren) {
              toggleExpand(node.id);
            }
          }}
          className={`w-full text-left transition-all ${
            isStock
              ? selectedStock?.symbol === node.id
                ? "bg-cyan-500/15 border-l-2 border-cyan-400"
                : "hover:bg-white/5"
              : "hover:bg-white/3"
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px`, paddingRight: "12px" }}
        >
          <div className={`flex items-center justify-between py-2.5 border-b border-white/5 ${isStock ? "" : getLevelBg(node.value, level)}`}>
            <div className="flex items-center gap-2 flex-1">
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )
              ) : isStock ? (
                <div className="w-4 h-4 flex items-center justify-center">
                  {node.value >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                  )}
                </div>
              ) : (
                <div className="w-4" />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${isStock ? "text-white" : "text-slate-200"}`}>
                    {node.label}
                  </span>
                  {!isStock && (
                    <span className="text-xs text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                      {node.count} {node.count === 1 ? "stock" : "stocks"}
                    </span>
                  )}
                </div>
                {isStock && node.stock && (
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{node.stock.sector}</span>
                    <span className="text-slate-600">|</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {node.stock.suggestedDate}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-right">
                <div className={`text-sm font-bold tabular-nums ${getLevelColor(node.value, level).split(" ")[0]}`}>
                  {node.value >= 0 ? "+" : ""}
                  {node.value.toFixed(2)}%
                </div>
                {!isStock && (
                  <div className="text-xs text-slate-500">avg {level.toUpperCase()}</div>
                )}
              </div>
            </div>
          </div>
        </button>

        {isExpanded && hasChildren && (
          <div className="border-l border-white/5 ml-3">
            {node.children!.map((child) => renderNode(child, nextLevel, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-3 pb-2 border-b border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Performance Drill-Down</h3>
          <div className="text-xs text-slate-500">
            YoY → QoQ → MoM → Stock
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            <span>Click to drill down</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart2 className="w-3 h-3" />
            <span>Sorted by return</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5 bg-slate-900/80 sticky top-0 z-10">
          <span>Category / Stock</span>
          <span className="text-right">Return</span>
        </div>

        {hierarchy.map((node) => renderNode(node, "yoy", 0))}
      </div>

      {selectedStock && (
        <div className="border-t border-white/10 bg-slate-800/50 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">{selectedStock.symbol}</h4>
              <button
                onClick={() => setSelectedStock(null)}
                className="text-xs text-slate-400 hover:text-slate-300"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-500 mb-0.5">Entry</div>
                <div className="text-sm font-semibold text-slate-300">₹{selectedStock.investmentPrice}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-500 mb-0.5">Current</div>
                <div className="text-sm font-semibold text-slate-300">₹{selectedStock.currentPrice}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-500 mb-0.5">Period</div>
                <div className="text-sm font-semibold text-slate-300">{getMonthsFromSuggestion(selectedStock)} mo</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-500 mb-0.5">Allocation</div>
                <div className="text-sm font-semibold text-slate-300">{selectedStock.allocation.toFixed(1)}%</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(() => {
                const metrics = calculatePerformanceMetrics(selectedStock);
                return (
                  <>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-xs text-slate-500 mb-0.5">YoY</div>
                      <div className={`text-xs font-bold ${metrics.yoy >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {metrics.yoy >= 0 ? "+" : ""}{metrics.yoy.toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-xs text-slate-500 mb-0.5">QoQ</div>
                      <div className={`text-xs font-bold ${metrics.qoq >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {metrics.qoq >= 0 ? "+" : ""}{metrics.qoq.toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-xs text-slate-500 mb-0.5">MoM</div>
                      <div className={`text-xs font-bold ${metrics.mom >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {metrics.mom >= 0 ? "+" : ""}{metrics.mom.toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-xs text-slate-500 mb-0.5">Daily</div>
                      <div className={`text-xs font-bold ${metrics.daily >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {metrics.daily >= 0 ? "+" : ""}{metrics.daily.toFixed(4)}%
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
