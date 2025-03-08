import { oauth2Client } from "@/lib/google";
import { createAccessToken, createRefreshToken } from "@/lib/jwt";
import { PrismaClient } from "@prisma/client";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { message: "Code tidak ditemukan" },
      { status: 400 }
    );
  }

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  const { data } = await oauth2.userinfo.get();

  if (!data || !data.email || !data.name || !data.picture) {
    return NextResponse.json(
      { message: "Data tidak di temukan" },
      { status: 400 }
    );
  }

  const userIsExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (userIsExist) {
    const accessToken = await createAccessToken(userIsExist);
    const refreshToken = await createRefreshToken(userIsExist);

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

    if (userIsExist.role === "USER") {
      return NextResponse.redirect(new URL(`/${userIsExist.id}`, req.url));
    }
    return NextResponse.redirect(new URL(`/store/${userIsExist.id}`, req.url));
  }

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: "USER",
      profilePicture: data.picture,
      emailVerified: true,
      password: "-",
    },
  });

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
  return NextResponse.redirect(new URL(`/mahasiswa/${user.id}`, req.url));
}
