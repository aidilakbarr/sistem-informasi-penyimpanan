"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";

// Skema validasi dengan Zod
const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
    email: z.string().email({ message: "Email tidak valid" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/register", data);

      toast.success(response.data.message, {
        position: "top-center",
      });

      console.log("Register Response:", response.data);
      form.reset();
    } catch (error) {
      console.error("Register Error:", error);
      toast.error("Registrasi gagal! Coba lagi.", { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 animate-bg">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 opacity-60 animate-moveBg"></div>

      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Daftar Akun Baru
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Input Nama */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Nama Lengkap" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Input Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Input Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Input Konfirmasi Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Ulangi Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tombol Register */}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Mendaftar...
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          </form>
        </Form>

        {/* Login dengan Google */}
        <Link href={"/api/auth/google"}>
          <div className="flex items-center justify-center dark:bg-gray-800 mt-6">
            <button className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
              <Image
                className="w-6 h-6"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
                width={50}
                height={50}
              />
              <span>Daftar dengan Google</span>
            </button>
          </div>
        </Link>

        <p className="text-center text-gray-500 text-sm mt-4">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="text-indigo-600 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
