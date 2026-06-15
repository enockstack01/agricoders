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
