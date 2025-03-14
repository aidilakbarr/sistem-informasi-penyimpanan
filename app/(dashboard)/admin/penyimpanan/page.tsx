const UpdateStatusForm = () => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Update Status Barang</h3>
      <form>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-semibold">
            Pilih Status
          </label>
          <select id="status" className="w-full p-2 border rounded-lg">
            <option value="terima">Barang Diterima</option>
            <option value="disimpan">Barang Sedang Disimpan</option>
            <option value="siapDiambil">Siap Diambil</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
        <button className="bg-green-500 text-white px-6 py-2 rounded-lg">
          Update Status
        </button>
      </form>
    </div>
  );
};

export default UpdateStatusForm;
