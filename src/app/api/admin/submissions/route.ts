import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Submission } from "@/models/Submission";
import { requireRole } from "@/lib/roleGuard";

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  try {
    await requireRole("admin");
    await connectDB();

    const url = req.nextUrl;
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 100);
    const search = url.searchParams.get("search") ?? "";

    const query: Record<string, unknown> = {};
    if (search) {
      query["$or"] = [
        { "companyInfo.companyName": { $regex: search, $options: "i" } },
        { "companyInfo.companyFocus": { $regex: search, $options: "i" } },
      ];
    }

    const [docs, total] = await Promise.all([
      Submission.find(query, {
        userId: 1,
        "companyInfo.companyName": 1,
        "companyInfo.productName": 1,
        "companyInfo.companyFocus": 1,
        "companyInfo.location": 1,
        "companyInfo.currency": 1,
        createdAt: 1,
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Submission.countDocuments(query),
    ]);

    // Enrich with user names from Clerk
    const uniqueUserIds = [...new Set((docs as { userId: string }[]).map((d) => d.userId))];
    const client = await clerkClient();
    const userMap = new Map<string, string>();
    await Promise.all(
      uniqueUserIds.map(async (uid) => {
        try {
          const u = await client.users.getUser(uid);
          userMap.set(uid, `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.emailAddresses[0]?.emailAddress || uid);
        } catch {
          userMap.set(uid, uid);
        }
      })
    );

    const enriched = (docs as {
      _id: unknown; userId: string; companyInfo?: Record<string, string>; createdAt?: Date
    }[]).map((d) => ({
      ...d,
      userName: userMap.get(d.userId) ?? d.userId,
    }));

    return NextResponse.json({ submissions: enriched, total, page, limit });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[/api/admin/submissions]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
