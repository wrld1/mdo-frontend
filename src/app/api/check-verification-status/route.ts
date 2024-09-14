import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const needsVerification = cookieStore.get("needsVerification");

  if (needsVerification) {
    cookieStore.delete("needsVerification");
    return NextResponse.json({ needsVerification: true });
  } else {
    return NextResponse.json({ needsVerification: false });
  }
}
