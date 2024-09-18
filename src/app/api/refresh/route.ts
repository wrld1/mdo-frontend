import { decrypt } from "@/lib/auth";
import { getErrorMessage, timestampToDate } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "No refresh token provided" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/auth/refresh`, {
      method: "GET",
      headers: { cookie: `refreshToken=${refreshToken}` },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const { accessToken } = await response.json();

    const payload = await decrypt(accessToken);

    const res = NextResponse.json({ accessToken });

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      expires: timestampToDate(payload?.exp as number),
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.log(getErrorMessage(error));
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
