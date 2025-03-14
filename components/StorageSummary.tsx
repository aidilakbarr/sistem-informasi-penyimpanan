const StorageSummary = () => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Ringkasan Penyimpanan</h3>
      <div className="flex justify-between">
        <div className="text-center">
          <h4 className="text-2xl font-bold">1</h4>
          <p>Barang Disimpan</p>
        </div>
        <div className="text-center">
          <h4 className="text-2xl font-bold">0</h4>
          <p>Siap Diambil</p>
        </div>
      </div>
    </div>
  );
};

export default StorageSummary;
