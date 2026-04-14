export interface Stock {
  symbol: string;
  sector: string;
  allocation: number;
  returnPct: number;
  returnPerDay: number;
  daysTracked: number;
}

export const stocks: Stock[] = [
  { symbol: "MAZDOCK", sector: "Industrials", allocation: 11.95, returnPct: 7.34, returnPerDay: 0.29, daysTracked: 25 },
  { symbol: "GRSE", sector: "Industrials", allocation: 5.8, returnPct: 10.57, returnPerDay: 0.42, daysTracked: 25 },
  { symbol: "KIRLOSBROS", sector: "Industrials", allocation: 5.3, returnPct: 12.54, returnPerDay: 0.50, daysTracked: 25 },
  { symbol: "PRAJIND", sector: "Industrials", allocation: 5.19, returnPct: 8.88, returnPerDay: 0.35, daysTracked: 25 },
  { symbol: "KAJARIACER", sector: "Industrials", allocation: 4.8, returnPct: 18.03, returnPerDay: 0.72, daysTracked: 25 },
  { symbol: "TDPOWERS", sector: "Industrials", allocation: 4.2, returnPct: -11.42, returnPerDay: -0.46, daysTracked: 25 },
  { symbol: "NAVA", sector: "Industrials", allocation: 5.12, returnPct: 9.93, returnPerDay: 0.39, daysTracked: 25 },
  { symbol: "ABBOTINDIA", sector: "Healthcare", allocation: 5.5, returnPct: -3.70, returnPerDay: -0.15, daysTracked: 25 },
  { symbol: "DIVISLAB", sector: "Healthcare", allocation: 5.02, returnPct: -0.49, returnPerDay: -0.02, daysTracked: 25 },
  { symbol: "YATHARTH", sector: "Healthcare", allocation: 5.27, returnPct: 17.64, returnPerDay: 0.70, daysTracked: 25 },
  { symbol: "GRANULES", sector: "Healthcare", allocation: 4.86, returnPct: 7.01, returnPerDay: 0.28, daysTracked: 25 },
  { symbol: "SUNPHARMA", sector: "Healthcare", allocation: 3.8, returnPct: -14.23, returnPerDay: -0.57, daysTracked: 25 },
  { symbol: "CENTRUM", sector: "Financial Services", allocation: 5.0, returnPct: -2.15, returnPerDay: -0.09, daysTracked: 25 },
  { symbol: "ZYDUSLIFE", sector: "Financial Services", allocation: 4.5, returnPct: -12.87, returnPerDay: -0.51, daysTracked: 25 },
  { symbol: "HDFCBANK", sector: "Financial Services", allocation: 4.2, returnPct: -16.34, returnPerDay: -0.65, daysTracked: 25 },
  { symbol: "ICICIBANK", sector: "Financial Services", allocation: 3.9, returnPct: -10.78, returnPerDay: -0.43, daysTracked: 25 },
  { symbol: "LLOYDSME", sector: "Basic Materials", allocation: 10.25, returnPct: 20.63, returnPerDay: 0.82, daysTracked: 25 },
  { symbol: "BODALCHEM", sector: "Basic Materials", allocation: 5.62, returnPct: 22.14, returnPerDay: 0.88, daysTracked: 25 },
  { symbol: "GPIL", sector: "Basic Materials", allocation: 5.4, returnPct: 10.07, returnPerDay: 0.40, daysTracked: 25 },
  { symbol: "STEELCAST", sector: "Basic Materials", allocation: 3.2, returnPct: -18.92, returnPerDay: -0.76, daysTracked: 25 },
  { symbol: "RELIANCE", sector: "Energy", allocation: 5.0, returnPct: -1.23, returnPerDay: -0.05, daysTracked: 25 },
  { symbol: "ONGC", sector: "Energy", allocation: 3.4, returnPct: -13.56, returnPerDay: -0.54, daysTracked: 25 },
];

export const sectors = [...new Set(stocks.map((s) => s.sector))];

export function getPerformanceLabel(returnPct: number): string {
  if (returnPct >= 15) return "Best";
  if (returnPct >= 8) return "Good";
  if (returnPct >= 0) return "Average";
  return "Bad";
}

export function getAtRiskStocks(): Stock[] {
  return stocks.filter((s) => s.returnPct < -10).sort((a, b) => a.returnPct - b.returnPct);
}

export function getRiskLevel(returnPct: number): "Critical" | "High" | "Moderate" {
  if (returnPct < -15) return "Critical";
  if (returnPct < -12) return "High";
  return "Moderate";
}
