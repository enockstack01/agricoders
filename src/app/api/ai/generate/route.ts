import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { AI_ASSIST_POLICY, checkRateLimit, rateLimitHeaders, rateLimitResponse, roleFromClaims } from "@/lib/rateLimit";

export const maxDuration = 30;

const client = new Anthropic();

const SECTION_PROMPTS: Record<string, (ctx: string, extra?: string) => string> = {
  vision: (ctx) =>
    `Write a single powerful Vision Statement (1–2 sentences) for a business plan.\n\nBusiness context:\n${ctx}\n\nThe vision should be aspirational, forward-looking, and specific to this industry. Return only the vision statement text.`,

  mission: (ctx) =>
    `Write a single Mission Statement (1–2 sentences) for a business plan.\n\nBusiness context:\n${ctx}\n\nThe mission should describe what the company does, for whom, and how. Return only the mission statement text.`,

  shortTermGoals: (ctx) =>
    `Write exactly 3 short-term business goals (0–12 months) for a business plan.\n\nBusiness context:\n${ctx}\n\nReturn ONLY a JSON array of 3 strings: ["goal1", "goal2", "goal3"]. Each goal should be specific and achievable.`,

  mediumTermGoals: (ctx) =>
    `Write exactly 3 medium-term business goals (1–3 years) for a business plan.\n\nBusiness context:\n${ctx}\n\nReturn ONLY a JSON array of 3 strings: ["goal1", "goal2", "goal3"]. Each goal should be measurable and strategic.`,

  longTermGoals: (ctx) =>
    `Write exactly 3 long-term business goals (3–5 years) for a business plan.\n\nBusiness context:\n${ctx}\n\nReturn ONLY a JSON array of 3 strings: ["goal1", "goal2", "goal3"]. Each goal should be ambitious but plausible.`,

  swot: (ctx) =>
    `Generate a SWOT analysis for a business plan.\n\nBusiness context:\n${ctx}\n\n` +
    `Return ONLY valid JSON in this exact format:\n` +
    `{"strengths":["s1","s2","s3"],"weaknesses":["w1","w2","w3"],"opportunities":["o1","o2","o3"],"threats":["t1","t2","t3"]}\n` +
    `Each array should have exactly 3 items. No markdown, no extra text.`,

  pestel: (ctx) =>
    `Generate a PESTEL analysis for a business plan.\n\nBusiness context:\n${ctx}\n\n` +
    `Return ONLY valid JSON in this exact format:\n` +
    `{"political":"...","economic":"...","social":"...","technological":"...","environmental":"...","legal":"..."}\n` +
    `Each value should be 2–3 sentences. No markdown, no extra text.`,

  marketSegments: (ctx) =>
    `Identify 3 target market segments for this business.\n\nBusiness context:\n${ctx}\n\n` +
    `Return ONLY valid JSON array: [{"name":"segment1","description":"desc1"},{"name":"segment2","description":"desc2"},{"name":"segment3","description":"desc3"}]\n` +
    `No markdown, no extra text.`,

  competitors: (ctx) =>
    `Identify 3 realistic competitors for this business.\n\nBusiness context:\n${ctx}\n\n` +
    `Return ONLY valid JSON array: [{"name":"competitor1","description":"desc1"},{"name":"competitor2","description":"desc2"},{"name":"competitor3","description":"desc3"}]\n` +
    `No markdown, no extra text.`,

  marketingStrategies: (ctx) =>
    `Write exactly 4 marketing strategies for this business.\n\nBusiness context:\n${ctx}\n\n` +
    `Return ONLY a JSON array of 4 strings: ["strategy1","strategy2","strategy3","strategy4"]. No markdown.`,

  distributionChannels: (ctx) =>
    `List exactly 3 distribution channels for this business.\n\nBusiness context:\n${ctx}\n\n` +
    `Return ONLY a JSON array of 3 strings. No markdown.`,

  workingModelSteps: (ctx) =>
    `Describe the business operating model in exactly 4 steps.\n\nBusiness context:\n${ctx}\n\n` +
    `Return ONLY a JSON array of 4 strings describing how the business operates step-by-step. No markdown.`,

  technologies: (ctx) =>
    `List the key technologies or tools this business would use.\n\nBusiness context:\n${ctx}\n\n` +
    `Return ONLY a JSON array of 4 strings. No markdown.`,

  values: (ctx) =>
    `Generate 4 core company values with descriptions.\n\nBusiness context:\n${ctx}\n\n` +
    `Return ONLY valid JSON: [{"name":"value1","description":"desc1"},{"name":"value2","description":"desc2"},{"name":"value3","description":"desc3"},{"name":"value4","description":"desc4"}]\n` +
    `No markdown, no extra text.`,
};

/** Keeps each user supplied value short so a single request cannot carry an oversized prompt. */
const clip = (v: unknown, max = 300) => String(v).slice(0, max);

function buildContext(body: Record<string, unknown>): string {
  const lines: string[] = [];
  if (body.companyName) lines.push(`Company: ${clip(body.companyName)}`);
  if (body.companyFocus) lines.push(`Industry: ${clip(body.companyFocus)}`);
  if (body.location) lines.push(`Location: ${clip(body.location)}`);
  if (body.companyType) lines.push(`Type: ${clip(body.companyType)}`);
  if (body.productName) lines.push(`Product/Project: ${clip(body.productName)}`);
  if (body.products && Array.isArray(body.products)) {
    const ps = (body.products as { name?: string }[]).filter((p) => p.name).slice(0, 10).map((p) => clip(p.name, 80)).join(", ");
    if (ps) lines.push(`Products/Services: ${ps}`);
  }
  if (body.currency) lines.push(`Currency: ${clip(body.currency)}`);
  if (body.existingVision) lines.push(`Existing Vision: ${clip(body.existingVision)}`);
  if (body.existingMission) lines.push(`Existing Mission: ${clip(body.existingMission)}`);
  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { section } = body as { section?: string };

    if (!section || !SECTION_PROMPTS[section]) {
      return NextResponse.json({ error: "Unknown section" }, { status: 400 });
    }

    // Rate limit per user before any AI call is made
    const limit = await checkRateLimit(userId, AI_ASSIST_POLICY, roleFromClaims(sessionClaims));
    if (!limit.ok) return rateLimitResponse(limit);
    const limitHeaders = rateLimitHeaders(limit);

    const ctx = buildContext(body);
    const prompt = SECTION_PROMPTS[section](ctx);

    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system:
        "You are a professional business plan writer. " +
        "Return ONLY the requested content — no preamble, no explanation, no markdown formatting. " +
        "If the output format is JSON, return only valid JSON.",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (msg.content[0] as { text: string }).text.trim();

    // For JSON-returning sections, parse and return structured data
    const jsonSections = new Set([
      "shortTermGoals", "mediumTermGoals", "longTermGoals",
      "swot", "pestel", "marketSegments", "competitors",
      "marketingStrategies", "distributionChannels",
      "workingModelSteps", "technologies", "values",
    ]);

    if (jsonSections.has(section)) {
      try {
        // Strip any accidental markdown code fences
        const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
        const parsed = JSON.parse(clean);
        return NextResponse.json({ content: parsed }, { headers: limitHeaders });
      } catch {
        return NextResponse.json({ error: "AI returned invalid JSON", raw }, { status: 422, headers: limitHeaders });
      }
    }

    return NextResponse.json({ content: raw }, { headers: limitHeaders });
  } catch (err) {
    console.error("[/api/ai/generate]", err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
