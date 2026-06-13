import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { CreditRequest } from "@/models/CreditRequest";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { currentUser } = await import("@clerk/nextjs/server");
  const me = await currentUser();
  const role = me?.publicMetadata?.role as string | undefined;
  if (role !== "admin" && role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "pending";

  await connectDB();

  const filter = status === "all" ? {} : { status };
  const requests = await CreditRequest.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  if (requests.length === 0) return NextResponse.json([]);

  // Enrich with user info from Clerk
  const client = await clerkClient();
  const uniqueUserIds = [...new Set(requests.map((r) => r.userId))];
  const users = await client.users.getUserList({ userId: uniqueUserIds, limit: 100 });
  const userMap = Object.fromEntries(
    users.data.map((u) => [
      u.id,
      {
        name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.emailAddresses[0]?.emailAddress,
        email: u.emailAddresses[0]?.emailAddress,
        imageUrl: u.imageUrl,
      },
    ])
  );

  const enriched = requests.map((r) => ({
    ...r,
    _id: r._id.toString(),
    user: userMap[r.userId] ?? { name: r.userId, email: "", imageUrl: "" },
  }));

  return NextResponse.json(enriched);
}
