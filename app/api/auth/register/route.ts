import { NextResponse } from "next/server";
import * as z from "zod";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { cookies } from "next/headers";
import sendVerificationEmail from "@/utils/sendEmailVerification";
import { generateEmailToken, generateOTPExpired } from "@/utils/generateOTP";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const cookieStore = await cookies();

  const registerSchema = z.object({
    name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
    email: z.string().email({ message: "Email tidak valid" }),
    password: z.string().min(8, {
      message: "Password harus lebih dari 8 karakter",
    }),
  });

  try {
    const body = await req.json();
    const { name, email, password } = body;

    const parsedData = registerSchema.safeParse({
      name,
      email,
      password,
    });

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.errors },
        {
          status: 400,
        }
      );
    }

    const userIsExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const token = await generateEmailToken();
    const tokenExpired: Date = generateOTPExpired();
    const hashedPassword = await argon2.hash(password);

    if (userIsExist && !userIsExist.emailVerified) {
      await prisma.user.update({
        where: { id: userIsExist.id },
        data: {
          verificationToken: token,
          verificationTokenExpires: tokenExpired,
          name: name,
          password: hashedPassword,
        },
      });
      cookieStore.set("email", email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 30,
      });
      await sendVerificationEmail(email, token);
      return NextResponse.json(
        { message: "Verification Email Sending in your gmail" },
        { status: 200 }
      );
    }

    if (userIsExist) {
      return NextResponse.json(
        { error: "Akun sudah terdaftar, silahkan ke halaman login" },
        { status: 400 }
      );
    }

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        verificationToken: token,
        verificationTokenExpires: tokenExpired,
        password: hashedPassword,
        role: "USER",
      },
    });

    cookieStore.set("email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 30,
    });

    await sendVerificationEmail(email, token);

    return NextResponse.json(
      { message: "Verification email sending..." },
      { status: 201 }
    );
  } catch (error) {
    console.log("[REGISTER POST]: ", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
