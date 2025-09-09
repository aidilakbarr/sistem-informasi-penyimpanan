import { createAccessToken, User, verifyRefreshToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookiesList = await cookies();
  const refreshToken = cookiesList.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "User belum login" }, { status: 401 });
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

    cookiesList.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 30,
    });

    return NextResponse.json({ message: "Token di refresh" }, { status: 200 });
  } catch (error: any) {
    console.log("[REFRESH_ROUTE: ]", error.message);
    return NextResponse.json({ message: error.message });
  }
}
