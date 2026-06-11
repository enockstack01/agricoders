import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { UserProfileModel } from "@/models/UserProfile";
import { UserProfileDefaults } from "@/types";

const DEFAULT_PROFILE: UserProfileDefaults = {
  currency: "USD",
  location: "",
  companyType: "Private Limited Company",
  industry: "",
  authorTitle: "Founder & CEO",
  citRate: 0.30,
  rssbRate: 0.05,
  healthInsuranceRate: 0.00,
  maternityRate: 0.00,
  discountRate: 0.12,
  loanRate: 0.12,
  loanTermYears: 5,
};

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const profile = await UserProfileModel.findOne({ userId }).lean();
    if (!profile) {
      return NextResponse.json({ defaults: DEFAULT_PROFILE });
    }
    return NextResponse.json({ defaults: { ...DEFAULT_PROFILE, ...(profile as { defaults?: Partial<UserProfileDefaults> }).defaults } });
  } catch {
    return NextResponse.json({ defaults: DEFAULT_PROFILE });
  }
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const defaults: UserProfileDefaults = {
    currency: body.currency ?? DEFAULT_PROFILE.currency,
    location: body.location ?? "",
    companyType: body.companyType ?? DEFAULT_PROFILE.companyType,
    industry: body.industry ?? "",
    authorTitle: body.authorTitle ?? DEFAULT_PROFILE.authorTitle,
    citRate: Number(body.citRate) || DEFAULT_PROFILE.citRate,
    rssbRate: Number(body.rssbRate) || 0,
    healthInsuranceRate: Number(body.healthInsuranceRate) || 0,
    maternityRate: Number(body.maternityRate) || 0,
    discountRate: Number(body.discountRate) || DEFAULT_PROFILE.discountRate,
    loanRate: Number(body.loanRate) || DEFAULT_PROFILE.loanRate,
    loanTermYears: Number(body.loanTermYears) || DEFAULT_PROFILE.loanTermYears,
  };

  try {
    await connectDB();
    await UserProfileModel.findOneAndUpdate(
      { userId },
      { userId, defaults },
      { upsert: true, new: true }
    );
    return NextResponse.json({ ok: true, defaults });
  } catch (err) {
    console.error("[/api/profile PUT]", err);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
