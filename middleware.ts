import { NextRequest, NextResponse } from "next/server";
import {
  createAccessToken,
  User,
  verifyAccessToken,
  verifyRefreshToken,
} from "./lib/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }
  const accessToken = req.cookies.get("accessToken")?.value || "";
  const refreshToken = req.cookies.get("refreshToken")?.value || "";

  try {
    const decoded = await verifyAccessToken(accessToken);

    if (!decoded) {
      throw new Error("Invalid or expired access token.");
    }

    return NextResponse.next();
  } catch (error) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    try {
      const decoded = await verifyRefreshToken(refreshToken);

      if (!decoded || typeof decoded !== "object") {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      const user: User = {
        id: decoded.id as string,
        name: decoded.name as string,
        email: decoded.email as string,
        role: decoded.role as string,
      };

      const newAccessToken = await createAccessToken(user);

      const response = NextResponse.next();
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 30,
        sameSite: "strict",
      });

      return response;
    } catch (error) {
      console.log("[ERROR_MIDDLEWARE: ]", error);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }
}

export const config = {
  matcher: ["/((?!auth|_next|static|favicon.ico|api|^/$).*)"],
};
