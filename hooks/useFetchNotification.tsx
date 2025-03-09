"use client";

import db from "@/lib/axiosInstance";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const UseFetchNotification = () => {
  const params = useParams();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotification = async () => {
      if (!params.idUser) return; // Pastikan idUser ada

      try {
        const response = await db.get(`api/${params.idUser}/notification`);
        setNotification(response.data);
      } catch (error) {
        console.error("[UseFetchNotification]: ", error);
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [params]);

  return { notification, loading, error };
};

export default UseFetchNotification;
