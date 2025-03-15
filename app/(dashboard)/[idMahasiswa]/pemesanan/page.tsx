"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import UploadFile from "@/components/uploadProfile";
import db from "@/lib/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// Definisikan skema Zod untuk validasi
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

type FormData = z.infer<typeof pemesananSchema>;

const hitungEstimasiHarga = (
  durasi: string,
  ukuran: string,
  penjemputan: string
) => {
  // Harga per ukuran barang
  const hargaPerBulan: Record<string, number> = {
    Kecil: 50000,
    Sedang: 100000,
    Besar: 150000,
  };

  // Durasi penyimpanan dalam bulan
  const bulanMapping: Record<string, number> = {
    "1 bulan": 1,
    "2 bulan": 2,
    "3 bulan": 3,
    "4 bulan": 4,
    "5 bulan": 5,
    "6 bulan": 6,
    "1 tahun": 12,
  };

  // Biaya penjemputan berdasarkan ukuran
  const biayaPenjemputan: Record<string, number> = {
    Kecil: 50000,
    Sedang: 75000,
    Besar: 100000,
  };

  if (!hargaPerBulan[ukuran] || !bulanMapping[durasi]) return null;

  // Hitung total harga berdasarkan ukuran dan durasi
  let totalHarga = hargaPerBulan[ukuran] * bulanMapping[durasi];

  // Diskon 10% jika penyimpanan lebih dari 6 bulan
  if (bulanMapping[durasi] > 6) {
    totalHarga *= 0.9;
  }

  // Tambahkan biaya penjemputan jika barang dijemput
  if (penjemputan === "Dijemput") {
    totalHarga += biayaPenjemputan[ukuran] || 0;
  }

  return totalHarga;
};

export default function PemesananForm() {
  const [estimasiHarga, setEstimasiHarga] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(pemesananSchema),
  });

  const params = useParams();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const pemesanan = await db.post(`api/${params.idMahasiswa}/pemesanan`, {
        ...data,
        estimasiHarga,
      });

      reset();
      toast.success(pemesanan?.message);
      router.push(`/${params.idMahasiswa}/status`);
    } catch (error) {
      toast.error(error?.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const ukuran = useWatch({ control, name: "ukuranBarang" }) || "Kecil";
  const durasi = useWatch({ control, name: "durasiPenyimpanan" }) || "1 bulan";
  const penjemputan =
    useWatch({ control, name: "penjemputan" }) || "Antar Sendiri";

  // Menghitung estimasi harga setiap kali durasi, ukuran, atau penjemputan berubah
  useEffect(() => {
    const harga = hitungEstimasiHarga(durasi, ukuran, penjemputan);
    setEstimasiHarga(harga || 0);
  }, [durasi, ukuran, penjemputan, errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-[#4D55CC]">
        Tambah Pemesanan
      </h2>
      {/* Unggah Foto Barang */}
      <div className="flex flex-col">
        <label className="font-medium mb-2">Unggah Foto Barang (Wajib)</label>
        <Controller
          name="fotoBarang"
          control={control}
          render={({ field }) => (
            <UploadFile imageURL={field.value} setProfile={field.onChange} />
          )}
        />
        {errors.fotoBarang && (
          <span className="text-red-500 text-sm">
            {errors.fotoBarang.message}
          </span>
        )}
      </div>

      {/* Nama Barang */}
      <div className="flex flex-col">
        <label className="font-medium mb-2">Nama Anda (Wajib)</label>
        <input
          {...register("nama")}
          type="text"
          placeholder="Nama"
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4D55CC] focus:outline-none"
        />
        {errors.nama && (
          <span className="text-red-500 text-sm">{errors.nama.message}</span>
        )}
      </div>

      {/* Deskripsi Barang */}
      <div className="flex flex-col">
        <label className="font-medium mb-2">Deskripsi Barang (Opsional)</label>
        <textarea
          {...register("deskripsiBarang")}
          placeholder="Deskripsikan barang jika diperlukan"
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4D55CC] focus:outline-none"
        />
      </div>

      {/* Estimasi Durasi Penyimpanan */}
      <div className="flex flex-col">
        <label className="font-medium mb-2">
          Estimasi Durasi Penyimpanan (Wajib)
        </label>
        <select
          {...register("durasiPenyimpanan")}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4D55CC] focus:outline-none"
        >
          <option value="1 bulan">1 bulan</option>
          <option value="2 bulan">2 bulan</option>
          <option value="3 bulan">3 bulan</option>
          <option value="4 bulan">4 bulan</option>
          <option value="5 bulan">5 bulan</option>
          <option value="6 bulan">6 bulan</option>
          <option value="1 tahun">1 tahun</option>
          <option value="Kustom">Kustom</option>
        </select>
        {errors.durasiPenyimpanan && (
          <span className="text-red-500 text-sm">
            {errors.durasiPenyimpanan.message}
          </span>
        )}
      </div>

      {/* Perkiraan Ukuran Barang */}
      <div className="flex flex-col">
        <label className="font-medium mb-2">
          Perkiraan Ukuran Barang (Opsional)
        </label>
        <select
          {...register("ukuranBarang")}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4D55CC] focus:outline-none"
        >
          <option value="Kecil">Kecil</option>
          <option value="Sedang">Sedang</option>
          <option value="Besar">Besar</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      {/* Catatan Tambahan */}
      <div className="flex flex-col">
        <label className="font-medium mb-2">Catatan Tambahan (Opsional)</label>
        <textarea
          {...register("catatan")}
          placeholder="Tuliskan catatan tambahan jika ada"
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4D55CC] focus:outline-none"
        />
      </div>

      <div className="flex flex-col">
        <label className="font-medium mb-2">Metode Pengiriman Barang</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Dijemput"
              {...register("penjemputan")}
              className="w-4 h-4"
            />
            Dijemput oleh layanan
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Antar Sendiri"
              {...register("penjemputan")}
              className="w-4 h-4"
            />
            Antar sendiri ke lokasi
          </label>
        </div>
        {errors.penjemputan && (
          <span className="text-red-500 text-sm">
            {errors.penjemputan.message}
          </span>
        )}
      </div>

      {/* Estimasi Harga */}
      <div className="flex flex-col">
        <label className="font-medium mb-2">Estimasi Harga</label>
        <div className="">
          {estimasiHarga
            ? `Rp ${estimasiHarga.toLocaleString()}`
            : "Menghitung..."}
        </div>
      </div>

      {/* Tombol Ajukan Pemesanan */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-sm py-5 bg-[#4D55CC] text-white hover:bg-[#3A47A4]"
      >
        Ajukan Pemesanan
      </button>
    </form>
  );
}
