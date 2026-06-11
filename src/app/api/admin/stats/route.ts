import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Submission } from "@/models/Submission";
import { requireRole } from "@/lib/roleGuard";

export const maxDuration = 30;

export async function GET() {
  try {
    await requireRole("admin");
    await connectDB();

    const client = await clerkClient();
    const [userList, totalSubmissions, allSubmissions] = await Promise.all([
      client.users.getUserList({ limit: 500 }),
      Submission.countDocuments(),
      Submission.find({}, { userId: 1, createdAt: 1 }).lean(),
    ]);

    const totalUsers = userList.totalCount;

    // Plans created in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const plansThisWeek = (allSubmissions as { createdAt?: Date }[]).filter(
      (s) => s.createdAt && new Date(s.createdAt) > sevenDaysAgo
    ).length;

    // Unique active users (users with at least one submission)
    const uniqueUserIds = new Set((allSubmissions as { userId: string }[]).map((s) => s.userId));
    const activeUsers = uniqueUserIds.size;

    // Plans per day over last 7 days (for sparkline)
    const dailyCounts: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      dailyCounts[d.toISOString().slice(0, 10)] = 0;
    }
    (allSubmissions as { createdAt?: Date }[]).forEach((s) => {
      if (s.createdAt && new Date(s.createdAt) > sevenDaysAgo) {
        const key = new Date(s.createdAt).toISOString().slice(0, 10);
        if (key in dailyCounts) dailyCounts[key]++;
      }
    });

    // Admin/super_admin count
    const admins = userList.data.filter(
      (u) => u.publicMetadata?.role === "admin" || u.publicMetadata?.role === "super_admin"
    ).length;

    return NextResponse.json({
      totalUsers,
      totalSubmissions,
      plansThisWeek,
      activeUsers,
      admins,
      dailyCounts,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[/api/admin/stats]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
