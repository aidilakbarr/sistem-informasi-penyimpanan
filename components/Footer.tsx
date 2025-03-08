import Link from "next/link";
import { Instagram, MessageCircle, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#4D55CC] text-white py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom 1: Logo & Deskripsi */}
        <div>
          <h1 className="text-3xl font-bold">SIREMBA</h1>
          <p className="mt-3 text-gray-300">
            Solusi penyimpanan barang kos mahasiswa yang aman, mudah, dan
            terpercaya. Kini, mahasiswa bisa bebas dari masalah ruang
            penyimpanan!
          </p>
        </div>

        {/* Kolom 2: Navigasi */}
        <div>
          <h2 className="text-xl font-semibold">Navigasi</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={"#"}>
                🏠 <span className="hover:underline">Beranda</span>
              </Link>
            </li>
            <li>
              <Link href={"#tentang"}>
                ℹ️ <span className="hover:underline">Tentang</span>
              </Link>
            </li>
            <li>
              <Link href={"#layanan"}>
                ⚙️ <span className="hover:underline">Cara Kerja</span>
              </Link>
            </li>
            <li>
              <Link href={"#kontak"}>
                📞 <span className="hover:underline">Kontak</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Kontak & Sosial Media */}
        <div>
          <h2 className="text-xl font-semibold">Kontak Kami</h2>
          <div className="mt-3 space-y-2 text-gray-300">
            <p className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-white" /> aidilakbr95@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-white" /> 0856-5722-4564
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-white" /> Tanggetada, Popalia, Kos
              Family 01, Nomor 15
            </p>
          </div>

          <h2 className="text-xl font-semibold mt-4">Ikuti Kami</h2>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:underline flex items-center gap-2">
              <Instagram className="w-5 h-5 text-white" /> Instagram
            </a>
            <a href="#" className="hover:underline flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-white" /> TikTok
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-300 text-sm border-t border-gray-500 pt-4">
        © 2025 SIREMBA. All Rights Reserved.
      </div>
    </footer>
  );
}
