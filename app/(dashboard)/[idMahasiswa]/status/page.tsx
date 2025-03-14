import { Button } from "@/components/ui/button";
import React from "react";

interface StorageItem {
  id: string;
  name: string;
  status: string;
  date: string;
}

const storageData: StorageItem[] = [
  { id: "1", name: "Aidil", status: "Disimpan", date: "10 Maret 2025" },
  {
    id: "2",
    name: "Wawan",
    status: "Siap Diambil",
    date: "12 Maret 2025",
  },
];

const StorageStatus: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[#4D55CC]">
        Status Penyimpanan
      </h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3">Nama</th>
            <th className="border p-3">Status</th>
            <th className="border p-3">Tanggal Update</th>
            <th className="border p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {storageData.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-3">{item.name}</td>
              <td className="border p-3">{item.status}</td>
              <td className="border p-3">{item.date}</td>
              <td className="border p-3">
                <Button variant={"custom"}>Detail</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StorageStatus;
