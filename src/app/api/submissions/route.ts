import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB, classifyMongoError } from "@/lib/mongodb";
import { Submission } from "@/models/Submission";

const MONGO_ERROR_MESSAGES: Record<string, string> = {
  CLUSTER_PAUSED:
    "Your MongoDB Atlas free-tier cluster is paused. Log in to cloud.mongodb.com, find your cluster, and click Resume.",
  IP_BLOCKED:
    "Your current IP address is not whitelisted on MongoDB Atlas. Go to Network Access and add your IP.",
  AUTH_FAILED:
    "MongoDB authentication failed. Check the username/password in your MONGODB_URI.",
  NETWORK:
    "Cannot reach MongoDB Atlas. Check your internet connection or firewall settings.",
  UNKNOWN:
    "Database connection failed. Check your MONGODB_URI and Atlas cluster status.",
};

function dbErrorResponse(err: unknown) {
  const code = classifyMongoError(err);
  return NextResponse.json(
    { error: code, message: MONGO_ERROR_MESSAGES[code] },
    { status: 503 }
  );
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const body = await req.json();
    const submission = await Submission.create({ ...body, userId });
    return NextResponse.json({ id: submission._id.toString() }, { status: 201 });
  } catch (err) {
    return dbErrorResponse(err);
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const submissions = await Submission.find({ userId }).sort({ createdAt: -1 }).select("-__v");
    return NextResponse.json(submissions);
  } catch (err) {
    return dbErrorResponse(err);
  }
}
