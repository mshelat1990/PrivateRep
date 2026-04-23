import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { useState } from "react";
import { stocks, calculatePerformanceMetrics, getMonthsFromSuggestion } from "../data/stocks";

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];

function getDateColor(value: number): string {
  if (value >= 10) return "bg-emerald-600";
  if (value >= 5) return "bg-emerald-500";
  if (value >= 0) return "bg-emerald-300";
  if (value >= -5) return "bg-orange-300";
  if (value >= -10) return "bg-orange-400";
  return "bg-red-600";
}

function generateHeatmapData() {
  const data: Record<string, Record<number, number>> = {};

  months.forEach((_, monthIndex) => {
    data[months[monthIndex]] = {};
    for (let day = 1; day <= 31; day++) {
      const randomReturn = (Math.random() - 0.3) * 20;
      data[months[monthIndex]][day] = randomReturn;
    }
  });

  return data;
}

export default function PerformanceSummary() {
  const [dateRange, setDateRange] = useState({ start: "2024-01-01", end: "2026-04-22" });
  const [searchTerm, setSearchTerm] = useState("");
  const heatmapData = generateHeatmapData();

  const topPerformers = [...stocks]
    .sort((a, b) => {
      const metricsA = calculatePerformanceMetrics(a);
      const metricsB = calculatePerformanceMetrics(b);
      return metricsB.yoy - metricsA.yoy;
    })
    .slice(0, 10);

  const totalPerformance = stocks.reduce((sum, stock) => {
    const metrics = calculatePerformanceMetrics(stock);
    return sum + metrics.yoy;
  }, 0) / stocks.length;

  const realizedPnL = 45730;
  const netRealizedPnL = 17350;
  const unrealizedPnL = 4120;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">Performance Summary and Selection</h1>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Segment</label>
          <select className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700">
            <option>Equity</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">P&L</label>
          <select className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700">
            <option>Combined</option>
          </select>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <label className="text-sm text-gray-700">Symbol</label>
          <input
            type="text"
            placeholder="eg: INFY"
            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Date range</label>
          <input
            type="text"
            value={`${dateRange.start} — ${dateRange.end}`}
            readOnly
            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 bg-gray-50"
          />
        </div>

        <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Heatmap */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="mb-4 text-xs text-gray-500">2024-01-01 to 2026-04-22</div>
        <div className="grid grid-cols-12 gap-6 mb-2">
          {months.map((month) => (
            <div key={month}>
              <div className="text-xs font-medium text-gray-700 mb-2">{month}</div>
              <div className="grid grid-cols-6 gap-1">
                {Object.values(heatmapData[month] || {}).slice(0, 31).map((value, idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-sm ${getDateColor(value)}`}
                    title={`Day ${idx + 1}: ${value.toFixed(2)}%`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-600 mt-2">No data on Nov 27, 2025</div>
      </div>

      {/* Key Metrics */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <div className="text-3xl font-bold text-emerald-600">{totalPerformance.toFixed(2)}</div>
            <div className="text-sm text-gray-700">Performance</div>
            <div className="text-xs text-gray-500 mt-1">Aug 2025</div>
          </div>
          <div>
            <div className="text-sm text-gray-700 mb-3">peak return %</div>
            <div className="text-2xl font-bold text-gray-900">Equity: 1366.55</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-xs text-gray-600">No of equities</div>
            <div className="text-lg font-bold text-gray-900">{stocks.length}</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded">
            <div className="text-xs text-gray-600">Realised P&L</div>
            <div className="text-lg font-bold text-emerald-600">+₹{(realizedPnL / 1000).toFixed(1)}k</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-xs text-gray-600">Charges & taxes</div>
            <div className="text-lg font-bold text-gray-900">174.85</div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="text-xs text-gray-600">Other credits & debits</div>
            <div className="text-lg font-bold text-orange-600">-208.27</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded">
            <div className="text-xs text-gray-600">Net realised P&L</div>
            <div className="text-lg font-bold text-emerald-600">+₹{(netRealizedPnL / 1000).toFixed(1)}k</div>
          </div>
        </div>

        <div className="mt-4 bg-emerald-50 p-3 rounded">
          <div className="text-xs text-gray-600">Unrealised P&L</div>
          <div className="text-lg font-bold text-emerald-600">+₹{(unrealizedPnL / 1000).toFixed(1)}k</div>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="px-6 py-6 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-gray-600">
            Showing page 1 rows 1 - 13 out of 13 | Last updated: 2026-04-21
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm text-gray-700 outline-none bg-transparent"
              />
            </div>
            <button className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white border-b border-gray-200">
              <tr className="text-left text-xs font-semibold text-gray-700">
                <th className="pb-2 px-2">Symbol</th>
                <th className="pb-2 px-2">Date</th>
                <th className="pb-2 px-2">Close</th>
                <th className="pb-2 px-2">Peak return</th>
                <th className="pb-2 px-2">Current return</th>
                <th className="pb-2 px-2">Top 10 Performers this period</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((stock, idx) => {
                const metrics = calculatePerformanceMetrics(stock);
                const monthsInvested = getMonthsFromSuggestion(stock);
                return (
                  <tr key={stock.symbol} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-900 font-medium">{stock.symbol}</td>
                    <td className="py-2 px-2 text-gray-600">{monthsInvested}</td>
                    <td className="py-2 px-2 text-gray-600">₹{stock.currentPrice}</td>
                    <td className="py-2 px-2 text-gray-600">{metrics.yoy.toFixed(2)}%</td>
                    <td className="py-2 px-2">
                      <span className={`font-medium ${metrics.yoy >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {metrics.yoy >= 0 ? "+" : ""}{metrics.yoy.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <div className="text-gray-700">
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-xs text-gray-500">{metrics.yoy.toFixed(1)}%</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
