"use client";

import PaymentPage from "@/components/PaymentPage";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import db from "@/lib/axiosInstance";

export default function Payment() {
  const params = useParams();
  const [storage, setStorage] = useState([]);

  useEffect(() => {
    const fetchPembayaran = async () => {
      if (!params.idMahasiswa) return;

      try {
        const response = await db.get(`api/${params.idMahasiswa}/pembayaran`);
        console.log({ response });

        setStorage(response.data);
      } catch (error) {
        console.error("[Pembayaran]: ", error);
      }
    };

    fetchPembayaran();
  }, [params]);

  useEffect(() => {
    console.log({ storage });
  }, [storage]);
  return (
    <div>
      <PaymentPage storage={storage} />
    </div>
  );
}
