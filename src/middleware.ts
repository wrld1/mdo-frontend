import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyUser } from "./utils/functions.server";
import { cookies } from "next/headers";
import { timestampToDate } from "./lib/utils";
import { decrypt } from "./lib/auth";
import { getUserAction } from "./actions/get-user-action";
import { sendVerificationAction } from "./actions/send-verification-action";

export async function middleware(req: NextRequest) {
  const { isAuth, userId } = await verifyUser();
  const refreshToken = cookies().get("refreshToken")?.value;

  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (!isAuth || !userId) {
    const refreshResponse = await fetch(`${req.nextUrl.origin}/api/refresh`, {
      method: "GET",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (refreshResponse.ok) {
      const { accessToken } = await refreshResponse.json();
      const response = NextResponse.next();

      const payload = await decrypt(accessToken);

      req.headers.set("Authorization", `Bearer ${accessToken}`);

      response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: timestampToDate(payload?.exp as number),
        sameSite: "lax",
        path: "/",
      });

      return response;
    } else {
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }
  }

  if (isProtectedRoute && isAuth && userId) {
    try {
      const user = await getUserAction(userId);
      if (!user.isVerified) {
        await sendVerificationAction({ email: user.email });
        const response = NextResponse.next();
        response.cookies.set("showVerificationToast", "true", {
          maxAge: 5000,
          path: "/",
        });
        return response;
      }
    } catch (error) {
      console.error("Error in middleware:", error);
      return NextResponse.next();
    }
  }

  if (isProtectedRoute && (!isAuth || !userId)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
