const dummyRequests = [
  {
    studentName: "Rudi Hartanto",
    item: "TV, Kulkas, Laptop",
    status: "Menunggu Konfirmasi",
  },
  {
    studentName: "Nina Saraswati",
    item: "Buku-buku, Pakaian, Sepatu",
    status: "Barang Diterima",
  },
  {
    studentName: "Budi Setiawan",
    item: "Sepeda, Koper",
    status: "Sedang Disimpan",
  },
  {
    studentName: "Siti Aisyah",
    item: "Peralatan Dapur, Helm",
    status: "Siap Diambil",
  },
];

export default function StorageRequestList({ requests }: { requests: any[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Permintaan Penyimpanan</h3>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2 text-left">Nama Mahasiswa</th>
            <th className="border-b p-2 text-left">Barang</th>
            <th className="border-b p-2 text-left">Status</th>
            <th className="border-b p-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dummyRequests.map((request, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{request.studentName}</td>
              <td className="p-2">{request.item}</td>
              <td className="p-2">{request.status}</td>
              <td className="p-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
                  Konfirmasi
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Tolak
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
