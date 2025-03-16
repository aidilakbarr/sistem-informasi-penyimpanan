"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import db from "@/lib/axiosInstance";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StorageRequestList() {
  const [storage, setStorage] = useState(null);
  const [newHarga, setNewHarga] = useState(0);
  const params = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  useEffect(() => {
    const fetchPermintaan = async () => {
      try {
        const response = await db.get(`api/admin/permintaan`);
        console.log({ response });

        setStorage(response.data);
      } catch (error) {
        console.error("[PERMINTAAN]: ", error);
      }
    };

    fetchPermintaan();
  }, [params]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[#4D55CC]">
        Permintaan Penyimpanan
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border p-3">No</th>
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
              storage?.map((item, index) => (
                <tr key={item.id} className="text-center">
                  <td className="border p-3">{index + 1}</td>
                  <td className="border p-3">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border p-3">
                    <Image
                      src={item.fotoBarang}
                      alt="Foto Barang"
                      className="w-16 h-16 object-cover rounded-md mx-auto"
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
                      item.status === "Disimpan"
                        ? "text-blue-500"
                        : "text-green-500"
                    }`}
                  >
                    {item.status}
                  </td>
                  <td className="border p-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <svg
                          viewBox="0 0 24 24"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          fill="#000000"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <title>Kebab-Menu</title>{" "}
                            <g
                              id="Kebab-Menu"
                              stroke="none"
                              stroke-width="1"
                              fill="none"
                              fill-rule="evenodd"
                            >
                              {" "}
                              <rect
                                id="Container"
                                x="0"
                                y="0"
                                width="24"
                                height="24"
                              >
                                {" "}
                              </rect>{" "}
                              <path
                                d="M12,6 C12.5522847,6 13,5.55228475 13,5 C13,4.44771525 12.5522847,4 12,4 C11.4477153,4 11,4.44771525 11,5 C11,5.55228475 11.4477153,6 12,6 Z"
                                id="shape-03"
                                stroke="#030819"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-dasharray="0,0"
                              >
                                {" "}
                              </path>{" "}
                              <path
                                d="M12,13 C12.5522847,13 13,12.5522847 13,12 C13,11.4477153 12.5522847,11 12,11 C11.4477153,11 11,11.4477153 11,12 C11,12.5522847 11.4477153,13 12,13 Z"
                                id="shape-03"
                                stroke="#030819"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-dasharray="0,0"
                              >
                                {" "}
                              </path>{" "}
                              <path
                                d="M12,20 C12.5522847,20 13,19.5522847 13,19 C13,18.4477153 12.5522847,18 12,18 C11.4477153,18 11,18.4477153 11,19 C11,19.5522847 11.4477153,20 12,20 Z"
                                id="shape-03"
                                stroke="#030819"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-dasharray="0,0"
                              >
                                {" "}
                              </path>{" "}
                            </g>{" "}
                          </g>
                        </svg>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Aksi</DialogTitle>
                          <table className="w-full border border-gray-300">
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
                                  <input
                                    type="number"
                                    value={item.harga}
                                    onChange={(e) =>
                                      setNewHarga(Number(e.target.value))
                                    }
                                    className="border p-2 w-full rounded-md"
                                  />
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
                                <td className="border p-3">{item.status}</td>
                              </tr>
                              <tr>
                                <td className="border p-3 font-semibold">
                                  Foto
                                </td>
                                <td className="border p-3">
                                  <Dialog>
                                    <DialogTrigger>
                                      <Image
                                        src={item.fotoBarang}
                                        alt="Foto Barang"
                                        className="w-32 h-32 object-cover rounded-md"
                                        width={1000}
                                        height={1000}
                                      />
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[100vh] overflow-hidden">
                                      <Image
                                        src={item.fotoBarang}
                                        alt="Foto Barang"
                                        className="w-full h-full object-cover rounded-md"
                                        width={1000}
                                        height={1000}
                                      />
                                      <button
                                        onClick={handlePrev}
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white px-4 py-2 rounded"
                                      >
                                        &#60; Prev
                                      </button>
                                      <button
                                        onClick={handleNext}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white px-4 py-2 rounded"
                                      >
                                        Next &#62;
                                      </button>
                                      <div className="mt-4 flex justify-end gap-4">
                                        <DialogClose>
                                          <Button variant={"destructive"}>
                                            Tutup
                                          </Button>
                                        </DialogClose>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <DialogFooter className="flex justify-between gap-4">
                            <Button variant="default" color="primary">
                              Chat Mahasiswa
                            </Button>
                            <Button variant="default" color="primary">
                              Update
                            </Button>
                            <Button variant="destructive" color="primary">
                              Tolak
                            </Button>
                            <Button variant="custom" color="primary">
                              Konfirmasi
                            </Button>
                          </DialogFooter>
                        </DialogHeader>
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
}
