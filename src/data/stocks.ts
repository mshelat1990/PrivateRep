export interface Stock {
  symbol: string;
  sector: string;
  allocation: number;
  returnPct: number;
  returnPerDay: number;
  daysTracked: number;
  suggestedDate: string;
  investmentPrice: number;
  currentPrice: number;
}

export interface PerformanceMetrics {
  yoy: number;
  qoq: number;
  mom: number;
  daily: number;
}

export const stocks: Stock[] = [
  { symbol: "MAZDOCK", sector: "Industrials", allocation: 11.95, returnPct: 7.34, returnPerDay: 0.29, daysTracked: 25, suggestedDate: "2023-04-15", investmentPrice: 2850, currentPrice: 3059 },
  { symbol: "GRSE", sector: "Industrials", allocation: 5.8, returnPct: 10.57, returnPerDay: 0.42, daysTracked: 25, suggestedDate: "2023-06-20", investmentPrice: 450, currentPrice: 498 },
  { symbol: "KIRLOSBROS", sector: "Industrials", allocation: 5.3, returnPct: 12.54, returnPerDay: 0.50, daysTracked: 25, suggestedDate: "2023-05-10", investmentPrice: 1200, currentPrice: 1351 },
  { symbol: "PRAJIND", sector: "Industrials", allocation: 5.19, returnPct: 8.88, returnPerDay: 0.35, daysTracked: 25, suggestedDate: "2023-07-22", investmentPrice: 380, currentPrice: 413 },
  { symbol: "KAJARIACER", sector: "Industrials", allocation: 4.8, returnPct: 18.03, returnPerDay: 0.72, daysTracked: 25, suggestedDate: "2023-03-08", investmentPrice: 980, currentPrice: 1157 },
  { symbol: "TDPOWERS", sector: "Industrials", allocation: 4.2, returnPct: -11.42, returnPerDay: -0.46, daysTracked: 25, suggestedDate: "2023-08-30", investmentPrice: 365, currentPrice: 323 },
  { symbol: "NAVA", sector: "Industrials", allocation: 5.12, returnPct: 9.93, returnPerDay: 0.39, daysTracked: 25, suggestedDate: "2023-04-25", investmentPrice: 2100, currentPrice: 2309 },
  { symbol: "ABBOTINDIA", sector: "Healthcare", allocation: 5.5, returnPct: -3.70, returnPerDay: -0.15, daysTracked: 25, suggestedDate: "2023-09-12", investmentPrice: 28500, currentPrice: 27445 },
  { symbol: "DIVISLAB", sector: "Healthcare", allocation: 5.02, returnPct: -0.49, returnPerDay: -0.02, daysTracked: 25, suggestedDate: "2023-07-05", investmentPrice: 5200, currentPrice: 5174 },
  { symbol: "YATHARTH", sector: "Healthcare", allocation: 5.27, returnPct: 17.64, returnPerDay: 0.70, daysTracked: 25, suggestedDate: "2023-02-14", investmentPrice: 720, currentPrice: 848 },
  { symbol: "GRANULES", sector: "Healthcare", allocation: 4.86, returnPct: 7.01, returnPerDay: 0.28, daysTracked: 25, suggestedDate: "2023-06-08", investmentPrice: 480, currentPrice: 514 },
  { symbol: "SUNPHARMA", sector: "Healthcare", allocation: 3.8, returnPct: -14.23, returnPerDay: -0.57, daysTracked: 25, suggestedDate: "2023-10-01", investmentPrice: 900, currentPrice: 772 },
  { symbol: "CENTRUM", sector: "Financial Services", allocation: 5.0, returnPct: -2.15, returnPerDay: -0.09, daysTracked: 25, suggestedDate: "2023-08-15", investmentPrice: 285, currentPrice: 279 },
  { symbol: "ZYDUSLIFE", sector: "Financial Services", allocation: 4.5, returnPct: -12.87, returnPerDay: -0.51, daysTracked: 25, suggestedDate: "2023-09-25", investmentPrice: 880, currentPrice: 768 },
  { symbol: "HDFCBANK", sector: "Financial Services", allocation: 4.2, returnPct: -16.34, returnPerDay: -0.65, daysTracked: 25, suggestedDate: "2023-11-05", investmentPrice: 1850, currentPrice: 1548 },
  { symbol: "ICICIBANK", sector: "Financial Services", allocation: 3.9, returnPct: -10.78, returnPerDay: -0.43, daysTracked: 25, suggestedDate: "2023-10-20", investmentPrice: 1225, currentPrice: 1093 },
  { symbol: "LLOYDSME", sector: "Basic Materials", allocation: 10.25, returnPct: 20.63, returnPerDay: 0.82, daysTracked: 25, suggestedDate: "2023-01-10", investmentPrice: 1450, currentPrice: 1750 },
  { symbol: "BODALCHEM", sector: "Basic Materials", allocation: 5.62, returnPct: 22.14, returnPerDay: 0.88, daysTracked: 25, suggestedDate: "2023-02-28", investmentPrice: 580, currentPrice: 708 },
  { symbol: "GPIL", sector: "Basic Materials", allocation: 5.4, returnPct: 10.07, returnPerDay: 0.40, daysTracked: 25, suggestedDate: "2023-05-18", investmentPrice: 1680, currentPrice: 1849 },
  { symbol: "STEELCAST", sector: "Basic Materials", allocation: 3.2, returnPct: -18.92, returnPerDay: -0.76, daysTracked: 25, suggestedDate: "2024-01-15", investmentPrice: 420, currentPrice: 340 },
  { symbol: "RELIANCE", sector: "Energy", allocation: 5.0, returnPct: -1.23, returnPerDay: -0.05, daysTracked: 25, suggestedDate: "2023-03-22", investmentPrice: 2850, currentPrice: 2815 },
  { symbol: "ONGC", sector: "Energy", allocation: 3.4, returnPct: -13.56, returnPerDay: -0.54, daysTracked: 25, suggestedDate: "2024-02-10", investmentPrice: 185, currentPrice: 160 },
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

export function calculatePerformanceMetrics(stock: Stock): PerformanceMetrics {
  const suggestedDate = new Date(stock.suggestedDate);
  const currentDate = new Date("2026-04-22");

  const totalReturn = ((stock.currentPrice - stock.investmentPrice) / stock.investmentPrice) * 100;

  const daysDiff = Math.floor((currentDate.getTime() - suggestedDate.getTime()) / (1000 * 60 * 60 * 24));
  const daily = daysDiff > 0 ? totalReturn / daysDiff : 0;

  const oneMonthBack = new Date(currentDate);
  oneMonthBack.setMonth(oneMonthBack.getMonth() - 1);
  const priceOneMonthBack = stock.investmentPrice * Math.pow(1 + totalReturn / 100, Math.max(0, (oneMonthBack.getTime() - suggestedDate.getTime()) / (currentDate.getTime() - suggestedDate.getTime())));
  const mom = ((stock.currentPrice - priceOneMonthBack) / priceOneMonthBack) * 100;

  const threeMonthsBack = new Date(currentDate);
  threeMonthsBack.setMonth(threeMonthsBack.getMonth() - 3);
  const priceThreeMonthsBack = stock.investmentPrice * Math.pow(1 + totalReturn / 100, Math.max(0, (threeMonthsBack.getTime() - suggestedDate.getTime()) / (currentDate.getTime() - suggestedDate.getTime())));
  const qoq = ((stock.currentPrice - priceThreeMonthsBack) / priceThreeMonthsBack) * 100;

  const oneYearBack = new Date(currentDate);
  oneYearBack.setFullYear(oneYearBack.getFullYear() - 1);
  const priceOneYearBack = stock.investmentPrice * Math.pow(1 + totalReturn / 100, Math.max(0, (oneYearBack.getTime() - suggestedDate.getTime()) / (currentDate.getTime() - suggestedDate.getTime())));
  const yoy = ((stock.currentPrice - priceOneYearBack) / priceOneYearBack) * 100;

  return { yoy, qoq, mom, daily };
}

export function getMonthsFromSuggestion(stock: Stock): number {
  const suggestedDate = new Date(stock.suggestedDate);
  const currentDate = new Date("2026-04-22");
  return Math.floor((currentDate.getFullYear() - suggestedDate.getFullYear()) * 12 + (currentDate.getMonth() - suggestedDate.getMonth()));
}
