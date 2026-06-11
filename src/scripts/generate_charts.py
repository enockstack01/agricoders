#!/usr/bin/env python3
"""
Chart generator for Logistackplan business plan documents.
Reads financial data as JSON from stdin, outputs base64-encoded PNG charts as JSON.

Usage: echo '<json>' | python generate_charts.py
Output: { "charts": { "revenue": "<base64>", "cashflow": "<base64>", ... } }
"""

import sys
import json
import io
import base64
import traceback

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

GREEN = "#2E8B57"
DARK_GREEN = "#1A5C3A"
LIGHT_GREEN = "#A8D5B5"
ORANGE = "#E07B39"
BLUE = "#3B82F6"
RED = "#EF4444"
GRAY = "#6B7280"
BG = "#FAFAFA"

def fig_to_b64(fig) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150, bbox_inches="tight", facecolor=BG)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

def fmt_k(val: float) -> str:
    if abs(val) >= 1_000_000:
        return f"{val/1_000_000:.1f}M"
    if abs(val) >= 1_000:
        return f"{val/1_000:.0f}K"
    return str(int(val))

def set_style(ax, title: str, currency: str = ""):
    ax.set_facecolor(BG)
    ax.set_title(title, fontsize=12, fontweight="bold", color=DARK_GREEN, pad=10)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color("#E5E7EB")
    ax.spines["bottom"].set_color("#E5E7EB")
    ax.tick_params(colors=GRAY, labelsize=9)
    if currency:
        ax.set_ylabel(f"Amount ({currency})", fontsize=9, color=GRAY)
    ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda x, _: fmt_k(x)))
    ax.grid(axis="y", color="#E5E7EB", linewidth=0.8, linestyle="--", alpha=0.7)

def get_years(data: dict) -> list:
    n = data.get("projectionYears") or len(data.get("totalRevenue", [1]))
    return [f"Y{i+1}" for i in range(n)]


def chart_revenue_forecast(data: dict) -> str:
    rev = list(data["totalRevenue"])
    opex = list(data["totalOpex"])
    n = min(len(rev), len(opex))
    years = get_years(data)[:n]
    cur = data.get("currency", "")

    x = np.arange(n)
    width = 0.38

    fig, ax = plt.subplots(figsize=(max(6, n * 1.2), 4.5), facecolor=BG)
    bars1 = ax.bar(x - width/2, rev[:n], width, label="Total Revenue", color=GREEN, alpha=0.9, zorder=3)
    bars2 = ax.bar(x + width/2, opex[:n], width, label="Operating Expenses", color=ORANGE, alpha=0.9, zorder=3)

    for bar in bars1:
        h = bar.get_height()
        if h > 0:
            ax.annotate(fmt_k(h), xy=(bar.get_x() + bar.get_width()/2, h),
                        xytext=(0, 3), textcoords="offset points", ha="center", va="bottom",
                        fontsize=7.5, color=DARK_GREEN, fontweight="bold")
    for bar in bars2:
        h = bar.get_height()
        if h > 0:
            ax.annotate(fmt_k(h), xy=(bar.get_x() + bar.get_width()/2, h),
                        xytext=(0, 3), textcoords="offset points", ha="center", va="bottom",
                        fontsize=7.5, color=ORANGE)

    ax.set_xticks(x)
    ax.set_xticklabels(years)
    set_style(ax, f"{n}-Year Revenue vs Operating Expenses Forecast", cur)
    ax.legend(fontsize=9, framealpha=0.8, loc="upper left")
    fig.tight_layout(pad=1.5)
    result = fig_to_b64(fig)
    plt.close(fig)
    return result


def chart_net_income(data: dict) -> str:
    ni = list(data["incomeStatement"]["netIncomeAfterTax"])
    rev = list(data["totalRevenue"])
    n = min(len(ni), len(rev))
    years = get_years(data)[:n]
    cur = data.get("currency", "")

    x = np.arange(n)
    width = 0.35

    fig, ax = plt.subplots(figsize=(max(6, n * 1.2), 4.5), facecolor=BG)
    ax.bar(x - width/2, rev[:n], width, label="Revenue", color=LIGHT_GREEN, alpha=0.95, zorder=3)
    colors_ni = [GREEN if v >= 0 else RED for v in ni[:n]]
    ax.bar(x + width/2, ni[:n], width, label="Net Income After Tax", color=colors_ni, alpha=0.9, zorder=3)
    ax.axhline(0, color=GRAY, linewidth=0.8, linestyle="--")

    ax.set_xticks(x)
    ax.set_xticklabels(years)
    set_style(ax, f"Revenue vs Net Income ({n}-Year Projection)", cur)
    ax.legend(fontsize=9, framealpha=0.8)
    fig.tight_layout(pad=1.5)
    result = fig_to_b64(fig)
    plt.close(fig)
    return result


def chart_cash_flow(data: dict) -> str:
    cf = data["cashFlow"]
    ending = list(cf["endingBalance"])
    net = list(cf["netCashFlow"])
    n = min(len(ending), len(net))
    years = get_years(data)[:n]
    cur = data.get("currency", "")

    fig, ax = plt.subplots(figsize=(max(6, n * 1.2), 4.5), facecolor=BG)
    x = np.arange(n)

    ax.fill_between(x, ending[:n], alpha=0.15, color=GREEN)
    ax.plot(x, ending[:n], marker="o", color=GREEN, linewidth=2.2, label="Ending Balance", zorder=4)
    ax.plot(x, net[:n], marker="s", color=BLUE, linewidth=1.8, linestyle="--", label="Net Cash Flow", zorder=4)
    ax.axhline(0, color=GRAY, linewidth=0.8, linestyle=":")

    for i, v in enumerate(ending[:n]):
        ax.annotate(fmt_k(v), (x[i], v), textcoords="offset points", xytext=(0, 8),
                    ha="center", fontsize=8, color=DARK_GREEN, fontweight="bold")

    ax.set_xticks(x)
    ax.set_xticklabels(years)
    set_style(ax, f"{n}-Year Cash Flow Projection", cur)
    ax.legend(fontsize=9, framealpha=0.8)
    fig.tight_layout(pad=1.5)
    result = fig_to_b64(fig)
    plt.close(fig)
    return result


def chart_opex_breakdown(data: dict) -> str:
    opex_rows = data.get("opexRows", [])
    if not opex_rows:
        return ""
    cur = data.get("currency", "")

    items = [(r["item"] or "Other", r["annual"]) for r in opex_rows if r["annual"] > 0]
    if not items:
        return ""
    items.sort(key=lambda t: t[1], reverse=True)
    labels, values = zip(*items)

    colors = plt.cm.Greens(np.linspace(0.3, 0.85, len(values)))
    fig, ax = plt.subplots(figsize=(8, max(3.5, len(items) * 0.6 + 1)), facecolor=BG)
    bars = ax.barh(range(len(labels)), values, color=colors, alpha=0.9, zorder=3)

    for bar, val in zip(bars, values):
        ax.annotate(fmt_k(val), xy=(val, bar.get_y() + bar.get_height()/2),
                    xytext=(4, 0), textcoords="offset points", va="center", fontsize=8, color=DARK_GREEN)

    ax.set_yticks(range(len(labels)))
    ax.set_yticklabels([l[:30] for l in labels], fontsize=9)
    ax.set_facecolor(BG)
    ax.set_title("Annual Operating Expenses Breakdown (Year 1)", fontsize=12,
                 fontweight="bold", color=DARK_GREEN, pad=10)
    if cur:
        ax.set_xlabel(f"Amount ({cur})", fontsize=9, color=GRAY)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color("#E5E7EB")
    ax.spines["bottom"].set_color("#E5E7EB")
    ax.tick_params(colors=GRAY)
    ax.xaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda x, _: fmt_k(x)))
    ax.grid(axis="x", color="#E5E7EB", linewidth=0.8, linestyle="--", alpha=0.7)
    fig.tight_layout(pad=1.5)
    result = fig_to_b64(fig)
    plt.close(fig)
    return result


def chart_break_even(data: dict) -> str:
    be = data.get("breakEven", {})
    fixed = be.get("fixedCost", 0)
    selling = be.get("sellingPricePerUnit", 0)
    variable = be.get("variableCostPerUnit", 0)
    bep = be.get("bepUnits", 0)
    cur = data.get("currency", "")

    if selling <= 0 or bep <= 0:
        return ""

    max_units = int(bep * 2.2) or 100
    units = np.linspace(0, max_units, 300)
    total_cost = fixed + variable * units
    total_revenue = selling * units

    fig, ax = plt.subplots(figsize=(8, 4.5), facecolor=BG)
    ax.plot(units, total_revenue, color=GREEN, linewidth=2.2, label="Total Revenue", zorder=4)
    ax.plot(units, total_cost, color=RED, linewidth=2.2, linestyle="--", label="Total Cost", zorder=4)
    ax.axhline(fixed, color=ORANGE, linewidth=1.5, linestyle=":", label=f"Fixed Cost ({fmt_k(fixed)} {cur})")
    ax.axvline(bep, color=GRAY, linewidth=1.2, linestyle="--", alpha=0.7)
    ax.scatter([bep], [selling * bep], color=DARK_GREEN, s=90, zorder=5)
    ax.annotate(f"Break-Even\n{int(bep)} units", xy=(bep, selling * bep),
                xytext=(15, -25), textcoords="offset points",
                fontsize=8.5, color=DARK_GREEN, fontweight="bold",
                arrowprops=dict(arrowstyle="->", color=DARK_GREEN, lw=1.2))
    ax.fill_between(units, total_revenue, total_cost,
                    where=(total_revenue >= total_cost), alpha=0.08, color=GREEN, label="Profit Zone")
    ax.fill_between(units, total_revenue, total_cost,
                    where=(total_revenue < total_cost), alpha=0.08, color=RED, label="Loss Zone")
    ax.set_xlabel("Units Sold", fontsize=9, color=GRAY)
    set_style(ax, "Break-Even Analysis", cur)
    ax.legend(fontsize=8.5, framealpha=0.85, loc="upper left")
    fig.tight_layout(pad=1.5)
    result = fig_to_b64(fig)
    plt.close(fig)
    return result


def chart_income_summary(data: dict) -> str:
    ist = data["incomeStatement"]
    rev = list(data["totalRevenue"])
    gross_margin = list(ist["grossMargin"])
    net_income = list(ist["netIncomeAfterTax"])
    n = min(len(rev), len(gross_margin), len(net_income))
    years = get_years(data)[:n]
    cur = data.get("currency", "")

    x = np.arange(n)
    width = 0.25

    fig, ax = plt.subplots(figsize=(max(6, n * 1.2), 4.5), facecolor=BG)
    ax.bar(x - width, rev[:n], width, label="Revenue", color=LIGHT_GREEN, alpha=0.9, zorder=3)
    ax.bar(x,         gross_margin[:n], width, label="Gross Margin", color=GREEN, alpha=0.9, zorder=3)
    ni_colors = [DARK_GREEN if v >= 0 else RED for v in net_income[:n]]
    ax.bar(x + width, net_income[:n], width, label="Net Income (After Tax)", color=ni_colors, alpha=0.9, zorder=3)
    ax.axhline(0, color=GRAY, linewidth=0.8, linestyle="--")

    ax.set_xticks(x)
    ax.set_xticklabels(years)
    set_style(ax, f"Income Statement Summary ({n}-Year)", cur)
    ax.legend(fontsize=9, framealpha=0.8)
    fig.tight_layout(pad=1.5)
    result = fig_to_b64(fig)
    plt.close(fig)
    return result


def main():
    raw = sys.stdin.read().strip()
    if not raw:
        print(json.dumps({"error": "No input data"}))
        sys.exit(1)

    data = json.loads(raw)
    charts = {}

    generators = [
        ("revenue",        chart_revenue_forecast),
        ("netIncome",      chart_net_income),
        ("cashFlow",       chart_cash_flow),
        ("opexBreakdown",  chart_opex_breakdown),
        ("breakEven",      chart_break_even),
        ("incomeSummary",  chart_income_summary),
    ]

    for name, fn in generators:
        try:
            result = fn(data)
            if result:
                charts[name] = result
        except Exception:
            charts[name + "_error"] = traceback.format_exc()

    print(json.dumps({"charts": charts}))


if __name__ == "__main__":
    main()
