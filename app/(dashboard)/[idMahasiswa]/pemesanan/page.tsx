import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

// Definisikan skema Zod untuk validasi
const pemesananSchema = z.object({
  fotoBarang: z.instanceof(File).refine((file) => file?.size > 0, {
    message: "Foto barang wajib diunggah",
  }),
  namaBarang: z.string().min(1, "Nama barang tidak boleh kosong"),
  deskripsiBarang: z.string().optional(),
  durasiPenyimpanan: z.enum(["1 bulan", "3 bulan", "6 bulan", "Kustom"]),
  ukuranBarang: z.enum(["Kecil", "Sedang", "Besar", "Lainnya"]).optional(),
  catatan: z.string().optional(),
  estimasiHarga: z.number().min(0, "Estimasi harga tidak valid").optional(),
});

type FormData = z.infer<typeof pemesananSchema>;

export default function PemesananForm() {
  const [estimasiHarga, setEstimasiHarga] = useState<number | null>(null);

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
      {/* Unggah Foto Barang */}
      <div className="flex flex-col">
        <label className="font-medium">Unggah Foto Barang 📷 (Wajib)</label>
        <input
          type="file"
          accept="image/*"
          {...register("fotoBarang")}
          className="border p-2 rounded-md"
        />
        {errors.fotoBarang && (
          <span className="text-red-500 text-sm">
            {errors.fotoBarang.message}
          </span>
        )}
      </div>

      {/* Nama Barang */}
      <div className="flex flex-col">
        <label className="font-medium">Nama Barang ✍️ (Wajib)</label>
        <Input
          type="text"
          {...register("namaBarang")}
          placeholder="Masukkan nama barang"
          className="border p-2 rounded-md"
        />
        {errors.namaBarang && (
          <span className="text-red-500 text-sm">
            {errors.namaBarang.message}
          </span>
        )}
      </div>

      {/* Deskripsi Barang */}
      <div className="flex flex-col">
        <label className="font-medium">Deskripsi Barang 📝 (Opsional)</label>
        <Textarea
          {...register("deskripsiBarang")}
          placeholder="Deskripsikan barang jika diperlukan"
          className="border p-2 rounded-md"
        />
      </div>

      {/* Estimasi Durasi Penyimpanan */}
      <div className="flex flex-col">
        <label className="font-medium">
          Estimasi Durasi Penyimpanan ⏳ (Wajib)
        </label>
        <Select
          {...register("durasiPenyimpanan")}
          className="border p-2 rounded-md"
        >
          <option value="1 bulan">1 bulan</option>
          <option value="3 bulan">3 bulan</option>
          <option value="6 bulan">6 bulan</option>
          <option value="Kustom">Kustom</option>
        </Select>
        {errors.durasiPenyimpanan && (
          <span className="text-red-500 text-sm">
            {errors.durasiPenyimpanan.message}
          </span>
        )}
      </div>

      {/* Perkiraan Ukuran Barang */}
      <div className="flex flex-col">
        <label className="font-medium">
          Perkiraan Ukuran Barang 📏 (Opsional)
        </label>
        <Select {...register("ukuranBarang")} className="border p-2 rounded-md">
          <option value="Kecil">Kecil</option>
          <option value="Sedang">Sedang</option>
          <option value="Besar">Besar</option>
          <option value="Lainnya">Lainnya</option>
        </Select>
      </div>

      {/* Catatan Tambahan */}
      <div className="flex flex-col">
        <label className="font-medium">Catatan Tambahan 📝 (Opsional)</label>
        <Textarea
          {...register("catatan")}
          placeholder="Tuliskan catatan tambahan jika ada"
          className="border p-2 rounded-md"
        />
      </div>

      {/* Estimasi Harga */}
      <div className="flex flex-col">
        <label className="font-medium">Estimasi Harga 💰</label>
        <Input
          type="text"
          value={
            estimasiHarga
              ? `Rp ${estimasiHarga.toLocaleString()}`
              : "Menghitung..."
          }
          readOnly
          className="bg-gray-100 text-gray-500"
        />
      </div>

      {/* Tombol Ajukan Pemesanan */}
      <Button type="submit" className="w-full bg-blue-600 text-white">
        Ajukan Pemesanan 🚀
      </Button>
    </form>
  );
}
