import Anthropic from "@anthropic-ai/sdk";
import { FormSubmission, FinancialResults } from "@/types";

const client = new Anthropic();

export interface AINarrative {
  executiveSummary: string;
  introduction: string;
  industryAnalysis: string;
  localMarketContext: string;
  marketContext: string;
  conclusion: string;
  references: string;
}

const TIMEOUT_MS = 35_000;

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")  // ***bold+italic*** → plain
    .replace(/\*\*(.+?)\*\*/g, "$1")       // **bold** → plain
    .replace(/\*(.+?)\*/g, "$1")           // *italic* → plain
    .replace(/^\s*[*\-]\s+/gm, "")         // leading bullet * or - on a line
    .replace(/\*/g, "")                     // any remaining stray asterisks
    .replace(/#{1,6}\s+/g, "")             // ## heading markers
    .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, "")); // inline code backticks
}

async function askAI(prompt: string, maxTokens = 1200): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system:
        "You are a professional business plan writer and industry research analyst. " +
        "Write detailed, well-researched, formal paragraphs for direct use in a professional business plan document. " +
        "Do NOT use markdown formatting, asterisks, bullet points, or headers in your response. " +
        "Do NOT bold any text with asterisks (**) — use plain text only. " +
        "Write only flowing prose paragraphs separated by blank lines (double newline). " +
        "Include APA 7th edition in-text citations for all market statistics, growth rates, and industry claims " +
        "(e.g. \"(Grand View Research, 2024)\" or \"(World Bank, 2023)\"). " +
        "Be specific, data-driven, and thorough. Minimum 3 well-developed paragraphs unless otherwise specified.",
      messages: [{ role: "user", content: prompt }],
    });
    const raw = (msg.content[0] as { text: string }).text.trim();
    return stripMarkdown(raw);
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    const normalised = url.startsWith("http") ? url : `https://${url}`;
    const res = await fetch(normalised, {
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BusinessPlanBot/1.0)" },
    });
    if (!res.ok) return "";
    const html = await res.text();
    const text = html
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 3000);
    return text;
  } catch {
    return "";
  }
}

async function buildContext(data: FormSubmission, results: FinancialResults): Promise<string> {
  const ci = data.companyInfo;
  const bd = data.businessDescription;
  const ma = data.marketAnalysis;
  const cur = ci.currency || "USD";
  const products = bd.products.filter((p) => p.name).map((p) => p.name).join(", ") || "various products/services";
  const segments = ma.targetSegments.filter((s) => s.name).map((s) => s.name).join(", ") || "diverse customer segments";
  const competitors = ma.competitors.filter((c) => c.name).map((c) => c.name).join(", ") || "several market players";
  const strategies = ma.marketingStrategies.filter(Boolean).join("; ") || "standard marketing approaches";
  const projYears = data.financial.projectionYears ?? 5;

  const lines = [
    `Company: ${ci.companyName}`,
    `Industry: ${ci.companyFocus || "general business"}`,
    `Location: ${ci.location || "undisclosed"}`,
    `Type: ${ci.companyType || "company"}`,
    `Product/Project: ${ci.productName}`,
    `Products/Services: ${products}`,
    `Target Segments: ${segments}`,
    `Key Competitors: ${competitors}`,
    `Marketing Strategies: ${strategies}`,
    `Vision: ${bd.vision || "N/A"}`,
    `Mission: ${bd.mission || "N/A"}`,
    `Currency: ${cur}`,
    `Projection Period: ${projYears} years`,
    `Y1 Revenue: ${(results.totalRevenue[0] ?? 0).toLocaleString()} ${cur}`,
    `Y${projYears} Revenue: ${(results.totalRevenue[Math.min(projYears, results.totalRevenue.length) - 1] ?? 0).toLocaleString()} ${cur}`,
    `CAPEX: ${results.capexTotal.toLocaleString()} ${cur}`,
    `NPV: ${results.npv.npvTotal.toLocaleString()} ${cur}`,
    `IRR: ${(results.npv.irr * 100).toFixed(1)}%`,
    `Payback: ${results.payback.years > 0 ? results.payback.years.toFixed(2) + " years" : "within projection period"}`,
    `Global Market 2024: $${ma.globalMarketSize2024}B`,
    `Global Market 2025: $${ma.globalMarketSize2025}B`,
    `Global Market 2030: $${ma.globalMarketSize2030}B`,
    `GDP Contribution: ${ma.gdpContribution}%`,
    `Employment: ${ma.employmentPercentage}%`,
  ];

  if (ci.website) {
    lines.push(`Website: ${ci.website}`);
    const websiteContent = await fetchWebsiteContent(ci.website);
    if (websiteContent) {
      lines.push(`Website content (use to enrich the narrative with real company details): ${websiteContent}`);
    }
  }

  return lines.join("\n");
}

async function generateExecutiveSummary(ctx: string): Promise<string> {
  return askAI(
    `Write a comprehensive Executive Summary (4 substantial paragraphs) for this business plan.\n\nContext:\n${ctx}\n\n` +
    `Paragraph 1: Introduce the company, its legal structure, location, industry, and the specific problem or opportunity it addresses. Include the company's core value proposition.\n` +
    `Paragraph 2: Describe the market opportunity with specific data and size estimates. Explain why the timing is right and the competitive differentiation. Include at least two APA in-text citations for market data.\n` +
    `Paragraph 3: Describe the business model, revenue streams, key products or services, and operational approach.\n` +
    `Paragraph 4: Summarize the financial highlights — Year 1 and final-year revenue projections, CAPEX requirement, NPV, IRR, and payback period — and close with a compelling investment case statement.`,
    1400
  );
}

async function generateIntroduction(ctx: string): Promise<string> {
  return askAI(
    `Write a detailed Introduction (3 paragraphs) for a business plan.\n\nContext:\n${ctx}\n\n` +
    `Paragraph 1: Describe the macroeconomic and industry context, including structural trends, digitisation, urbanisation, or regulatory changes relevant to this business. Cite specific statistics (APA format).\n` +
    `Paragraph 2: Articulate the specific market gap, pain point, or opportunity this business addresses. Explain why existing solutions are insufficient.\n` +
    `Paragraph 3: Introduce the company, its founding rationale, core capabilities, and why it is uniquely positioned to succeed in this market.`,
    1100
  );
}

async function generateIndustryAnalysis(ctx: string, ma: FormSubmission["marketAnalysis"]): Promise<string> {
  const marketInfo = [
    ma.globalMarketSize2024 > 0 ? `Global market size 2024: $${ma.globalMarketSize2024}B` : "",
    ma.globalMarketSize2025 > 0 ? `Global market size 2025: $${ma.globalMarketSize2025}B` : "",
    ma.globalMarketSize2030 > 0 ? `Global market size 2030: $${ma.globalMarketSize2030}B` : "",
    ma.gdpContribution > 0 ? `Sector GDP contribution: ${ma.gdpContribution}%` : "",
    ma.employmentPercentage > 0 ? `Sector employment: ${ma.employmentPercentage}%` : "",
  ].filter(Boolean).join(", ");

  return askAI(
    `Write a thorough Global Market Overview section (3 detailed paragraphs) for a business plan.\n\nCompany context:\n${ctx}\n\n` +
    (marketInfo ? `Market data provided by client: ${marketInfo}\n\n` : "") +
    `Paragraph 1: Describe the global size and structure of the industry. Discuss major market segments, dominant geographies, and leading market participants. Include specific market size figures and CAGR estimates with APA citations.\n` +
    `Paragraph 2: Describe the key growth drivers, technological disruptions, emerging trends, and investment flows in this industry globally. Reference specific industry reports and publications (APA citations).\n` +
    `Paragraph 3: Describe challenges, barriers to entry, regulatory landscape, and sustainability or ESG considerations affecting the sector globally.`,
    1400
  );
}

async function generateLocalMarketContext(ctx: string, ma: FormSubmission["marketAnalysis"], location: string): Promise<string> {
  const localData = [
    ma.gdpContribution > 0 ? `GDP contribution: ${ma.gdpContribution}%` : "",
    ma.employmentPercentage > 0 ? `Employment: ${ma.employmentPercentage}%` : "",
  ].filter(Boolean).join(", ");

  return askAI(
    `Write a thorough Local/Regional Market Context section (3 detailed paragraphs) for a business plan.\n\nCompany context:\n${ctx}\n\n` +
    (localData ? `Local data: ${localData}\n\n` : "") +
    `Focus on the local and regional market conditions in ${location || "the company's operating region"}.\n\n` +
    `Paragraph 1: Describe the local economic environment, sector size, growth trajectory, and government policy or investment climate. Include specific figures from national statistics, central bank reports, or sector studies with APA citations.\n` +
    `Paragraph 2: Describe the local competitive landscape, key players, market gaps, consumer behaviour patterns, and purchasing power dynamics specific to this region.\n` +
    `Paragraph 3: Identify local opportunities that make this market particularly attractive for the business, including infrastructure development, demographic trends, or technology adoption rates. Reference any relevant development programmes or industry reports.`,
    1400
  );
}

async function generateMarketContext(ctx: string, ma: FormSubmission["marketAnalysis"]): Promise<string> {
  const competitors = ma.competitors.filter((c) => c.name).map((c) => `${c.name}${c.description ? " (" + c.description + ")" : ""}`).join("; ") || "several players";
  const segments = ma.targetSegments.filter((s) => s.name).map((s) => `${s.name}${s.description ? ": " + s.description : ""}`).join("; ") || "multiple segments";
  const strategies = ma.marketingStrategies.filter(Boolean).join("; ") || "";
  const channels = ma.distributionChannels.filter(Boolean).join("; ") || "";

  return askAI(
    `Write a comprehensive Market Analysis overview (4 detailed paragraphs) for a business plan.\n\nCompany context:\n${ctx}\n\n` +
    `Key competitors: ${competitors}\nTarget segments: ${segments}\n` +
    (strategies ? `Marketing strategies: ${strategies}\n` : "") +
    (channels ? `Distribution channels: ${channels}\n` : "") +
    `\nParagraph 1: Analyse the competitive landscape in depth. Describe each major competitor's strengths, weaknesses, and market positioning. Explain the competitive differentiation strategy with evidence-based reasoning.\n` +
    `Paragraph 2: Describe the primary target customer segments in detail — their demographics, psychographics, purchasing behaviour, pain points, and willingness to pay. Include data from consumer research where applicable (APA citations).\n` +
    `Paragraph 3: Describe the go-to-market strategy, including pricing approach, promotional channels, and distribution model. Explain how each element addresses the target segments.\n` +
    `Paragraph 4: Discuss the addressable market size, realistic market capture assumptions, and the company's expected market share trajectory over the projection period.`,
    1500
  );
}

async function generateConclusion(ctx: string): Promise<string> {
  return askAI(
    `Write a compelling Conclusion (3 paragraphs) for a business plan.\n\nContext:\n${ctx}\n\n` +
    `Paragraph 1: Summarise the strategic opportunity — market size, timing, and the company's unique positioning. Reinforce why this business can capture significant market share.\n` +
    `Paragraph 2: Summarise the operational and team readiness — the business model's viability, the management team's capabilities, and the execution roadmap.\n` +
    `Paragraph 3: Make the final investment case. Reference specific financial metrics (NPV, IRR, payback period, revenue projections) and articulate the expected return on investment and social/economic impact.`,
    1100
  );
}

async function generateReferences(ctx: string, ma: FormSubmission["marketAnalysis"], industry: string, location: string): Promise<string> {
  const marketInfo = [
    ma.globalMarketSize2024 > 0 ? `$${ma.globalMarketSize2024}B global market size (2024)` : "",
    ma.globalMarketSize2025 > 0 ? `$${ma.globalMarketSize2025}B (2025)` : "",
    ma.globalMarketSize2030 > 0 ? `$${ma.globalMarketSize2030}B (2030 projection)` : "",
  ].filter(Boolean).join(", ");

  return askAI(
    `Generate a formal References list for a business plan in the ${industry} industry${location ? ` operating in ${location}` : ""}.\n\n` +
    `Context: ${ctx}\n\n` +
    (marketInfo ? `Market data used: ${marketInfo}\n\n` : "") +
    `Generate 10-15 realistic, plausible references that would be cited in a professional business plan covering:\n` +
    `1. Global industry market research reports (e.g. from Grand View Research, MarketsandMarkets, Statista, IBISWorld, Deloitte, McKinsey, PwC, etc.)\n` +
    `2. Local/national economic or sector data (e.g. from national statistics offices, central banks, development finance institutions)\n` +
    `3. Academic or policy papers on industry trends\n` +
    `4. Government regulatory or investment climate publications\n` +
    `5. Company-specific sources (website, internal reports)\n\n` +
    `Rules:\n` +
    `- Number each reference sequentially: 1. 2. 3. etc.\n` +
    `- Format every entry in strict APA 7th Edition style\n` +
    `- Each reference on its own line, no blank lines between entries\n` +
    `- Do NOT use asterisks or any special markers\n` +
    `- Include realistic-looking URLs or DOIs\n` +
    `- Output ONLY the numbered reference list, no preamble or notes`,
    1600
  );
}

export async function generateAINarrative(
  data: FormSubmission,
  results: FinancialResults
): Promise<AINarrative> {
  const ctx = await buildContext(data, results);
  const fallback = "";
  const ci = data.companyInfo;
  const industry = ci.companyFocus || "the industry";
  const location = ci.location || "";

  const [
    executiveSummary,
    introduction,
    industryAnalysis,
    localMarketContext,
    marketContext,
    conclusion,
    references,
  ] = await Promise.all([
    generateExecutiveSummary(ctx).catch(() => fallback),
    generateIntroduction(ctx).catch(() => fallback),
    generateIndustryAnalysis(ctx, data.marketAnalysis).catch(() => fallback),
    generateLocalMarketContext(ctx, data.marketAnalysis, location).catch(() => fallback),
    generateMarketContext(ctx, data.marketAnalysis).catch(() => fallback),
    generateConclusion(ctx).catch(() => fallback),
    generateReferences(ctx, data.marketAnalysis, industry, location).catch(() => fallback),
  ]);

  return { executiveSummary, introduction, industryAnalysis, localMarketContext, marketContext, conclusion, references };
}
