/**
 * Client for LivestockPro's health-records feed.
 *
 * CONTRACT — what livestockpro.agricoders.com needs to expose:
 *
 *   GET {LIVESTOCK_API_URL}/api/onehealth/records?since=<cursor>&limit=<n>
 *   Header: Authorization: Bearer {LIVESTOCK_API_KEY}
 *
 *   Response 200:
 *   {
 *     "records": [
 *       {
 *         "id": "string (stable, unique per record)",
 *         "animalId": "string | null",
 *         "species": "string (e.g. cattle, goat, sheep, poultry, pig)",
 *         "farmId": "string | null",
 *         "farmName": "string | null",
 *         "district": "string | null",
 *         "country": "string | null",
 *         "lat": "number | null",
 *         "lng": "number | null",
 *         "eventType": "health_record | vaccination | mortality | diagnosis",
 *         "symptoms": ["string"],
 *         "diagnosis": "string | null",
 *         "severity": "mild | moderate | severe | fatal | null",
 *         "mortality": "boolean",
 *         "vaccinated": "boolean",
 *         "recordedAt": "ISO 8601 timestamp",
 *         "notes": "string | null"
 *       }
 *     ],
 *     "nextCursor": "string | null"   // pass back as `since` on the next call; null when caught up
 *   }
 *
 * `since` is omitted on the very first call. The dashboard polls this endpoint every few
 * minutes and stores the returned `nextCursor` to fetch only what's new next time.
 */

export interface LivestockApiRecord {
  id: string;
  animalId?: string | null;
  species: string;
  farmId?: string | null;
  farmName?: string | null;
  district?: string | null;
  country?: string | null;
  lat?: number | null;
  lng?: number | null;
  eventType: "health_record" | "vaccination" | "mortality" | "diagnosis";
  symptoms?: string[] | null;
  diagnosis?: string | null;
  severity?: "mild" | "moderate" | "severe" | "fatal" | null;
  mortality?: boolean | null;
  vaccinated?: boolean | null;
  recordedAt: string;
  notes?: string | null;
}

interface LivestockApiResponse {
  records: LivestockApiRecord[];
  nextCursor: string | null;
}

export class LivestockApiNotConfiguredError extends Error {
  constructor() {
    super("LIVESTOCK_API_URL / LIVESTOCK_API_KEY not configured");
    this.name = "LivestockApiNotConfiguredError";
  }
}

export function isLivestockApiConfigured(): boolean {
  return Boolean(process.env.LIVESTOCK_API_URL && process.env.LIVESTOCK_API_KEY);
}

/** Fetches one page of new/updated records since the given cursor. */
export async function fetchLivestockRecords(
  cursor: string | null,
  limit = 200
): Promise<LivestockApiResponse> {
  const baseUrl = process.env.LIVESTOCK_API_URL;
  const apiKey = process.env.LIVESTOCK_API_KEY;
  if (!baseUrl || !apiKey) throw new LivestockApiNotConfiguredError();

  const url = new URL("/api/onehealth/records", baseUrl);
  url.searchParams.set("limit", String(limit));
  if (cursor) url.searchParams.set("since", cursor);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    throw new Error(`LivestockPro API returned ${res.status}: ${await res.text().catch(() => "")}`);
  }

  const data = (await res.json()) as LivestockApiResponse;
  return {
    records: Array.isArray(data.records) ? data.records : [],
    nextCursor: data.nextCursor ?? null,
  };
}
