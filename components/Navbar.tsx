import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-[0_4px_10px_rgba(77,85,204,0.3)] flex justify-between items-center py-3 px-8">
      {/* Logo */}
      <Link href={"/"}>
        <h1 className="font-bold text-4xl text-[#4D55CC]">SIREMBA</h1>
      </Link>

      {/* Navigasi */}
      <nav className="gap-6 flex">
        <a href="#beranda" className="hover:text-[#4D55CC]">
          Beranda
        </a>
        <a href="#tentang" className="hover:text-[#4D55CC]">
          Tentang Layanan
        </a>
        <a href="#layanan" className="hover:text-[#4D55CC]">
          Cara Kerja
        </a>
        <a href="#kontak" className="hover:text-[#4D55CC]">
          Kontak
        </a>
      </nav>

      {/* Tombol Login */}
      <Link href={"/auth/login"}>
        <Button variant={"custom"} className="flex items-center cursor-pointer">
          Login
        </Button>
      </Link>
    </div>
  );
}
