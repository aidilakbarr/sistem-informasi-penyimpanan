"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type StorageItem = {
  id: string;
  createdAt: string;
  fotoBarang: string[];
  nama: string;
  durasiPenyimpanan: string;
  harga: number;
  status: "WAITING" | "ACCEPTED" | "REJECTED" | "COMPLETED";
  deskripsiBarang?: string;
  ukuranBarang?: string;
  penjemputan?: string;
  user: {
    id: string;
    name: string;
  };
};

export default function StorageRequestList() {
  const [storage, setStorage] = useState<StorageItem[]>([]);
  const [newHarga, setNewHarga] = useState(0);
  const params = useParams();
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [alasan, setAlasan] = useState("");

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

  const updateHarga = async (idMahasiswa: string, idPermintaan: string) => {
    try {
      const response = await db.put(`api/admin/permintaan`, {
        harga: newHarga,
        idMahasiswa,
        idPermintaan,
      });
      toast.success(response.data.message);
      router.refresh();
      console.log({ response });
    } catch (error) {
      console.error("[UPDATE_HARGA]: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAlasanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlasan(e.target.value);
  };

  const handleTolakPermintaan = async (
    idPermintaan: string,
    idMahasiswa: string
  ) => {
    setLoading(true);
    try {
      const response = await db.delete("api/admin/permintaan", {
        data: {
          alasan,
          idMahasiswa,
          idPermintaan,
        },
      });

      toast.success(response.data.message);
      router.push("/admin/permintaan");
      console.log({ response });
    } catch (error) {
      console.error("[TOLAK_PERMINTAAN]: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKonfirmasi = async (
    idPermintaan: string,
    idMahasiswa: string
  ) => {
    setLoading(true);
    try {
      const response = await db.patch(`api/admin/permintaan`, {
        idMahasiswa,
        idPermintaan,
      });
      toast.success(response.data.message);
      router.push("/admin/permintaan");
    } catch (error) {
      console.error("[KONFIRMASI_PERMINTAAN]: ", error);
    } finally {
      setLoading(false);
    }
  };

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
                      src={item.fotoBarang[0]}
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
                        <svg
                          viewBox="0 0 24 24"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          fill="#000000"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <title>Kebab-Menu</title>{" "}
                            <g
                              id="Kebab-Menu"
                              stroke="none"
                              strokeWidth="1"
                              fill="none"
                              fillRule="evenodd"
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
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray="0,0"
                              >
                                {" "}
                              </path>{" "}
                              <path
                                d="M12,13 C12.5522847,13 13,12.5522847 13,12 C13,11.4477153 12.5522847,11 12,11 C11.4477153,11 11,11.4477153 11,12 C11,12.5522847 11.4477153,13 12,13 Z"
                                id="shape-03"
                                stroke="#030819"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray="0,0"
                              >
                                {" "}
                              </path>{" "}
                              <path
                                d="M12,20 C12.5522847,20 13,19.5522847 13,19 C13,18.4477153 12.5522847,18 12,18 C11.4477153,18 11,18.4477153 11,19 C11,19.5522847 11.4477153,20 12,20 Z"
                                id="shape-03"
                                stroke="#030819"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray="0,0"
                              >
                                {" "}
                              </path>{" "}
                            </g>{" "}
                          </g>
                        </svg>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="sr-only">Aksi</DialogTitle>
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
                                    defaultValue={item.harga}
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
                                    {item.fotoBarang.map((url, index) =>
                                      url ? (
                                        <div key={index}>
                                          <Dialog
                                            open={openIndex === index}
                                            onOpenChange={(isOpen) =>
                                              isOpen
                                                ? setOpenIndex(index)
                                                : setOpenIndex(null)
                                            }
                                          >
                                            <DialogTrigger>
                                              <Image
                                                src={url}
                                                alt={`Product Image ${index}`}
                                                className="w-32 h-32 object-cover"
                                                width={200}
                                                height={200}
                                              />
                                            </DialogTrigger>
                                            <DialogContent className="max-h-[100vh] overflow-hidden flex">
                                              <DialogTitle className="sr-only">
                                                Foto Barang
                                              </DialogTitle>
                                              <Image
                                                src={url}
                                                alt="Foto Barang"
                                                className="w-full h-full object-cover rounded-md"
                                                width={1000}
                                                height={1000}
                                              />
                                              <div className="mt-4 flex justify-end gap-4">
                                                <DialogClose>
                                                  <button className="bg-red-500 text-white p-2 rounded">
                                                    Tutup
                                                  </button>
                                                </DialogClose>
                                              </div>
                                            </DialogContent>
                                          </Dialog>
                                        </div>
                                      ) : null
                                    )}
                                  </Dialog>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <DialogFooter className="flex justify-between gap-4">
                            <Button
                              variant="default"
                              color="primary"
                              disabled={loading}
                            >
                              Chat Mahasiswa
                            </Button>
                            <Button
                              variant="default"
                              color="primary"
                              disabled={loading}
                              onClick={() => updateHarga(item.user.id, item.id)}
                            >
                              Update
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 px-4 rounded-lg cursor-pointer">
                                Tolak
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Apa kamu yakin?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan.
                                    Tindakan ini akan menolak permintaan secara
                                    permanen.
                                  </AlertDialogDescription>
                                  <input
                                    type="text"
                                    className="w-full p-3 z-[9999999999] border rounded-md focus:ring-2 focus:ring-[#4D55CC] focus:outline-none"
                                    placeholder="Tuliskan alasan"
                                    onChange={handleAlasanChange}
                                  />
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleTolakPermintaan(
                                        item.id,
                                        item.user.id
                                      )
                                    }
                                  >
                                    Lanjutkan
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <Button
                              variant="custom"
                              color="primary"
                              disabled={loading}
                              onClick={() =>
                                handleKonfirmasi(item.id, item.user.id)
                              }
                            >
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
