import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { requireRole } from "@/lib/roleGuard";

export const maxDuration = 15;

export async function PUT(req: NextRequest) {
  try {
    const session = await requireRole("super_admin");
    const { userId, role } = await req.json();

    if (!userId || !["user", "admin", "super_admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    // Prevent super_admin from downgrading themselves
    if (userId === session.userId && role !== "super_admin") {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
