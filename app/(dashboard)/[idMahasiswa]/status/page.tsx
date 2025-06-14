"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import db from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const StorageStatus: React.FC = () => {
  const params = useParams();
  const [storage, setStorage] = useState(null);

  useEffect(() => {
    const fetchPemesanan = async () => {
      if (!params.idMahasiswa) return;

      try {
        const response = await db.get(`api/${params.idMahasiswa}/pemesanan`);
        console.log({ response });

        setStorage(response.data);
      } catch (error) {
        console.error("[PEMESANAN]: ", error);
      }
    };

    fetchPemesanan();
  }, [params]);

  useEffect(() => {
    console.log({ storage });
  }, [storage]);
  return (
    <div>
      <h2 className="text-[#4D55CC] text-xl font-semibold mb-4">
        Status Penyimpanan Barang
      </h2>
      <div className="overflow-x-auto">
        <table className="border border-collapse border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border p-3">Tanggal</th>
              <th className="border p-3">Foto</th>
              <th className="border p-3">Nama</th>
              <th className="border p-3">Durasi</th>
              <th className="border p-3">Harga</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {storage ? (
              storage?.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border p-3">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border p-3">
                    <Image
                      src={item.fotoBarang[0]}
                      alt="Foto Barang"
                      className="h-16 rounded-md w-16 mx-auto object-cover"
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="border p-3">{item.nama}</td>
                  <td className="border p-3">{item.durasiPenyimpanan}</td>
                  <td className="border p-3">
                    Rp {item.harga.toLocaleString("id-ID")}
                  </td>
                  <td
                    className={`border p-3 font-semibold ${
                      item.status === "ACCEPTED"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {item.status}
                  </td>
                  <td className="border p-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="custom">Detail</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className={cn("py-20")}>
                          <DialogTitle>Detail</DialogTitle>
                          <table className="border border-gray-300 w-full">
                            <tbody>
                              <tr>
                                <td className="border p-3 font-semibold">
                                  Nama
                                </td>
                                <td className="border p-3">{item.nama}</td>
                              </tr>
                              <tr>
                                <td className="border p-3 font-semibold">
                                  Deskripsi
                                </td>
                                <td className="border p-3">
                                  {item.deskripsiBarang}
                                </td>
                              </tr>
                              <tr>
                                <td className="border p-3 font-semibold">
                                  Durasi
                                </td>
                                <td className="border p-3">
                                  {item.durasiPenyimpanan}
                                </td>
                              </tr>
                              <tr>
                                <td className="border p-3 font-semibold">
                                  Ukuran Barang
                                </td>
                                <td className="border p-3">
                                  {item.ukuranBarang}
                                </td>
                              </tr>
                              <tr>
                                <td className="border p-3 font-semibold">
                                  Harga
                                </td>
                                <td className="border p-3">
                                  Rp {item.harga.toLocaleString("id-ID")}
                                </td>
                              </tr>
                              <tr>
                                <td className="border p-3 font-semibold">
                                  Penjemputan
                                </td>
                                <td className="border p-3">
                                  {item.penjemputan}
                                </td>
                              </tr>
                              <tr>
                                <td className="border p-3 font-semibold">
                                  Status
                                </td>
                                <td
                                  className={`border p-3 ${
                                    item.status === "REJECTED" && "text-red-600"
                                  }`}
                                >
                                  {item.status}
                                </td>
                              </tr>
                              <tr>
                                <td className="border p-3 font-semibold">
                                  Foto
                                </td>
                                <td className="flex border p-3 gap-2">
                                  {item.fotoBarang.map((url, index) =>
                                    url ? (
                                      <Image
                                        key={index}
                                        src={url}
                                        alt={`Product Image ${index}`}
                                        className="border-2 h-32 w-32 object-cover"
                                        width={200}
                                        height={200}
                                      />
                                    ) : null
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </DialogHeader>
                        {item.status === "ACCEPTED" &&
                          (item.paid ? (
                            <Button variant="outline" disabled>
                              Sudah Dibayar
                            </Button>
                          ) : (
                            <Link href={`/${params.idMahasiswa}/pembayaran`}>
                              <Button variant="custom">💳 Bayar</Button>
                            </Link>
                          ))}

                        {item.status === "REJECTED" && item.rejectMessage && (
                          <p>
                            Kami Menolak dengan alasan : {item.rejectMessage}
                          </p>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="border p-3 text-center">
                  Data Tidak Ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StorageStatus;
