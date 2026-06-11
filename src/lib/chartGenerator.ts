import { spawnSync } from "child_process";
import path from "path";
import { FinancialResults } from "@/types";

export interface ChartImages {
  revenue?: Buffer;
  netIncome?: Buffer;
  cashFlow?: Buffer;
  opexBreakdown?: Buffer;
  breakEven?: Buffer;
  incomeSummary?: Buffer;
}

// Candidate Python executables to try in order
const PYTHON_CANDIDATES = [
  process.env.PYTHON_PATH ?? "",
  "C:/Users/ENOCKNSHIMIYIMANA/AppData/Local/Python/bin/python.exe",
  "python3",
  "python",
  "py",
];

function findPython(): string | null {
  for (const candidate of PYTHON_CANDIDATES) {
    if (!candidate) continue;
    try {
      const r = spawnSync(candidate, ["--version"], { timeout: 5000 });
      if (r.status === 0) return candidate;
    } catch {
      // try next
    }
  }
  return null;
}

/**
 * Calls the Python chart generator script with financial results,
 * returns base64-decoded PNG buffers keyed by chart name.
 * Returns empty object if Python is unavailable or the script fails.
 */
export async function generateCharts(
  results: FinancialResults,
  currency: string
): Promise<ChartImages> {
  const pythonExe = findPython();
  if (!pythonExe) {
    console.warn("[chartGenerator] Python not found — charts skipped.");
    return {};
  }

  const scriptPath = path.join(process.cwd(), "src", "scripts", "generate_charts.py");

  // Build a slim payload containing only what the Python script needs
  const payload = JSON.stringify({
    totalRevenue: results.totalRevenue,
    totalOpex: results.totalOpex,
    cashFlow: results.cashFlow,
    incomeStatement: results.incomeStatement,
    opexRows: results.opexRows.map((r) => ({ item: r.item, annual: r.annual })),
    breakEven: results.breakEven,
    currency,
    projectionYears: results.totalRevenue.length,
  });

  const result = spawnSync(pythonExe, [scriptPath], {
    input: payload,
    timeout: 60_000,
    maxBuffer: 50 * 1024 * 1024, // 50 MB
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.toString().slice(0, 500) ?? "unknown error";
    console.error("[chartGenerator] Python script failed:", stderr);
    return {};
  }

  let parsed: { charts?: Record<string, string> };
  try {
    parsed = JSON.parse(result.stdout.toString());
  } catch {
    console.error("[chartGenerator] Failed to parse Python output");
    return {};
  }

  const charts = parsed.charts ?? {};
  const images: ChartImages = {};

  for (const [key, b64] of Object.entries(charts)) {
    if (key.endsWith("_error")) {
      console.warn(`[chartGenerator] Chart '${key}':`, b64.slice(0, 200));
      continue;
    }
    (images as Record<string, Buffer>)[key] = Buffer.from(b64, "base64");
  }

  return images;
}
