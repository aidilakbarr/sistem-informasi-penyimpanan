import createTransaction from "@/lib/midtrans/transaction";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { storage } = await req.json();

    if (!storage || storage.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data penyimpanan" },
        { status: 400 }
      );
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const auth = Buffer.from(serverKey + ":").toString("base64");

    // Hitung total harga
    const totalHarga = storage.reduce(
      (total: number, item: any) => total + item.harga,
      0
    );
    const orderId = `ORDER-${Date.now()}`;

    const callbackBaseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalHarga,
      },
      item_details: storage.map((item: any) => ({
        id: item.id,
        price: item.harga,
        quantity: 1,
        name: `Penyimpanan ${item.deskripsiBarang}`,
        category: "Jasa Penyimpanan",
      })),
      customer_details: {
        first_name: storage[0]?.nama || "User",
        email: storage[0]?.user?.email || "user@example.com",
      },
      callbacks: {
        finish: `${callbackBaseUrl}/payment/success?order_id=${orderId}`,
        error: `${callbackBaseUrl}/payment/error?order_id=${orderId}`,
        pending: `${callbackBaseUrl}/payment/pending?order_id=${orderId}`,
      },
    };

    // Panggil Midtrans API tanpa callback
    const transaction = await createTransaction(payload);

    if (!transaction) {
      return NextResponse.json(
        { error: "Gagal membuat transaksi" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (response.status !== 201) {
      return NextResponse.json(
        { status: "error", message: "Gagal Melakukan Pembayaran" },
        { status: 500 }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}
