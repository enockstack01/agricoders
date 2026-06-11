import { auth, clerkClient } from "@clerk/nextjs/server";

export type Role = "user" | "admin" | "super_admin";

export async function getSessionRole(): Promise<{ userId: string; role: Role } | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = (user.publicMetadata?.role as Role | undefined) ?? "user";
  return { userId, role };
}

export async function requireRole(minRole: Role): Promise<{ userId: string; role: Role }> {
  const session = await getSessionRole();
  if (!session) throw new Error("UNAUTHORIZED");
  const order: Role[] = ["user", "admin", "super_admin"];
  if (order.indexOf(session.role) < order.indexOf(minRole)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export function roleLabel(role: Role): string {
  return role === "super_admin" ? "Super Admin" : role === "admin" ? "Admin" : "User";
}
