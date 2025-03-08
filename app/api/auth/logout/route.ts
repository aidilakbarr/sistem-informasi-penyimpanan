import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    cookieStore.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json({ message: "Berhasil Logout" }, { status: 200 });
  } catch (error) {
    console.log("[LOGOUT: ]", error.message);
    return NextResponse.json(error);
  }
}
