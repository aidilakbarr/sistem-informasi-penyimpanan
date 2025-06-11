import { verifyAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { idMahasiswa: string } }
) {
  try {
    const { idMahasiswa } = await params;

    if (!idMahasiswa) {
      return NextResponse.json(
        { error: "Missing idMahasiswa parameter" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";
    const decoded = await verifyAccessToken(accessToken);
    if (!decoded || decoded.id !== idMahasiswa) {
      return NextResponse.json(
        { error: "Unauthorized", decoded, idMahasiswa },
        { status: 401 }
      );
    }

    const pemesanan = await prisma.pemesanan.findMany({
      where: {
        userId: idMahasiswa,
        paid: false,
        status: "ACCEPTED",
      },
      include: {
        user: true,
      },
    });

    if (!pemesanan) {
      return NextResponse.json(
        { error: "Pemesanan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pemesanan, { status: 200 });
  } catch (error) {
    console.error("[GET_PEMESANAN]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
