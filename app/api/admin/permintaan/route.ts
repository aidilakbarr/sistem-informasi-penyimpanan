import { verifyAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// export async function POST(
//   req: Request,
//   { params }: { params: { idMahasiswa: string } }
// ) {
//   try {
//     const { idMahasiswa } = await params;

//     if (!idMahasiswa) {
//       return NextResponse.json(
//         { error: "Missing idMahasiswa parameter" },
//         { status: 400 }
//       );
//     }

//     const cookieStore = await cookies();
//     const accessToken = cookieStore.get("accessToken")?.value || "";
//     const decoded = await verifyAccessToken(accessToken);
//     if (!decoded || decoded.id !== idMahasiswa) {
//       return NextResponse.json(
//         { error: "Unauthorized", decoded, idMahasiswa },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();
//     const parsedData = pemesananSchema.safeParse(body);

//     if (!parsedData.success) {
//       return NextResponse.json(
//         { error: parsedData.error.errors },
//         {
//           status: 400,
//         }
//       );
//     }

//     const {
//       fotoBarang,
//       nama,
//       deskripsiBarang,
//       durasiPenyimpanan,
//       ukuranBarang,
//       catatan,
//       estimasiHarga,
//       penjemputan,
//     } = body;

//     const pemesanan = await prisma.pemesanan.create({
//       data: {
//         fotoBarang,
//         nama,
//         deskripsiBarang,
//         durasiPenyimpanan,
//         ukuranBarang,
//         catatan,
//         harga: estimasiHarga,
//         penjemputan,
//         status: "WAITING",
//         userId: idMahasiswa,
//       },
//     });

//     return NextResponse.json(
//       { message: "Pemesanan Berhasil", pemesanan },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("[PEMESANAN]: ", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

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
