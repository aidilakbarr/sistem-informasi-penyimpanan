import React from "react";

interface Payment {
  id: string;
  orderId: string;
  method: string;
  amount: string;
  status: string;
}

const paymentData: Payment[] = [
  {
    id: "1",
    orderId: "#2025001",
    method: "QRIS",
    amount: "Rp500.000",
    status: "Lunas",
  },
  {
    id: "2",
    orderId: "#2025002",
    method: "Transfer Bank",
    amount: "Rp300.000",
    status: "Menunggu Konfirmasi",
  },
];

const PaymentHistory: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[#4D55CC]">
        Status Pembayaran
      </h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3">ID Pesanan</th>
            <th className="border p-3">Metode Pembayaran</th>
            <th className="border p-3">Total Biaya</th>
            <th className="border p-3">Status Pembayaran</th>
          </tr>
        </thead>
        <tbody>
          {paymentData.map((payment) => (
            <tr key={payment.id} className="text-center">
              <td className="border p-3">{payment.orderId}</td>
              <td className="border p-3">{payment.method}</td>
              <td className="border p-3">{payment.amount}</td>
              <td className="border p-3">{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
