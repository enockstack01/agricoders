import { NextResponse } from "next/server";
import { AGRICODERS_APPS } from "@/lib/apps";

export async function GET() {
  return NextResponse.json(
    { platform: "Agricoders", version: "1", apps: AGRICODERS_APPS },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
