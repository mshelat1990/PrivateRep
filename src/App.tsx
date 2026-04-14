import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import StockAllocationMap from "./components/StockAllocationMap";
import StockPerformanceTable from "./components/StockPerformanceTable";
import SectorPerformanceTable from "./components/SectorPerformanceTable";
import AtRiskTab from "./components/AtRiskTab";
import { getAtRiskStocks } from "./data/stocks";

type RightTab = "stock" | "sector" | "atrisk";

export default function App() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<RightTab>("stock");
  const atRiskCount = getAtRiskStocks().length;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-7xl h-[92vh] flex flex-col rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/60 bg-slate-900">
        <div className="flex h-full gap-0">
          <div className="flex flex-col flex-1 min-w-0 border-r border-white/8">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-slate-900/80 backdrop-blur-sm">
              <h2 className="text-sm font-semibold text-white tracking-wide">Stocks and Sector Allocation</h2>
              <button className="p-1 rounded-md hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <StockAllocationMap
                selectedSector={selectedSector}
                onSectorSelect={setSelectedSector}
              />
            </div>
          </div>

          <div className="flex flex-col w-[380px] flex-shrink-0 bg-slate-900">
            <div className="px-5 pt-4 pb-0 border-b border-white/8">
              <h2 className="text-sm font-semibold text-white tracking-wide mb-3">Stock Performance</h2>
              <div className="flex gap-1">
                <TabButton
                  label="Stock"
                  active={rightTab === "stock"}
                  onClick={() => setRightTab("stock")}
                />
                <TabButton
                  label="Sector"
                  active={rightTab === "sector"}
                  onClick={() => setRightTab("sector")}
                />
                <button
                  onClick={() => setRightTab("atrisk")}
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all ${
                    rightTab === "atrisk"
                      ? "bg-red-500/15 text-red-300 border-b-2 border-red-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  At Risk
                  <span
                    className={`ml-0.5 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                      rightTab === "atrisk"
                        ? "bg-red-500/30 text-red-300"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {atRiskCount}
                  </span>
                </button>
              </div>
            </div>

            {rightTab !== "atrisk" && (
              <div className="grid grid-cols-3 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5 bg-slate-900/80">
                <span>Stock</span>
                <span className="text-right">Return (%)</span>
                <span className="text-right">Performance</span>
              </div>
            )}

            <div className="flex-1 overflow-hidden">
              {rightTab === "stock" && <StockPerformanceTable />}
              {rightTab === "sector" && <SectorPerformanceTable />}
              {rightTab === "atrisk" && <AtRiskTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all ${
        active
          ? "bg-cyan-500/15 text-cyan-300 border-b-2 border-cyan-400"
          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}
