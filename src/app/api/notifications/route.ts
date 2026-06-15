import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/models/Notification";

// GET /api/notifications — last 20 notifications for the current user
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error("[/api/notifications GET]", err);
    return NextResponse.json({ error: "Failed to load notifications" }, { status: 500 });
  }
}

// PATCH /api/notifications
// Body { id, read } → toggle one notification
// Body {}           → mark all unread as read
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const body = await req.json().catch(() => ({})) as { id?: string; read?: boolean };

    if (body.id) {
      await Notification.updateOne(
        { _id: body.id, userId },
        { $set: { read: body.read ?? true } }
      );
    } else {
      await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/notifications PATCH]", err);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
