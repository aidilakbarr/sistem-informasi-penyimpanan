import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { createAccessToken, createRefreshToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const cookiesList = await cookies();
  const email = cookiesList.get("email")?.value;
  const { token } = body;

  if (!email) {
    return NextResponse.json(
      { message: "User belum register" },
      { status: 401 }
    );
  }

  if (!token) {
    return NextResponse.json(
      { message: "Token tidak ditemukan" },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "email is verified", user },
        { status: 200 }
      );
    }

    if (token !== user.verificationToken) {
      return NextResponse.json({ message: "Token invalid" }, { status: 400 });
    }

    if (
      user.verificationTokenExpires === null ||
      user.verificationTokenExpires < new Date()
    ) {
      return NextResponse.json(
        { message: "Verification Token Expired" },
        { status: 400 }
      );
    }

    const newAccessToken = await createAccessToken(user);
    const refreshToken = await createRefreshToken(user);

    await prisma.user.update({
      where: { email: user.email },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    cookiesList.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 30,
    });

    cookiesList.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      { message: "Akun sukses dibuat", id: user.id, user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
