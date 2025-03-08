import Image from "next/image";
import { Button } from "./ui/button";

export default function HeroSection() {
  return (
    <div
      className="flex flex-col-reverse md:flex-row items-center justify-between min-h-screen overflow-hidden "
      id="beranda"
    >
      {/* Text Area */}
      <div className="flex flex-col justify-center gap-6 w-full md:w-3/5">
        <h1 className="text-3xl md:text-4xl font-bold leading-snug">
          Penyimpanan Barang Kos Mahasiswa yang Aman & Praktis
        </h1>
        <p className="text-gray-600">
          SIREMBA hadir sebagai solusi modern bagi mahasiswa yang kesulitan
          menyimpan barang-barang kos mereka. Dengan layanan yang mudah diakses,
          proses transparan, serta mitra penyedia penyimpanan yang terpercaya,
          kini mahasiswa bisa menyimpan barang tanpa ribet. Cocok untuk kamu
          yang sedang pindah kos, pulang kampung saat liburan semester, atau
          butuh ruang ekstra sementara.
        </p>
        <Button variant={"custom"} className="w-fit cursor-pointer px-6 py-6">
          Sewa Sekarang
        </Button>
        <div className="flex gap-4 mt-6">
          <div className="border-2 border-solid border- px-6 py-4 rounded-sm border-[#4D55CC] hover:bg-[#4D55CC] font-bold text-[#4D55CC] hover:text-white">
            Daftar Cepat
          </div>
          <div className="border-2 border-solid border- px-6 py-4 rounded-sm border-[#4D55CC] hover:bg-[#4D55CC] font-bold text-[#4D55CC] hover:text-white">
            Mitra Terpercaya
          </div>
          <div className="border-2 border-solid px-6 py-4 rounded-sm border-[#4D55CC] hover:bg-[#4D55CC] font-bold text-[#4D55CC] hover:text-white">
            Harga Hemat
          </div>
        </div>
      </div>

      {/* Image Area */}
      <div className="w-full md:w-2/5">
        <Image
          src="/assets/images/hero.jpg"
          alt="hero-images"
          width={1000}
          height={1000}
          className="w-full h-auto max-w-[400px] md:max-w-none mx-auto"
        />
      </div>
    </div>
  );
}
