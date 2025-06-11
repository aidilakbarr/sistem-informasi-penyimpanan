"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface StorageItem {
  id: string;
  nama: string;
  deskripsiBarang: string;
  durasiPenyimpanan: string;
  harga: number;
  penjemputan: string;
  fotoBarang: string[];
  user: {
    email: string;
  };
}

interface PaymentPageProps {
  storage: StorageItem[];
}

const PaymentPage: React.FC<PaymentPageProps> = ({ storage }) => {
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response = await axios.post(`/api/${params.idMahasiswa}/midtrans`, {
        storage,
      });

      const { token } = response.data;

      window.snap.pay(token, {
        onSuccess: async function () {
          await axios.put(`/api/${params.idMahasiswa}/update-status-paid`, {
            idPesanan: storage[0].id,
          });
          toast.success("Pembayaran berhasil!");
          window.location.href = `/${params.idMahasiswa}/status`;
        },
        onPending: function () {
          toast.loading("Pembayaran sedang diproses.");
        },
        onError: function () {
          toast.error("Pembayaran gagal.");
        },
        onClose: function () {
          toast.info("Anda menutup pembayaran.");
        },
      });
    } catch (error) {
      console.error("Error saat memproses pembayaran", error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
    );
    document.body.appendChild(script);
  }, []);

  const totalHarga = storage.reduce((acc, item) => acc + item.harga, 0);

  return (
    <div>
      <h2 className="text-2xl text-center font-semibold mb-4">
        Pembayaran Jastip
      </h2>
      <div className="border-gray-300 border-t my-4"></div>

      {storage.map((item) => (
        <div
          key={item.id}
          className="border border-gray-300 p-3 rounded-lg mb-4"
        >
          <p>
            <strong>Barang:</strong> {item.nama}
          </p>
          <p>
            <strong>Durasi:</strong> {item.durasiPenyimpanan}
          </p>
          <p>
            <strong>Harga:</strong> Rp {item.harga.toLocaleString()}
          </p>
          <p>
            <strong>Pengantaran:</strong> {item.penjemputan}
          </p>
        </div>
      ))}

      <div className="border-gray-300 border-t my-4"></div>

      <p className="text-lg font-bold">
        Total Bayar: Rp {totalHarga.toLocaleString()}
      </p>
      <p className="text-gray-600 text-sm">Periksa kembali sebelum membayar.</p>

      <Button
        onClick={handlePayment}
        variant={"custom"}
        className={"my-4 w-full py-5"}
        disabled={loading}
      >
        {loading ? "Memproses..." : "Bayar Sekarang"}
      </Button>
    </div>
  );
};

export default PaymentPage;
