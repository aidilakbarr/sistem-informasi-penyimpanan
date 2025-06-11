import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { createAccessToken, createRefreshToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import sendVerificationEmail from "@/utils/sendEmailVerification";
import { generateEmailToken } from "@/utils/generateOTP";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const loginSchema = z.object({
    email: z.string().email({ message: "Email tidak valid" }),
    password: z.string().min(8, { message: "Password minimal 8 karakter" }),
  });

  try {
    const body = await req.json();
    const { email, password } = body;

    const parsedData = loginSchema.safeParse({
      email,
      password,
    });

    if (!parsedData.success) {
      return NextResponse.json(
        { message: parsedData.error.errors },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email tidak terdaftar" },
        { status: 400 }
      );
    }

    const token = await generateEmailToken();

    if (!user.emailVerified) {
      await sendVerificationEmail(email, token);
      return NextResponse.json(
        { message: "Silahkan cek email anda untuk menverifikasi akun anda" },
        { status: 400 }
      );
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Email atau Password tidak valid" },
        { status: 401 }
      );
    }
    const accessToken = await createAccessToken(user);
    const refreshToken = await createRefreshToken(user);

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 30,
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      { message: "Login Berhasil", accessToken, id: user.id, user },
      { status: 200 }
    );
  } catch (error) {
    console.log("[POST LOGIN: ]", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
