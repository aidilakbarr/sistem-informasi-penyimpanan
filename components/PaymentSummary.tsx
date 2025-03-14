const PaymentSummary = () => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Ringkasan Pembayaran</h3>
      <div className="flex justify-between">
        <div className="text-center">
          <h4 className="text-2xl font-bold">Rp800.000</h4>
          <p>Total Pembayaran</p>
        </div>
        <div className="text-center">
          <h4 className="text-2xl font-bold">✅ 2</h4>
          <p>Lunas</p>
        </div>
        <div className="text-center">
          <h4 className="text-2xl font-bold">⏳ 1</h4>
          <p>Menunggu</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
