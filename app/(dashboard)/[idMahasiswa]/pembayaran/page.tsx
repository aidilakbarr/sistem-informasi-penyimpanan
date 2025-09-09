"use client";

import { Button } from "@/components/ui/button";
import db from "@/lib/axiosInstance";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Pembayaran = {
  id: string;
  nama: string;
  deskripsiBarang: string;
  durasiPenyimpanan: string;
  ukuranBarang: string;
  harga: number;
  status: string;
  paid: boolean;
};

const PaymentHistory: React.FC = () => {
  const params = useParams();
  const [storage, setStorage] = useState<Pembayaran[]>([]);

  useEffect(() => {
    const fetchPembayaran = async () => {
      if (!params.idMahasiswa) return;

      try {
        const response = await db.get(`api/${params.idMahasiswa}/pembayaran`);
        console.log({ response });

        setStorage(response.data);
      } catch (error) {
        console.error("[Pembayaran]: ", error);
      }
    };

    fetchPembayaran();
  }, [params]);

  useEffect(() => {
    console.log({ storage });
  }, [storage]);
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-[#4D55CC]">
        Daftar Pembayaran
      </h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3">No</th>
            <th className="border p-3">Nama</th>
            <th className="border p-3">Barang</th>
            <th className="border p-3">Durasi</th>
            <th className="border p-3">Ukuran</th>
            <th className="border p-3">Harga</th>
            <th className="border p-3">Status</th>
            <th className="border p-3">Pembayaran</th>
            <th className="border p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {storage?.map((payment, index) => (
            <tr key={payment.id} className="text-center">
              <td className="border p-3">{index + 1}</td>
              <td className="border p-3">{payment.nama}</td>
              <td className="border p-3">{payment.deskripsiBarang}</td>
              <td className="border p-3">{payment.durasiPenyimpanan}</td>
              <td className="border p-3">{payment.ukuranBarang}</td>
              <td className="border p-3">
                Rp {payment.harga.toLocaleString()}
              </td>
              <td className="border p-3">{payment.status}</td>
              <td className="border p-3">
                {payment.paid ? "Lunas" : "Belum Lunas"}
              </td>
              <td className="border p-3">
                {payment.paid ? (
                  <Button
                    variant={"custom"}
                    disabled
                    className="cursor-not-allowed"
                  >
                    Sudah Dibayar
                  </Button>
                ) : (
                  <Button variant={"custom"}>Bayar Sekarang</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={8} className="border p-3 text-right font-semibold">
              Total: Rp{" "}
              {storage &&
                storage
                  .reduce((total, payment) => total + payment.harga, 0)
                  .toLocaleString()}
            </td>
            <td colSpan={1} className="border p-3 text-left font-semibold">
              <Link href={`/${params.idMahasiswa}/bayar`}>
                <Button variant={"custom"}>Bayar Semua</Button>
              </Link>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default PaymentHistory;
