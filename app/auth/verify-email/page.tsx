"use client";

import db from "@/lib/axiosInstance";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function VerifyEmailPageContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null); // Simpan email di state
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);

    const token = searchParams.get("token");

    if (!token) {
      setMessage("Token is missing in the URL");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await db.post("api/auth/verify-email", {
          token: token,
        });

        if (!response) {
          setMessage("Verification failed. Please try again.");
        }

        console.log(response.data);

        router.push(`/mahasiswa/${response.data.id}`);
      } catch (error) {
        console.error(error);
        setMessage("Failed to verify email. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div>
      <h1>Verify Your Email, {email}</h1>
      {loading ? <p>Loading...</p> : <p>{message}</p>}
    </div>
  );
}

export default VerifyEmailPageContent;
