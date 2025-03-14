"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import UploadFile from "@/components/uploadProfile";

// Definisikan skema Zod untuk validasi
const pemesananSchema = z.object({
  fotoBarang: z.instanceof(File).refine((file) => file?.size > 0, {
    message: "Foto barang wajib diunggah",
  }),
  nama: z.string().min(1, "Nama barang tidak boleh kosong"),
  deskripsiBarang: z.string().optional(),
  durasiPenyimpanan: z.enum(["1 bulan", "3 bulan", "6 bulan", "Kustom"]),
  ukuranBarang: z.enum(["Kecil", "Sedang", "Besar", "Lainnya"]).optional(),
  catatan: z.string().optional(),
  estimasiHarga: z.number().min(0, "Estimasi harga tidak valid").optional(),
});

type FormData = z.infer<typeof pemesananSchema>;

export default function PemesananForm() {
  const [estimasiHarga, setEstimasiHarga] = useState<number | null>(null);
  const [profile, setProfile] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(pemesananSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Logika untuk mengirim data pemesanan ke server
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-[#4D55CC]">
        Tambah Pemesanan
      </h2>
      {/* Unggah Foto Barang */}
      <div className="flex flex-col">
        <label className="font-medium mb-2">Unggah Foto Barang (Wajib)</label>
        <UploadFile setProfile={setProfile} imageURL={profile} />
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
          <option value="1 bulan">2 bulan</option>
          <option value="3 bulan">3 bulan</option>
          <option value="3 bulan">4 bulan</option>
          <option value="3 bulan">5 bulan</option>
          <option value="6 bulan">6 bulan</option>
          <option value="6 bulan">1 tahun</option>
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
      <Button type="submit" variant={"custom"} className="w-full py-5">
        Ajukan Pemesanan
      </Button>
    </form>
  );
}
