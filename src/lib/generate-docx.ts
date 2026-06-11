import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  WidthType,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Packer,
  ShadingType,
  TableLayoutType,
  Footer,
  PageNumber,
  NumberFormat,
  Bookmark,
  InternalHyperlink,
  LineRuleType,
} from "docx";
import { FormSubmission, FinancialResults } from "@/types";
import type { ChartImages } from "@/lib/chartGenerator";
import type { AINarrative } from "@/lib/aiNarrative";

// ─── Constants ────────────────────────────────────────────────────────────────

const TNR = "Times New Roman";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtD = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

// 1.5 line spacing (240 = single, 360 = 1.5×, 480 = double)
const LS = { line: 360, lineRule: LineRuleType.AUTO } as const;

// ─── Heading helpers ──────────────────────────────────────────────────────────

function h1(text: string, anchor?: string): Paragraph {
  const run = new TextRun({ text, bold: true, size: 28, font: TNR, color: "000000" }); // 14 pt
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200, ...LS },
    children: anchor ? [new Bookmark({ id: anchor, children: [run] })] : [run],
  });
}

function h2(text: string, anchor?: string): Paragraph {
  const run = new TextRun({ text, bold: true, size: 26, font: TNR, color: "000000" }); // 13 pt
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 100, ...LS },
    children: anchor ? [new Bookmark({ id: anchor, children: [run] })] : [run],
  });
}

function h3(text: string, anchor?: string): Paragraph {
  const run = new TextRun({ text, bold: true, size: 24, font: TNR, color: "000000" }); // 12 pt
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80, ...LS },
    children: anchor ? [new Bookmark({ id: anchor, children: [run] })] : [run],
  });
}

// ─── Paragraph helpers ────────────────────────────────────────────────────────

// Strip markdown asterisks that may slip through from AI-generated text
function clean(t: string): string {
  return t
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\*/g, "");
}

function para(text: string, bold = false): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: clean(text), bold, size: 24, font: TNR, color: "000000" })], // 12 pt
    spacing: { after: 120, ...LS },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function bullet(text: string): Paragraph {
  return para(text);
}

function refPara(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: clean(text), size: 24, font: TNR, color: "000000" })],
    indent: { left: 720, hanging: 720 },
    spacing: { after: 120, ...LS },
    alignment: AlignmentType.LEFT,
  });
}

function pageBreak(): Paragraph {
  return new Paragraph({ pageBreakBefore: true, children: [] });
}

// ─── Caption helpers (bookmarked for LOT / LOF linking) ──────────────────────

function tableCaption(text: string, anchor: string): Paragraph {
  return new Paragraph({
    spacing: { after: 80, ...LS },
    children: [
      new Bookmark({
        id: anchor,
        children: [new TextRun({ text, size: 22, italics: true, font: TNR })],
      }),
    ],
  });
}

function figCaption(text: string, anchor: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200, ...LS },
    children: [
      new Bookmark({
        id: anchor,
        children: [new TextRun({ text, size: 20, italics: true, color: "000000", font: TNR })],
      }),
    ],
  });
}

// ─── TOC / LOT / LOF link helper ─────────────────────────────────────────────

function navLink(label: string, anchor: string, indent = 0): Paragraph {
  return new Paragraph({
    indent: indent ? { left: indent * 360 } : undefined,
    spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO },
    children: [
      new InternalHyperlink({
        anchor,
        children: [new TextRun({ text: label, size: 22, font: TNR, color: "1155CC" })],
      }),
    ],
  });
}

// ─── Table helpers ────────────────────────────────────────────────────────────

function tblHeader(cells: string[]): TableRow {
  return new TableRow({
    children: cells.map((c) => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: c, bold: true, size: 20, color: "FFFFFF", font: TNR })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60, ...LS },
      })],
      shading: { type: ShadingType.SOLID, color: "2E8B57", fill: "2E8B57" },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
    })),
    tableHeader: true,
  });
}

function tblRow(cells: string[]): TableRow {
  return new TableRow({
    children: cells.map((c) => {
      const lines = (c || "").split("\n").filter(Boolean);
      return new TableCell({
        children: lines.length > 1
          ? lines.map((line, i) => new Paragraph({
              children: [new TextRun({ text: line, size: 20, color: "000000", font: TNR })],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: i < lines.length - 1 ? 80 : 40, ...LS },
            }))
          : [new Paragraph({
              children: [new TextRun({ text: c || "—", size: 20, color: "000000", font: TNR })],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 40, ...LS },
            })],
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
      });
    }),
  });
}

function makeTable(headers: string[], rows: string[][]): Table {
  return new Table({
    layout: TableLayoutType.FIXED,
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [tblHeader(headers), ...rows.map((r) => tblRow(r))],
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 4, color: "2E8B57" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "2E8B57" },
      left:   { style: BorderStyle.SINGLE, size: 4, color: "2E8B57" },
      right:  { style: BorderStyle.SINGLE, size: 4, color: "2E8B57" },
    },
  });
}

function yArr(v: number[], n = 5): string[] {
  return v.slice(0, n).map(fmt);
}

function yArrD(v: number[], n = 5, d = 2): string[] {
  return v.slice(0, n).map((x) => fmtD(x, d));
}

function yCols(n: number, cur: string): string[] {
  return Array.from({ length: n }, (_, i) => `Y${i + 1} (${cur})`);
}

function yColsPlain(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `Year ${i + 1}`);
}

function yEmpty(n: number): string[] {
  return Array(n).fill("");
}

// ─── Chart image + caption ────────────────────────────────────────────────────

const CHART_W = 580;
const CHART_H = 330;

function chartFigure(buf: Buffer | undefined, caption: string, anchor: string): Paragraph[] {
  if (!buf) return [];
  return [
    new Paragraph({
      children: [
        new ImageRun({ data: buf, transformation: { width: CHART_W, height: CHART_H }, type: "png" }),
      ],
      spacing: { before: 200, after: 80 },
    }),
    figCaption(caption, anchor),
  ];
}

// ─── Page number footer ───────────────────────────────────────────────────────

function makeFooter(): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ children: [PageNumber.CURRENT], font: TNR, size: 20 }),
        ],
      }),
    ],
  });
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateBusinessPlanDocx(
  data: FormSubmission,
  results: FinancialResults,
  charts: ChartImages = {},
  ai: AINarrative = {
    executiveSummary: "",
    introduction: "",
    industryAnalysis: "",
    localMarketContext: "",
    marketContext: "",
    conclusion: "",
    references: "",
  }
): Promise<Buffer> {
  const { companyInfo: ci, businessDescription: bd, marketAnalysis: ma, staff, financial: fin } = data;
  const cur = ci.currency || "USD";
  const industry = ci.companyFocus || "the industry";
  const projYears = fin.projectionYears ?? 5;
  const hasProducts = results.productResults.length > 0;
  const mfgProducts = fin.products ?? [];
  const svcOfferings = fin.services ?? [];
  const hasSvc = svcOfferings.filter((s) => s.name).length > 0;

  // Dynamic section 2 subsection numbering
  const hasWorkingModel = bd.workingModelSteps.filter(Boolean).length > 0;
  const hasTechnologies = bd.technologies.filter(Boolean).length > 0;
  const hasRawMaterials = bd.rawMaterials.filter(Boolean).length > 0;
  let _s2 = 7;
  const wmNum   = hasWorkingModel  ? _s2++ : -1;
  const techNum = hasTechnologies  ? _s2++ : -1;
  const rawNum  = hasRawMaterials  ? _s2++ : -1;
  const swotNum   = _s2++;
  const pestelNum = _s2++;

  // ─── Logo ─────────────────────────────────────────────────────────────────
  let logoParagraph: Paragraph | null = null;
  if (ci.companyLogo) {
    const match = ci.companyLogo.match(/^data:image\/(png|jpe?g|gif|webp);base64,(.+)$/i);
    if (match) {
      const imgType = match[1].toLowerCase().replace("jpeg", "jpg") as "png" | "jpg" | "gif";
      const logoBuf = Buffer.from(match[2], "base64");
      logoParagraph = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 800, after: 400 },
        children: [
          new ImageRun({ data: logoBuf, transformation: { width: 300, height: 150 }, type: imgType }),
        ],
      });
    }
  }

  // ─── Dynamic table numbering ──────────────────────────────────────────────
  let nextTbl = 16;
  const mfgTblAnchor = (hasProducts && mfgProducts.length > 0) ? `tbl-${nextTbl}` : null;
  if (mfgTblAnchor) nextTbl++;
  const svcTblAnchor = hasSvc ? `tbl-${nextTbl}` : null;
  if (svcTblAnchor) nextTbl++;
  const bepTblAnchor = hasProducts ? `tbl-${nextTbl}` : null;
  if (bepTblAnchor) nextTbl++;
  const bsTblAnchor = `tbl-${nextTbl}`;

  const mfgTblLabel = mfgTblAnchor ? `Table ${parseInt(mfgTblAnchor.split("-")[1])}. Product Manufacturing Costs` : "";
  const svcTblLabel = svcTblAnchor ? `Table ${parseInt(svcTblAnchor.split("-")[1])}. Service Offerings Catalogue` : "";
  const bepTblLabel = bepTblAnchor ? `Table ${parseInt(bepTblAnchor.split("-")[1])}. Break-Even Analysis` : "";
  const bsTblLabel  = `Table ${parseInt(bsTblAnchor.split("-")[1])}. Proforma Balance Sheet`;

  // ─── LOT / LOF navigation entries ────────────────────────────────────────
  const tableEntries = [
    { label: "Table 1. SWOT Analysis", anchor: "tbl-1" },
    { label: "Table 2. PESTEL Analysis", anchor: "tbl-2" },
    { label: `Table 3. ${ci.companyName || "Company"}: Management Team`, anchor: "tbl-3" },
    { label: "Table 4. Capital Expenses (CAPEX)", anchor: "tbl-4" },
    { label: "Table 5. Operating Expenses (OPEX)", anchor: "tbl-5" },
    { label: "Table 6. Revenue Forecast", anchor: "tbl-6" },
    { label: "Table 7. Projected Cash Flows", anchor: "tbl-7" },
    { label: "Table 8. Income Statement", anchor: "tbl-8" },
    { label: "Table 9. Payroll Summary", anchor: "tbl-9" },
    { label: "Table 10. Estimated Government Revenues", anchor: "tbl-10" },
    { label: "Table 11. Net Present Values", anchor: "tbl-11" },
    { label: "Table 12. Cost-Benefit Ratio", anchor: "tbl-12" },
    { label: "Table 13. Payback Period", anchor: "tbl-13" },
    { label: "Table 14. Profit and Loss Statement", anchor: "tbl-14" },
    { label: "Table 15. Cost-Revenue Ratio", anchor: "tbl-15" },
    ...(mfgTblAnchor ? [{ label: mfgTblLabel, anchor: mfgTblAnchor }] : []),
    ...(svcTblAnchor ? [{ label: svcTblLabel, anchor: svcTblAnchor }] : []),
    ...(bepTblAnchor ? [{ label: bepTblLabel, anchor: bepTblAnchor }] : []),
    { label: bsTblLabel, anchor: bsTblAnchor },
  ];

  const figureEntries = [
    { label: "Figure 1. Annual Operating Expenses Breakdown (Year 1)", anchor: "fig-1" },
    { label: `Figure 2. ${projYears}-Year Revenue vs Operating Expenses Forecast`, anchor: "fig-2" },
    { label: `Figure 3. ${projYears}-Year Cash Flow Projection`, anchor: "fig-3" },
    { label: "Figure 4. Income Statement Summary: Revenue, Gross Margin and Net Income", anchor: "fig-4" },
    { label: `Figure 5. Revenue vs Net Income After Tax (${projYears}-Year)`, anchor: "fig-5" },
    ...(hasProducts ? [{ label: "Figure 6. Break-Even Analysis: Cost vs Revenue", anchor: "fig-6" }] : []),
  ];

  // ─── SECTION 1: Cover page (no footer / no page number) ──────────────────
  const coverChildren: Paragraph[] = [
    ...(logoParagraph
      ? [logoParagraph]
      : [new Paragraph({ children: [], spacing: { before: 1200, after: 0 } })]),
    new Paragraph({
      children: [new TextRun({ text: "BUSINESS PLAN PROPOSAL", bold: true, size: 40, font: TNR, color: "2E8B57" })],
      alignment: AlignmentType.CENTER,
      spacing: { before: logoParagraph ? 200 : 400, after: 300 },
    }),
    new Paragraph({
      children: [new TextRun({
        text: ci.companyName
          ? `${ci.companyName.toUpperCase()}${ci.companyFocus ? `  |  ${ci.companyFocus.toUpperCase()}` : ""}`
          : "COMPANY BUSINESS PLAN",
        bold: true, size: 28, font: TNR, color: "1A5C3A",
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Author: ${ci.authorName}`, bold: true, size: 24, font: TNR })],
      spacing: { after: 80, ...LS },
    }),
    para(ci.authorTitle),
    para(`Tel: ${ci.phone}`),
    para(ci.location),
    para(`Email: ${ci.email}`),
    ...(ci.website ? [para(`Website: ${ci.website}`)] : []),
    new Paragraph({ children: [], spacing: { after: 200 } }),
    para(`Submitted To: ${ci.submittedTo}`),
    para(`Date: ${ci.submissionDate}`),
  ];

  // ─── SECTION 2: Front matter — TOC, LOT, LOF (roman numeral footer) ───────
  const frontMatterChildren: Paragraph[] = [
    // TABLE OF CONTENTS
    h1("Table of Contents"),
    new Paragraph({ children: [], spacing: { after: 100 } }),
    navLink("I.     LIST OF TABLES", "lot"),
    navLink("II.    LIST OF FIGURES", "lof"),
    navLink("       EXECUTIVE SUMMARY", "exec-summary"),
    navLink("1.     INTRODUCTION", "sec-1"),
    navLink("2.     BUSINESS DESCRIPTION", "sec-2"),
    navLink("3.     INDUSTRY ANALYSIS", "sec-3"),
    navLink("4.     MARKET ANALYSIS", "sec-4"),
    navLink("5.     MANAGEMENT TEAM", "sec-5"),
    navLink("6.     FINANCIAL ANALYSIS", "sec-6"),
    navLink("7.     RISK ANALYSIS", "sec-7"),
    navLink("8.     CONCLUSION", "sec-8"),
    navLink("9.     REFERENCES", "sec-9"),

    pageBreak(),

    // LIST OF TABLES
    h1("List of Tables", "lot"),
    new Paragraph({ children: [], spacing: { after: 100 } }),
    ...tableEntries.map((e) => navLink(e.label, e.anchor)),

    pageBreak(),

    // LIST OF FIGURES
    h1("List of Figures", "lof"),
    new Paragraph({ children: [], spacing: { after: 100 } }),
    ...figureEntries.map((e) => navLink(e.label, e.anchor)),
  ];

  // ─── SECTION 3: Main content (arabic page numbers starting at 1) ──────────
  const mainChildren = [

    // ── EXECUTIVE SUMMARY ────────────────────────────────────────────────────
    h1("EXECUTIVE SUMMARY", "exec-summary"),
    ...(ai.executiveSummary
      ? ai.executiveSummary.split("\n\n").filter(Boolean).map((p) => para(p))
      : [para(
          `${ci.productName || ci.companyName} is an innovative solution developed by ${ci.companyName}${ci.location ? `, located in ${ci.location}` : ""}, ` +
          `with the aim of transforming ${industry} through cutting-edge technology and a customer-first approach. ` +
          (bd.products.filter((p) => p.name).length > 0
            ? `Key offerings include: ${bd.products.filter((p) => p.name).map((p) => p.name).join(", ")}. `
            : "") +
          `The company's approach leverages a well-structured business model backed by a capable team and sound financial planning.`
        )]),
    h2("Company Description"),
    para(
      `${ci.companyName} is a ${ci.companyType || "company"} ${ci.location ? `located in ${ci.location}` : ""} ` +
      `focused on ${industry}.`
    ),
    h2("Mission and Vision"),
    para(`Mission: ${bd.mission || "—"}`),
    para(`Vision: ${bd.vision || "—"}`),
    h2("Products and Services"),
    ...(bd.products.filter((p) => p.name).length > 0
      ? bd.products.filter((p) => p.name).map((p) => bullet(`${p.name}${p.description ? ": " + p.description : ""}`))
      : []),
    ...(svcOfferings.filter((s) => s.name).length > 0
      ? svcOfferings.filter((s) => s.name).map((s) => bullet(`${s.name} (${s.serviceType}, ${s.deliveryModel})${s.description ? ": " + s.description : ""}`))
      : []),
    ...(bd.products.filter((p) => p.name).length === 0 && svcOfferings.filter((s) => s.name).length === 0 ? [para("—")] : []),
    h2("Financial Projections"),
    para(
      `${ci.productName || ci.companyName} projects steady revenue growth over a ${projYears}-year horizon. ` +
      (results.payback.years > 0 ? `Payback period: ${results.payback.years.toFixed(2)} years. ` : "") +
      `Initial investment (CAPEX): ${fmt(results.capexTotal)} ${cur}. ` +
      `Year ${projYears} revenue projection: ${fmt(results.totalRevenue[Math.min(projYears, results.totalRevenue.length) - 1] ?? 0)} ${cur}. ` +
      `Net Present Value: ${fmt(results.npv.npvTotal)} ${cur}.`
    ),

    pageBreak(),

    // ── 1. INTRODUCTION ──────────────────────────────────────────────────────
    h1("1. INTRODUCTION", "sec-1"),
    ...(ai.introduction
      ? ai.introduction.split("\n\n").filter(Boolean).map((p) => para(p))
      : [
          para(
            `${ci.companyName} is an ${industry} company ${ci.location ? `based in ${ci.location}` : ""} dedicated to ` +
            `delivering high-quality products and services that address real market needs. ` +
            `This business plan outlines the company's vision, market opportunity, operational model, and ${projYears}-year financial projections.`
          ),
          para(
            `The company's offerings are designed to solve key challenges in ${industry}, serving ` +
            (ma.targetSegments.filter((s) => s.name).length > 0
              ? ma.targetSegments.filter((s) => s.name).map((s) => s.name).join(", ")
              : "a diverse customer base") +
            `. With a committed team and a scalable business model, ${ci.companyName} is positioned for sustainable growth.`
          ),
        ]),

    pageBreak(),

    // ── 2. BUSINESS DESCRIPTION ──────────────────────────────────────────────
    h1("2. BUSINESS DESCRIPTION", "sec-2"),
    para(
      `${ci.productName || ci.companyName} is the flagship offering of ${ci.companyName}, ` +
      `a ${ci.companyType || "company"}${ci.location ? ` based in ${ci.location}` : ""} operating in ${industry}.`
    ),
    h2("2.1 Overview"),
    para(`Company Name: ${ci.companyName}`),
    para(`Product / Project: ${ci.productName || "—"}`),
    para(`Type: ${ci.companyType || "—"}`),
    para(`Location: ${ci.location || "—"}`),
    ...(ci.website ? [para(`Website: ${ci.website}`)] : []),
    para(`Industry: ${industry}`),
    h2("2.2 Vision"),
    para(bd.vision || "—"),
    h2("2.3 Mission"),
    para(bd.mission || "—"),
    h2("2.4 Goals"),
    h3("2.4.1 Short-term goals"),
    ...(bd.shortTermGoals.filter(Boolean).length > 0
      ? bd.shortTermGoals.filter(Boolean).map((g) => bullet(g))
      : [para("—")]),
    h3("2.4.2 Medium-term goals"),
    ...(bd.mediumTermGoals.filter(Boolean).length > 0
      ? bd.mediumTermGoals.filter(Boolean).map((g) => bullet(g))
      : [para("—")]),
    h3("2.4.3 Long-term goals"),
    ...(bd.longTermGoals.filter(Boolean).length > 0
      ? bd.longTermGoals.filter(Boolean).map((g) => bullet(g))
      : [para("—")]),
    h2("2.5 Core Values"),
    ...(bd.values.filter((v) => v.name).length > 0
      ? bd.values.filter((v) => v.name).map((v) => para(`${v.name}: ${v.description || "—"}`))
      : [para("—")]),
    h2("2.6 Products & Services"),
    ...(bd.products.filter((p) => p.name).length > 0 ? [
      para("Products:", true),
      ...bd.products.filter((p) => p.name).map((p) => bullet(`${p.name}: ${p.description || "—"}`)),
    ] : []),
    ...(svcOfferings.filter((s) => s.name).length > 0 ? [
      para("Services:", true),
      ...svcOfferings.filter((s) => s.name).map((s) =>
        bullet(`${s.name}: ${s.serviceType}, ${s.pricingModel}, ${s.deliveryModel}${s.description ? ". " + s.description : ""}`)
      ),
    ] : []),
    ...(bd.products.filter((p) => p.name).length === 0 && svcOfferings.filter((s) => s.name).length === 0
      ? [para("No specific products or services listed.")]
      : []),
    ...(hasWorkingModel
      ? [h2(`2.${wmNum} Working Model`), ...bd.workingModelSteps.filter(Boolean).map((s) => bullet(s))]
      : []),
    ...(hasTechnologies
      ? [h2(`2.${techNum} Technologies Used`), ...bd.technologies.filter(Boolean).map((t) => bullet(t))]
      : []),
    ...(hasRawMaterials
      ? [h2(`2.${rawNum} Key Resources / Raw Materials`), ...bd.rawMaterials.filter(Boolean).map((r) => bullet(r))]
      : []),
    h2(`2.${swotNum} SWOT Analysis`),
    tableCaption("Table 1. SWOT Analysis", "tbl-1"),
    makeTable(
      ["Strengths", "Weaknesses", "Opportunities", "Threats"],
      [[
        bd.swot.strengths.filter(Boolean).join("\n") || "—",
        bd.swot.weaknesses.filter(Boolean).join("\n") || "—",
        bd.swot.opportunities.filter(Boolean).join("\n") || "—",
        bd.swot.threats.filter(Boolean).join("\n") || "—",
      ]]
    ),
    h2(`2.${pestelNum} PESTEL Analysis`),
    tableCaption("Table 2. PESTEL Analysis", "tbl-2"),
    makeTable(
      ["Factor", "Description & Impact"],
      [
        ["Political", bd.pestel.political || "—"],
        ["Economic", bd.pestel.economic || "—"],
        ["Social", bd.pestel.social || "—"],
        ["Technological", bd.pestel.technological || "—"],
        ["Environmental", bd.pestel.environmental || "—"],
        ["Legal", bd.pestel.legal || "—"],
      ]
    ),

    pageBreak(),

    // ── 3. INDUSTRY ANALYSIS ─────────────────────────────────────────────────
    h1("3. INDUSTRY ANALYSIS", "sec-3"),
    h2("3.1 Global Market Overview"),
    ...(ma.globalMarketSize2024 > 0 || ma.globalMarketSize2030 > 0
      ? [para(
          `The global market for ${industry} is estimated at $${fmtD(ma.globalMarketSize2024, 2)} billion in 2024, ` +
          `growing to $${fmtD(ma.globalMarketSize2025, 2)} billion in 2025, ` +
          `and projected to reach $${fmtD(ma.globalMarketSize2030, 2)} billion by 2030.`
        )]
      : []),
    ...(ai.industryAnalysis
      ? ai.industryAnalysis.split("\n\n").filter(Boolean).map((p) => para(p))
      : [para(`The ${industry} industry is undergoing rapid transformation globally, driven by technology, changing consumer behaviour, and market dynamics.`)]),
    h2("3.2 Local Market Context"),
    ...(ma.gdpContribution > 0 || ma.employmentPercentage > 0
      ? [para(
          `The sector contributes approximately ${ma.gdpContribution}% of GDP and employs around ${ma.employmentPercentage}% of the workforce${ci.location ? ` in ${ci.location}` : ""}.`
        )]
      : []),
    ...(ai.localMarketContext
      ? ai.localMarketContext.split("\n\n").filter(Boolean).map((p) => para(p))
      : [para(`${ci.location ? `In ${ci.location}, the` : "The"} local ${industry} sector presents a strong opportunity driven by growing demand, improved infrastructure, and increasing digital adoption.`)]),

    pageBreak(),

    // ── 4. MARKET ANALYSIS ───────────────────────────────────────────────────
    h1("4. MARKET ANALYSIS", "sec-4"),
    ...(ai.marketContext
      ? ai.marketContext.split("\n\n").filter(Boolean).map((p) => para(p))
      : []),
    h2("4.1 Customer Segmentation"),
    ...(ma.targetSegments.filter((s) => s.name).length > 0
      ? ma.targetSegments.filter((s) => s.name).map((s) => para(`${s.name}: ${s.description || "—"}`))
      : [para("—")]),
    h2("4.2 Competitor Analysis"),
    makeTable(
      ["Competitor", "Description"],
      ma.competitors.filter((c) => c.name).length > 0
        ? ma.competitors.filter((c) => c.name).map((c) => [c.name, c.description || "—"])
        : [["—", "—"]]
    ),
    h2("4.3 Marketing Strategy"),
    ...(ma.marketingStrategies.filter(Boolean).length > 0
      ? ma.marketingStrategies.filter(Boolean).map((s) => bullet(s))
      : [para("—")]),
    h2("4.4 Distribution Channels"),
    ...(ma.distributionChannels.filter(Boolean).length > 0
      ? ma.distributionChannels.filter(Boolean).map((s) => bullet(s))
      : [para("—")]),

    pageBreak(),

    // ── 5. MANAGEMENT TEAM ───────────────────────────────────────────────────
    h1("5. MANAGEMENT TEAM", "sec-5"),
    tableCaption(`Table 3. ${ci.companyName}: Management Team`, "tbl-3"),
    makeTable(
      ["Role", "Count", `Monthly Salary (${cur})`, `Annual Salary (${cur})`, "Responsibilities"],
      staff.map((s) => [
        s.role,
        String(s.count),
        fmt(s.salaryPerEmployee),
        fmt(s.salaryPerEmployee * s.count * 12),
        s.responsibilities || "—",
      ])
    ),

    pageBreak(),

    // ── 6. FINANCIAL ANALYSIS ────────────────────────────────────────────────
    h1("6. FINANCIAL ANALYSIS", "sec-6"),

    h2("6.1 Capital Expenses (CAPEX)"),
    tableCaption("Table 4. Capital Expenses (CAPEX)", "tbl-4"),
    makeTable(
      ["Item", "Quantity", `Cost Per Unit (${cur})`, `Total Cost (${cur})`],
      [
        ...fin.capex.filter((c) => c.item).map((c) => [c.item, String(c.quantity), fmt(c.costPerUnit), fmt(c.quantity * c.costPerUnit)]),
        ["Total", "", "", fmt(results.capexTotal)],
      ]
    ),

    h2("6.2 Operating Expenses (OPEX)"),
    tableCaption("Table 5. Operating Expenses (OPEX)", "tbl-5"),
    makeTable(
      ["Operating Costs", "Growth Rate", ...yCols(projYears, cur)],
      [
        ...results.opexRows.map((r) => {
          const item = fin.opexItems.find((i) => i.item === r.item);
          return [r.item, item ? `${(item.growthRate * 100).toFixed(0)}%` : "0%", ...yArr(r.values, projYears)];
        }),
        ["Total Operating Expenses", "", ...yArr(results.totalOpex, projYears)],
      ]
    ),
    ...chartFigure(charts.opexBreakdown, "Figure 1. Annual Operating Expenses Breakdown (Year 1)", "fig-1"),

    h2("6.3 Revenue Forecast"),
    tableCaption("Table 6. Revenue Forecast", "tbl-6"),
    makeTable(
      ["Product / Service", "Package", "Growth Rate", ...yCols(projYears, cur)],
      [
        ...results.revenueRows.map((r) => {
          const pkg = fin.revenuePackages.find((p) => p.packageName === r.packageName);
          return [r.product, r.packageName, pkg ? `${(pkg.growthRate * 100).toFixed(0)}%` : "10%", ...yArr(r.values, projYears)];
        }),
        ["Total Revenue", "", "", ...yArr(results.totalRevenue, projYears)],
      ]
    ),
    ...chartFigure(charts.revenue, `Figure 2. ${projYears}-Year Revenue vs Operating Expenses Forecast`, "fig-2"),

    h2("6.4 Cash Flows"),
    tableCaption("Table 7. Projected Cash Flows", "tbl-7"),
    makeTable(
      ["Category", ...yCols(projYears, cur)],
      [
        ["Beginning Cash Balance", ...yArr(results.cashFlow.beginningBalance, projYears)],
        ["Total Cash Inflows", ...yArr(results.cashFlow.totalInflows, projYears)],
        ["Total Cash Outflows", ...yArr(results.cashFlow.totalOutflows, projYears)],
        ["Net Cash Flow", ...yArr(results.cashFlow.netCashFlow, projYears)],
        ["Ending Balance", ...yArr(results.cashFlow.endingBalance, projYears)],
      ]
    ),
    ...chartFigure(charts.cashFlow, `Figure 3. ${projYears}-Year Cash Flow Projection`, "fig-3"),

    h2("6.5 Income Statement"),
    tableCaption("Table 8. Income Statement", "tbl-8"),
    makeTable(
      ["Income", ...yCols(projYears, cur)],
      [
        ...results.revenueRows.map((r) => [r.product + ": " + r.packageName, ...yArr(r.values, projYears)]),
        ["Income Before Tax", ...yArr(results.totalRevenue, projYears)],
        ["Total Cost of Sales", ...yArr(results.incomeStatement.totalCostOfSales, projYears)],
        ["Gross Margin", ...yArr(results.incomeStatement.grossMargin, projYears)],
        ["Total Salaries & Wages", ...yArr(results.incomeStatement.totalSalaries, projYears)],
        ["Total Fixed Business Expenses", ...yArr(results.incomeStatement.totalFixedExpenses, projYears)],
        ["Commercial Loan", ...yArr(results.incomeStatement.commercialLoan, projYears)],
        ["Total Expenses", ...yArr(results.incomeStatement.totalExpenses, projYears)],
        ["Net Income Before Tax", ...yArr(results.incomeStatement.netIncomeBeforeTax, projYears)],
        [`CIT (${(fin.citRate * 100).toFixed(0)}%)`, ...yArr(results.incomeStatement.cit, projYears)],
        ["Net Income After Tax", ...yArr(results.incomeStatement.netIncomeAfterTax, projYears)],
      ]
    ),
    ...chartFigure(charts.incomeSummary, "Figure 4. Income Statement Summary: Revenue, Gross Margin and Net Income", "fig-4"),
    ...chartFigure(charts.netIncome, `Figure 5. Revenue vs Net Income After Tax (${projYears}-Year)`, "fig-5"),

    h2("6.6 Payroll Summary"),
    tableCaption("Table 9. Payroll Summary", "tbl-9"),
    makeTable(
      ["Role", "Pension/mo", "Health Ins/mo", "Other/mo", "Total Deductions/mo", "Income Tax/mo", `Net Salary/mo (${cur})`],
      [
        ...results.staffRows.map((r) => [
          r.role,
          fmt(r.rssbPension),
          fmt(r.healthInsurance),
          fmt(r.maternity),
          fmt(r.totalCompensation),
          fmt(r.payrollTax),
          fmt(r.netSalary),
        ]),
        [
          "TOTAL",
          fmt(results.staffRows.reduce((s, r) => s + r.rssbPension * r.count, 0)),
          fmt(results.staffRows.reduce((s, r) => s + r.healthInsurance * r.count, 0)),
          fmt(results.staffRows.reduce((s, r) => s + r.maternity * r.count, 0)),
          "",
          fmt(results.payrollTaxTotal),
          "",
        ],
      ]
    ),

    h2(`6.7 Estimated Government Revenue (${projYears} Years)`),
    tableCaption("Table 10. Estimated Government Revenues", "tbl-10"),
    makeTable(
      [`All figures in ${cur}`, ...yColsPlain(projYears)],
      [
        ["Corporate Income Tax (CIT)", ...yArr(results.gorRevenue.cit, projYears)],
        ["Income Tax (Labor)", ...yArr(results.gorRevenue.incomeTaxLabor, projYears)],
        ["Social Security (Pension)", ...yArr(results.gorRevenue.rssb, projYears)],
        ["Total Government Revenue", ...yArr(results.gorRevenue.total, projYears)],
      ]
    ),

    h2("6.8 Net Present Value (NPV) & IRR"),
    tableCaption("Table 11. Net Present Values", "tbl-11"),
    makeTable(
      ["Year", "Year 0", ...yColsPlain(projYears)],
      [
        ["Investment", fmt(-results.capexTotal), ...yEmpty(projYears)],
        ["Revenues", "", ...yArr(results.totalRevenue, projYears)],
        ["Total Costs", "", ...yArr(results.incomeStatement.totalExpenses, projYears)],
        ["Net Cash Flow", fmt(-results.capexTotal), ...yArr(results.npv.netCashFlow, projYears)],
        ["PV", "", ...yArr(results.npv.pv, projYears)],
        [`NPV (${(fin.discountRate * 100).toFixed(0)}% discount)`, fmt(results.npv.npvTotal), ...yEmpty(projYears)],
        ["IRR", `${(results.npv.irr * 100).toFixed(1)}%`, ...yEmpty(projYears)],
      ]
    ),

    h2("6.9 Cost-Benefit Ratio"),
    tableCaption("Table 12. Cost-Benefit Ratio", "tbl-12"),
    makeTable(
      ["Year", ...yColsPlain(projYears)],
      [
        [`PV Benefit (${cur})`, ...yArr(results.cba.pvBenefit, projYears)],
        [`PV Cost (${cur})`, ...yArr(results.cba.pvCost, projYears)],
        ["B/C Ratio", ...yArrD(results.cba.bcRatio, projYears)],
      ]
    ),

    h2("6.10 Payback Period"),
    tableCaption("Table 13. Payback Period", "tbl-13"),
    makeTable(
      ["Year", "Year 0", ...yColsPlain(projYears)],
      [
        ["Cash Flow", fmt(-results.capexTotal), ...yArr(results.cashFlow.netCashFlow, projYears)],
        ["Cumulated", ...yArr(results.payback.cumulatedCashFlow, projYears), ""],
      ]
    ),
    para(
      results.payback.years > 0
        ? `Payback Period: ${results.payback.years.toFixed(2)} years = ${fmtD(results.payback.months, 1)} months = ${fmtD(results.payback.days, 0)} days`
        : "Payback Period: Investment recoverable within the projection period."
    ),

    h2("6.11 Profit and Loss Statement"),
    tableCaption("Table 14. Profit and Loss Statement", "tbl-14"),
    makeTable(
      [`Revenues (${cur})`, ...yColsPlain(projYears)],
      [
        ["Annual Revenue", ...yArr(results.pnl.annualRevenue, projYears)],
        ["Operating Expenses", ...yArr(results.pnl.operatingExpenses, projYears)],
        ["Gross Revenue", ...yArr(results.pnl.grossRevenue, projYears)],
      ]
    ),

    h2("6.12 Cost-Revenue Ratio"),
    tableCaption("Table 15. Cost-Revenue Ratio", "tbl-15"),
    makeTable(
      ["Description", ...yColsPlain(projYears)],
      [
        [`Total Revenue (${cur})`, ...yArr(results.crr.totalRevenue, projYears)],
        ["Operating Expenses", ...yArr(results.crr.operatingExpenses, projYears)],
        ["CRR", ...yArrD(results.crr.crr, projYears)],
      ]
    ),

    // Product manufacturing costs
    ...(hasProducts && mfgProducts.length > 0 && mfgTblAnchor
      ? [
          h2("6.13 Product Manufacturing Costs"),
          ...mfgProducts.flatMap((product, idx) => {
            const pr = results.productResults[idx];
            if (!pr) return [];
            return [
              h3(`Product ${idx + 1}: ${product.name}`),
              makeTable(
                ["Component / Material", "Quantity", `Cost/Unit (${cur})`, `Total (${cur})`],
                [
                  ...product.components.filter((c) => c.item).map((c) => [c.item, String(c.quantity), fmt(c.costPerUnit), fmt(c.quantity * c.costPerUnit)]),
                  ["Grand Total", "", "", fmt(pr.totalCost)],
                ]
              ),
              para(`Batch Size: ${product.batchSize} units  |  Unit Cost: ${fmt(Math.round(pr.unitCost))} ${cur}`),
            ];
          }),
        ]
      : []),

    // Service offerings
    ...(hasSvc && svcTblAnchor
      ? [
          h2(`${hasProducts ? "6.14" : "6.13"} Service Offerings`),
          tableCaption(svcTblLabel, svcTblAnchor),
          makeTable(
            ["Service Name", "Type", "Delivery Model", "Pricing Model", "Description"],
            svcOfferings.filter((s) => s.name).map((s) => [
              s.name,
              s.serviceType,
              s.deliveryModel,
              s.pricingModel,
              s.description || "—",
            ])
          ),
        ]
      : []),

    // Break-even
    ...(hasProducts && bepTblAnchor
      ? [
          h2("6.14 Break-Even Point Analysis"),
          tableCaption(bepTblLabel, bepTblAnchor),
          makeTable(
            ["Break-Even Analysis", "Value"],
            [
              ["Fixed Cost (CAPEX)", `${fmt(results.breakEven.fixedCost)} ${cur}`],
              ["Selling Price Per Unit", `${fmt(results.breakEven.sellingPricePerUnit)} ${cur}`],
              ["Variable Cost Per Unit", `${fmt(results.breakEven.variableCostPerUnit)} ${cur}`],
              ["Break-Even Units", fmtD(results.breakEven.bepUnits, 0)],
              ["Break-Even Sales Value", `${fmt(results.breakEven.bepSalesValue)} ${cur}`],
            ]
          ),
          ...chartFigure(charts.breakEven, "Figure 6. Break-Even Analysis: Cost vs Revenue", "fig-6"),
        ]
      : []),

    // Proforma balance sheet
    h2(`${hasProducts ? "6.15" : hasSvc ? "6.14" : "6.13"} Proforma Balance Sheet`),
    tableCaption(bsTblLabel, bsTblAnchor),
    makeTable(
      ["Category", ...yCols(projYears, cur)],
      [
        ["CURRENT ASSETS", ...yEmpty(projYears)],
        ["Cash and Cash Equivalents", ...yArr(results.balanceSheet.cashAndEquivalents, projYears)],
        ["Accounts Receivable", ...yArr(results.balanceSheet.accountsReceivable, projYears)],
        ["Inventory", ...yArr(results.balanceSheet.inventory, projYears)],
        ["Prepaid Expenses", ...yArr(results.balanceSheet.prepaidExpenses, projYears)],
        ["Total Current Assets", ...yArr(results.balanceSheet.totalCurrentAssets, projYears)],
        ["NON-CURRENT ASSETS", ...yEmpty(projYears)],
        ["Property, Plant & Equipment", ...yArr(results.balanceSheet.ppe, projYears)],
        ["Software / Technology Development", ...yArr(results.balanceSheet.softwareDev, projYears)],
        ["Total Non-Current Assets", ...yArr(results.balanceSheet.totalNonCurrentAssets, projYears)],
        ["Total Assets", ...yArr(results.balanceSheet.totalAssets, projYears)],
        ["LIABILITIES", ...yEmpty(projYears)],
        ["Accounts Payable", ...yArr(results.balanceSheet.accountsPayable, projYears)],
        ["Commercial Loan", ...yArr(results.balanceSheet.commercialLoan, projYears)],
        ["Deferred Revenue", ...yArr(results.balanceSheet.deferredRevenue, projYears)],
        ["Total Liabilities", ...yArr(results.balanceSheet.totalLiabilities, projYears)],
        ["EQUITY", ...yEmpty(projYears)],
        ["Founder Capital", ...yArr(results.balanceSheet.founderCapital, projYears)],
        ["Retained Earnings", ...yArr(results.balanceSheet.retainedEarnings, projYears)],
        ["Total Equity", ...yArr(results.balanceSheet.totalEquity, projYears)],
        ["Total Liabilities + Equity", ...yArr(results.balanceSheet.totalLiabilitiesAndEquity, projYears)],
      ]
    ),

    pageBreak(),

    // ── 7. RISK ANALYSIS ─────────────────────────────────────────────────────
    h1("7. RISK ANALYSIS", "sec-7"),
    h2("7.1 Operational Risks"),
    makeTable(
      ["Risk", "Potential Impact", "Likelihood", "Severity", "Mitigation"],
      [
        ["Equipment failure or disruption", "Downtime, reduced efficiency", "Medium", "High", "Regular maintenance, backup systems, staff training"],
        ["Staff turnover", "Workflow disruption, knowledge loss", "Medium", "Medium", "Competitive compensation, documentation, succession planning"],
        ["Cybersecurity breaches", "Data loss, reputational damage", "Low", "High", "Regular IT audits, access controls, data encryption"],
      ]
    ),
    h2("7.2 Supply Chain Risks"),
    makeTable(
      ["Risk", "Potential Impact", "Likelihood", "Severity", "Mitigation"],
      [
        ["Supplier delays", "Halt in production or service delivery", "Medium", "High", "Diversify suppliers, maintain safety stock"],
        ["Quality issues from suppliers", "Rework, customer dissatisfaction", "Medium", "Medium", "Supplier audits, quality agreements"],
      ]
    ),
    h2("7.3 Market Risks"),
    makeTable(
      ["Risk", "Potential Impact", "Likelihood", "Severity", "Mitigation"],
      [
        ["New competitors", "Market share reduction", "High", "Medium", "Strong branding, customer loyalty, continuous innovation"],
        ["Economic downturn", "Reduced spending, delayed payments", "Medium", "High", "Cost optimization, diversified revenue streams"],
        ["Price volatility", "Margin pressure", "Medium", "Medium", "Price hedging, flexible contracts"],
      ]
    ),
    h2("7.4 Financial Risks"),
    makeTable(
      ["Risk", "Potential Impact", "Likelihood", "Severity", "Mitigation"],
      [
        ["Cash flow shortages", "Inability to meet obligations", "Medium", "High", "Cash flow forecasting, revolving credit lines"],
        ["High operational costs", "Reduced profit margins", "Medium", "Medium", "Process optimization, cost controls"],
        ["Insufficient funding", "Limited growth", "Low", "High", "Investor relations, grant applications, alternative financing"],
      ]
    ),

    pageBreak(),

    // ── 8. CONCLUSION ────────────────────────────────────────────────────────
    h1("8. CONCLUSION", "sec-8"),
    ...(ai.conclusion
      ? ai.conclusion.split("\n\n").filter(Boolean).map((p) => para(p))
      : [
          para(
            `In conclusion, ${ci.productName || ci.companyName} represents a compelling business opportunity in ${industry}. ` +
            `${ci.companyName} has identified a clear market need, assembled a capable team, and developed a financially sound plan ` +
            `to achieve sustainable growth and profitability.`
          ),
          para(
            (results.payback.years > 0
              ? `With a projected payback period of approximately ${results.payback.years.toFixed(2)} years and ` : "") +
            `Year ${projYears} revenues of ${fmt(results.totalRevenue[Math.min(projYears, results.totalRevenue.length) - 1] ?? 0)} ${cur}, ` +
            `${ci.productName || ci.companyName} presents a strong investment case ` +
            `with an IRR of ${(results.npv.irr * 100).toFixed(1)}% and an NPV of ${fmt(results.npv.npvTotal)} ${cur}.`
          ),
          para(
            `The company is committed to its mission of ${bd.mission || "delivering value to its customers and stakeholders"}, ` +
            `and is well-positioned to execute its strategy and achieve its vision of ${bd.vision || "becoming a leader in its market"}.`
          ),
        ]),

    pageBreak(),

    // ── 9. REFERENCES ────────────────────────────────────────────────────────
    h1("9. REFERENCES", "sec-9"),
    ...(ai.references
      ? [
          ...ai.references.split("\n").filter((r) => r.trim()).map((ref) => refPara(ref)),
        ]
      : [
          refPara(`${industry} Market Research Reports: Industry analysts and market intelligence platforms.`),
          refPara(`National Statistics Office / Central Bank publications, ${ci.location || "Country"}.`),
          refPara(`Company internal projections and market validation studies.`),
          refPara(`Financial modelling assumptions based on industry benchmarks and management estimates.`),
          ...(ci.website ? [refPara(`${ci.companyName} official website: ${ci.website}`)] : []),
        ]),
  ];

  // ─── Assemble document ────────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: TNR, size: 24 },
          paragraph: { spacing: { line: 360, lineRule: LineRuleType.AUTO, after: 120 } },
        },
      },
    },
    sections: [
      // Section 1 — Cover page: no footer, no page numbers
      {
        children: coverChildren,
      },

      // Section 2 — Front matter (TOC, LOT, LOF): roman numeral footer
      {
        properties: {
          page: {
            pageNumbers: {
              start: 1,
              formatType: NumberFormat.LOWER_ROMAN,
            },
          },
        },
        footers: { default: makeFooter() },
        children: frontMatterChildren,
      },

      // Section 3 — Main content: arabic page numbers starting at 1
      {
        properties: {
          page: {
            pageNumbers: {
              start: 1,
              formatType: NumberFormat.DECIMAL,
            },
          },
        },
        footers: { default: makeFooter() },
        children: mainChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer as unknown as Buffer;
}
