"use client";

import db from "@/lib/axiosInstance";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const useFetchUser = () => {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!params.idMahasiswa) return; // Pastikan idUser ada

      try {
        const response = await db.get(`api/${params.idMahasiswa}/profile`);
        setUser(response.data);
      } catch (error) {
        console.error("[useFetchUser]: ", error);
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params]);

  return { user, loading, error };
};

export default useFetchUser;
