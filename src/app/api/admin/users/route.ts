import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Submission } from "@/models/Submission";
import { UserCredit } from "@/models/UserCredit";
import { requireRole } from "@/lib/roleGuard";

export const maxDuration = 30;

export async function GET() {
  try {
    await requireRole("admin");
    await connectDB();

    const client = await clerkClient();
    const [userList, submissionCounts, creditDocs] = await Promise.all([
      client.users.getUserList({ limit: 500, orderBy: "-created_at" }),
      Submission.aggregate([
        { $group: { _id: "$userId", count: { $sum: 1 }, lastCreated: { $max: "$createdAt" } } },
      ]),
      UserCredit.find({}, { userId: 1, credits: 1 }).lean(),
    ]);

    const countMap = new Map(
      submissionCounts.map((s: { _id: string; count: number; lastCreated: Date }) => [
        s._id,
        { count: s.count, lastCreated: s.lastCreated },
      ])
    );

    const creditMap = new Map(
      (creditDocs as { userId: string; credits: number }[]).map((c) => [c.userId, c.credits])
    );

    const users = userList.data.map((u) => {
      const stats = countMap.get(u.id);
      return {
        id: u.id,
        name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—",
        email: u.emailAddresses[0]?.emailAddress ?? "—",
        role: (u.publicMetadata?.role as string) ?? "user",
        submissionCount: stats?.count ?? 0,
        lastActive: (() => {
          const times: number[] = [];
          if (stats?.lastCreated) times.push(new Date(stats.lastCreated).getTime());
          if (u.lastSignInAt) times.push(u.lastSignInAt);
          return times.length ? Math.max(...times) : (u.createdAt ?? Date.now());
        })(),
        createdAt: u.createdAt,
        imageUrl: u.imageUrl,
        credits: creditMap.get(u.id) ?? 0,
      };
    });

    return NextResponse.json({ users, total: userList.totalCount });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[/api/admin/users]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
