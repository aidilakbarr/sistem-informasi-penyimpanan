import Image from "next/image";
import { Button } from "./ui/button";

export default function AboutSection() {
  return (
    <>
      <h2
        className="text-4xl font-bold text-[#4D55CC] text-center mb-6"
        id="tentang"
      >
        Tentang SIREMBA
      </h2>
      <div className="flex items-center">
        <div className="w-2/5">
          <Image
            src={"/assets/images/about.jpg"}
            alt="About-Images"
            width={1000}
            height={1000}
          />
        </div>
        <div className="w-3/5">
          <div>
            <h3 className="text-xl font-bold">Kenapa Ada SIREMBA?</h3>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Banyak mahasiswa mengalami kesulitan menyimpan barang saat liburan
              panjang, pindahan kos, atau saat ruang penyimpanan di kamar mereka
              terbatas. Akibatnya, barang sering tercecer, rusak, atau bahkan
              hilang. Dengan SIREMBA, mahasiswa bisa dengan mudah menyimpan
              barang mereka secara aman tanpa perlu repot mencari tempat
              penyimpanan sementara.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold">Solusi Kami</h3>
            <p className="text-gray-600 mt-2 leading-relaxed">
              SIREMBA adalah layanan penyimpanan yang dirancang khusus untuk
              mahasiswa. Dengan sistem berbasis teknologi modern, mahasiswa bisa
              dengan mudah mengelola barang yang disimpan, memilih paket
              penyimpanan sesuai kebutuhan, dan mendapatkan akses yang
              fleksibel. Kami bekerja sama dengan mitra penyimpanan terpercaya
              untuk memastikan barang tetap aman dan terlindungi.
            </p>
          </div>
          <Button variant={"custom"} className="p-6 mt-4 cursor-pointer">
            Mulai Gunakan SIREMBA
          </Button>
        </div>
      </div>
    </>
  );
}
