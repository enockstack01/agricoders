import { auth, clerkClient } from "@clerk/nextjs/server";

export type Role = "user" | "admin" | "super_admin";

export async function getSessionRole(): Promise<{ userId: string; role: Role } | null> {
  const session = await auth();
  if (!session.userId) return null;
  const meta = session.sessionClaims?.public_metadata as { role?: Role } | undefined;
  let role = meta?.role;
  if (!role) {
    // The session token only carries the role when the Clerk instance adds public_metadata to it
    // (and a token issued before the role was set does not have it), so ask Clerk directly.
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(session.userId);
      role = user.publicMetadata?.role as Role | undefined;
    } catch (err) {
      console.error("[roleGuard] could not read the user role", err);
    }
  }
  return { userId: session.userId, role: role ?? "user" };
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
