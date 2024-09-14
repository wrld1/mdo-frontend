import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendVerificationAction } from "./actions/send-verification-action";
import { getUser } from "./utils/functions.server";
import { getUserAction } from "./actions/get-user-action";
import { revalidatePath } from "next/cache";

export async function middleware(request: NextRequest) {
  const { isAuth, userId } = await getUser();

  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!isAuth || !userId) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // try {
    //   const user = await getUserAction(userId);

    //   if (!user.isVerified) {
    //     await sendVerificationAction({ email: user.email });

    //     const response = NextResponse.redirect(new URL("/", request.url));

    //     response.cookies.set("needsVerification", "true", {
    //       httpOnly: false,
    //       sameSite: "strict",
    //       maxAge: 60 * 5,
    //     });

    //     return response;
    //   }
    // } catch (error) {
    //   console.error("Error in middleware:", error);
    //   return NextResponse.redirect(new URL("/sign-in", request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
