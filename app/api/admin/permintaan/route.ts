import { verifyAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";
    const decoded = await verifyAccessToken(accessToken);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized", decoded },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { harga, idMahasiswa, idPermintaan } = body;

    const pemesanan = await prisma.pemesanan.update({
      data: {
        harga,
      },
      where: {
        id: idPermintaan,
        userId: idMahasiswa,
      },
    });

    return NextResponse.json(
      {
        message: "Update Harga Berhasil",
        pemesanan,
        idPermintaan,
        idMahasiswa,
        harga,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PEMESANAN]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";
    const decoded = await verifyAccessToken(accessToken);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized", decoded },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { idMahasiswa, idPermintaan } = body;

    const pemesanan = await prisma.pemesanan.update({
      data: {
        isAccepted: true,
        status: "ACCEPTED",
        paid: false,
      },
      where: {
        id: idPermintaan,
        userId: idMahasiswa,
      },
    });

    return NextResponse.json(
      {
        message: "Pemesanan dikonfirmasi",
        pemesanan,
        idPermintaan,
        idMahasiswa,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PEMESANAN]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";
    const decoded = await verifyAccessToken(accessToken);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized", decoded },
        { status: 401 }
      );
    }

    const pemesanan = await prisma.pemesanan.findMany({
      where: {
        isAccepted: false,
      },
      include: {
        user: true,
      },
    });

    if (!pemesanan || pemesanan.length < 1) {
      return NextResponse.json(
        { error: "Permintaan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pemesanan, { status: 200 });
  } catch (error) {
    console.error("[GET_PERMINTAAN]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";
    const decoded = await verifyAccessToken(accessToken);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized", decoded },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { pesan, idMahasiswa, idPermintaan } = body;

    const pemesanan = await prisma.pemesanan.update({
      data: {
        pesan,
      },
      where: {
        id: idPermintaan,
        userId: idMahasiswa,
      },
    });

    return NextResponse.json(
      {
        message: "Penolakan Berhasil",
        pemesanan,
        idPermintaan,
        idMahasiswa,
        pesan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PENOLAKAN]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
