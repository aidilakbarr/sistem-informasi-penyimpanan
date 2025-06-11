import { verifyAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(
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

    // Ambil token dari cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";

    // Verifikasi token
    const decoded = await verifyAccessToken(accessToken);
    if (!decoded || decoded.id !== idMahasiswa) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil body dari request
    const body = await req.json();
    const { idPesanan } = body;

    if (!idPesanan) {
      return NextResponse.json(
        { message: "Missing idPesanan" },
        { status: 400 }
      );
    }

    // Update status pembayaran di database
    const pemesanan = await prisma.pemesanan.update({
      data: {
        paid: true, // Menandai bahwa pesanan sudah dibayar
      },
      where: {
        id: idPesanan,
        userId: idMahasiswa, // Pastikan pesanan milik user ini
      },
    });

    return NextResponse.json(
      {
        message: "Pembayaran dikonfirmasi",
        pemesanan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PEMBAYARAN]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
