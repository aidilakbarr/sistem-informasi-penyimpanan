import { verifyAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as z from "zod";

const pemesananSchema = z.object({
  fotoBarang: z
    .string()
    .url("URL gambar tidak valid")
    .min(1, "Foto barang wajib diunggah"),
  nama: z
    .string()
    .min(1, "Nama barang tidak boleh kosong") // Pesan kustom jika nama barang kosong
    .max(100, "Nama barang terlalu panjang, maksimal 100 karakter"), // Pesan kustom untuk panjang nama
  deskripsiBarang: z.string().optional(),
  durasiPenyimpanan: z.enum(
    [
      "1 bulan",
      "2 bulan",
      "3 bulan",
      "4 bulan",
      "5 bulan",
      "6 bulan",
      "1 tahun",
      "Kustom",
    ],
    {
      errorMap: () => {
        return { message: "Durasi penyimpanan tidak valid" }; // Pesan kustom untuk durasi penyimpanan
      },
    }
  ),
  ukuranBarang: z.enum(["Kecil", "Sedang", "Besar", "Lainnya"]),
  catatan: z.string().optional(),
  estimasiHarga: z
    .number()
    .min(0, "Estimasi harga tidak valid") // Pesan kustom untuk estimasi harga yang kurang dari 0
    .optional(),
  penjemputan: z.enum(["Dijemput", "Antar Sendiri"], {
    errorMap: () => {
      return { message: "Pilihan penjemputan tidak valid" }; // Pesan kustom untuk penjemputan
    },
  }),
});

export async function POST(
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

    const body = await req.json();
    const parsedData = pemesananSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.errors },
        {
          status: 400,
        }
      );
    }

    const {
      fotoBarang,
      nama,
      deskripsiBarang,
      durasiPenyimpanan,
      ukuranBarang,
      catatan,
      estimasiHarga,
      penjemputan,
    } = body;

    const pemesanan = await prisma.pemesanan.create({
      data: {
        fotoBarang,
        nama,
        deskripsiBarang,
        durasiPenyimpanan,
        ukuranBarang,
        catatan,
        harga: estimasiHarga,
        penjemputan,
        status: "WAITING",
        userId: idMahasiswa,
      },
    });

    return NextResponse.json(
      { message: "Pemesanan Berhasil", pemesanan },
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
