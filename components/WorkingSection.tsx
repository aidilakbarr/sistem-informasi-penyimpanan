import { Smartphone, Camera, Truck, Lock, Download } from "lucide-react";

export default function WorkingSection() {
  return (
    <section className="py-16 px-6 bg-white" id="layanan">
      <h2 className="text-4xl font-bold text-[#4D55CC] text-center mb-10">
        Cara Kerja
      </h2>

      <div className=" mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
        {/* Step 1 */}
        <div className="p-6 shadow-md flex flex-col items-center border-2 border-solid rounded-sm hover:border-[#4D55CC] font-bold">
          <Smartphone className="text-[#4D55CC] w-12 h-12 mb-3" />
          <h3 className="text-xl font-semibold">1️⃣ Daftar & Pilih Paket</h3>
          <p className="text-gray-600 text-sm mt-2">
            Registrasi akun dan pilih paket penyimpanan sesuai kebutuhan.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-6 shadow-md flex flex-col items-center border-2 border-solid rounded-sm hover:border-[#4D55CC] font-bold">
          <Camera className="text-[#4D55CC] w-12 h-12 mb-3" />
          <h3 className="text-xl font-semibold">2️⃣ Input Barang</h3>
          <p className="text-gray-600 text-sm mt-2">
            Upload foto dan deskripsi barang yang ingin disimpan.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-6 shadow-md flex flex-col items-center border-2 border-solid rounded-sm hover:border-[#4D55CC] font-bold">
          <Truck className="text-[#4D55CC] w-12 h-12 mb-3" />
          <h3 className="text-xl font-semibold">3️⃣ Kirim ke Mitra</h3>
          <p className="text-gray-600 text-sm mt-2">
            Barang akan dijemput atau dikirim ke mitra penyimpanan.
          </p>
        </div>

        {/* Step 4 */}
        <div className="p-6 shadow-md flex flex-col items-center border-2 border-solid rounded-sm hover:border-[#4D55CC] font-bold">
          <Lock className="text-[#4D55CC] w-12 h-12 mb-3" />
          <h3 className="text-xl font-semibold">4️⃣ Barang Aman</h3>
          <p className="text-gray-600 text-sm mt-2">
            Barang disimpan dengan aman hingga dibutuhkan kembali.
          </p>
        </div>

        {/* Step 5 */}
        <div className="p-6 shadow-md flex flex-col items-center border-2 border-solid rounded-sm hover:border-[#4D55CC] font-bold">
          <Download className="text-[#4D55CC] w-12 h-12 mb-3" />
          <h3 className="text-xl font-semibold">5️⃣ Ambil Kapan Saja</h3>
          <p className="text-gray-600 text-sm mt-2">
            Ambil barang kapan saja sesuai kebutuhan melalui aplikasi.
          </p>
        </div>
      </div>
    </section>
  );
}
