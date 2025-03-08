"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Instagram, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

// Define Zod schema
const contactSchema = z.object({
  name: z.string().min(1, { message: "Nama harus diisi" }),
  email: z.string().email({ message: "Email tidak valid" }),
  message: z
    .string()
    .min(5, { message: "Pesan harus memiliki minimal 5 karakter" }),
});

type FormData = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true); // Set loading to true when starting the request
    try {
      const response = await axios.post("/api/mahasiswa/send-message", data);

      toast.success(response.data.message, {
        position: "top-center",
      });
      reset();

      setIsLoading(false); // Set loading to false when the request is complete
    } catch (error) {
      console.error(error);
      toast.error("Pesan Gagal Terkirim", {
        position: "top-center",
      });

      setIsLoading(false); // Handle the error by stopping the loading state
    }
  };

  return (
    <section className="py-16 px-6" id="kontak">
      <h2 className="text-4xl font-bold text-[#4D55CC] text-center mb-10">
        Kontak Kami
      </h2>

      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Informasi Kontak */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-solid ">
          <h3 className="text-3xl font-semibold mb-4">Hubungi Kami</h3>
          <div className="space-y-4 text-gray-700">
            <p className="flex items-center gap-3">
              <Mail className="text-[#4D55CC] w-6 h-6" /> aidilakbr95@gmail.com
            </p>
            <p className="flex items-center gap-3">
              <Phone className="text-[#4D55CC] w-6 h-6" /> 0856-5722-4564
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="text-[#4D55CC] w-6 h-6" /> Tanggetada, Popalia,
              Kos Family 01, Nomor 15
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-6">🔗 Ikuti Kami</h3>
          <div className="flex gap-4 mt-2 ">
            <a
              href="https://www.instagram.com/aidilakbart?igsh=MmY0ZnU5MTU3eXB4"
              className="text-[#4D55CC] hover:underline flex items-center gap-2"
            >
              <Instagram className="w-5 h-5" /> Instagram
            </a>
            <a
              href="https://www.tiktok.com/@alfin5z?_t=ZS-8uVJmWapcwx&_r=1"
              className="text-[#4D55CC] hover:underline flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> TikTok
            </a>
          </div>
        </div>

        {/* Formulir Kirim Pesan */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold mb-4">Kirim Pesan Cepat</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("name")}
                type="text"
                placeholder="Nama"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4D55CC] focus:outline-none"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4D55CC] focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <textarea
                {...register("message")}
                rows={4}
                placeholder="Pesan"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4D55CC] focus:outline-none"
              />
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message.message}</p>
              )}
            </div>

            <Button
              variant={"custom"}
              className="w-full p-6 cursor-pointer"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? "Mengirim..." : "Kirim Pesan"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
