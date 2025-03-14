import StorageSummary from "@/components/StorageSummary";
import PaymentSummary from "@/components/PaymentSummary";
import Notifications from "@/components/Notification";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <h2 className="text-xl font-semibold mb-4 text-[#4D55CC]">Dashboard</h2>
      {/* Ringkasan Penyimpanan */}
      <StorageSummary />

      {/* Ringkasan Pembayaran */}
      <PaymentSummary />

      {/* Notifikasi */}
      <Notifications />
    </div>
  );
}
