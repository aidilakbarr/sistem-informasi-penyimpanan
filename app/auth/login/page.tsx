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
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Skema validasi dengan Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isType, setIsType] = useState("password");
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePassword = () => {
    setIsType(isType === "password" ? "text" : "password");
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", data);

      toast.success("Login berhasil!", { position: "top-center" });
      console.log("Login Response:", response.data);
      if (response.data.user.role === "ADMIN") {
        router.push(`/admin`);
      } else {
        router.push(`/mahasiswa/${response.data.id}`);
      }
      form.reset();
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login gagal! Periksa kembali email & password", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 animate-bg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-60 animate-moveBg"></div>

      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Login ke Akun
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <div className="relative">
                      <Input {...field} type={isType} placeholder="Password" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" onCheckedChange={togglePassword} />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Liat Password?
              </label>
            </div>

            {/* Tombol Submit */}
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
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
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
              <span>Login with Google</span>
            </button>
          </div>
        </Link>
        <p className="text-center text-gray-500 text-sm mt-4">
          Belum punya akun?{" "}
          <Link
            href="/auth/register"
            className="text-indigo-600 hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
