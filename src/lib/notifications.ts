import { connectDB } from "./mongodb";
import type { NotificationType } from "@/models/Notification";

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string
) {
  try {
    await connectDB();
    const { Notification } = await import("@/models/Notification");
    await Notification.create({ userId, type, title, body });
  } catch (e) {
    // Non-fatal — never block the main request flow
    console.error("[notification] Failed to create:", e);
  }
}

export async function notifyAdmins(
  type: NotificationType,
  title: string,
  body: string
) {
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const { data: users } = await client.users.getUserList({ limit: 500 });
    const adminIds = users
      .filter((u) => {
        const role = u.publicMetadata?.role as string | undefined;
        return role === "admin" || role === "super_admin";
      })
      .map((u) => u.id);

    if (adminIds.length === 0) return;

    await connectDB();
    const { Notification } = await import("@/models/Notification");
    await Notification.insertMany(
      adminIds.map((userId) => ({ userId, type, title, body, read: false }))
    );
  } catch (e) {
    console.error("[notification] Failed to notify admins:", e);
  }
}
