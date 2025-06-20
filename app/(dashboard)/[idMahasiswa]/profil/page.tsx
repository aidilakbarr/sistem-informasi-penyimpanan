"use client";

import UploadFile from "@/components/uploadImage";
import useFetchUser from "@/hooks/useFetchUser";
import db from "@/lib/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const settingSchema = z.object({
  fullName: z.string().min(3, "Full Name harus memiliki minimal 3 karakter"),
  phoneNumber: z
    .string()
    .regex(
      /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/,
      "Format nomor telepon tidak valid (contoh: +62 81234567890 atau 081234567890)"
    ),
  address: z.string().min(5, "Alamat harus memiliki minimal 5 karakter"),
  bio: z
    .string()
    .min(10, "minimal 10 karakter")
    .max(300, "Bio tidak boleh lebih dari 300 karakter")
    .optional(),
});

type PersonalInfo = z.infer<typeof settingSchema>;

const Settings = () => {
  const [profile, setProfile] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { user } = useFetchUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      fullName: user?.name || "",
      phoneNumber: user?.phone || "",
      address: user?.address || "",
      bio: user?.bio || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.name || "",
        phoneNumber: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

  const onSubmitForm = async (data: any) => {
    try {
      setLoading(true);
      const response = await db.put(`api/${params.idUser}/profile`, {
        fullName: data.fullName,
        phoneAddress: data.phoneNumber,
        address: data.address,
        bio: data.bio,
      });

      toast.success(response.data.message);
      router.push(`/${params.idUser}/profile`);
    } catch (error) {
      console.log("[SETTING_PAGE]: ", error);
      toast.error(error.message || "Ada masalah pada server");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitProfile = async () => {
    try {
      setLoading(true);
      const response = await db.put(
        `api/${params.idUser}/profile/profile-image`,
        {
          url: profile,
        }
      );

      toast.success(response.data.message);
      router.push(`/${params.idUser}/profile`);
    } catch (error) {
      console.log("[SETTING_PAGE]: ", error);
      toast.error(error.message || "Ada masalah pada server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke dark:bg-black bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Informasi Pribadi
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="fullName"
                        placeholder="fullName"
                        {...register("fullName")}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phoneNumber"
                    >
                      Nomor Telpon
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      id="phoneNumber"
                      placeholder="081234567890"
                      {...register("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="address"
                  >
                    Alamat Lengkap
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <svg
                        fill="#7d7d7d"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#7d7d7d"
                        width={20}
                        height={20}
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M49,18.92A23.74,23.74,0,0,0,25.27,42.77c0,16.48,17,31.59,22.23,35.59a2.45,2.45,0,0,0,3.12,0c5.24-4.12,22.1-19.11,22.1-35.59A23.74,23.74,0,0,0,49,18.92Zm0,33.71a10,10,0,1,1,10-10A10,10,0,0,1,49,52.63Z"></path>
                        </g>
                      </svg>
                    </span>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      id="address"
                      placeholder="jakarta"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Detail Alamat
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <svg
                        className="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8" clipPath="url(#clip0_88_10224)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.56524 3.23223C2.03408 2.76339 2.66997 2.5 3.33301 2.5H9.16634C9.62658 2.5 9.99967 2.8731 9.99967 3.33333C9.99967 3.79357 9.62658 4.16667 9.16634 4.16667H3.33301C3.11199 4.16667 2.90003 4.25446 2.74375 4.41074C2.58747 4.56702 2.49967 4.77899 2.49967 5V16.6667C2.49967 16.8877 2.58747 17.0996 2.74375 17.2559C2.90003 17.4122 3.11199 17.5 3.33301 17.5H14.9997C15.2207 17.5 15.4326 17.4122 15.5889 17.2559C15.7452 17.0996 15.833 16.8877 15.833 16.6667V10.8333C15.833 10.3731 16.2061 10 16.6663 10C17.1266 10 17.4997 10.3731 17.4997 10.8333V16.6667C17.4997 17.3297 17.2363 17.9656 16.7674 18.4344C16.2986 18.9033 15.6627 19.1667 14.9997 19.1667H3.33301C2.66997 19.1667 2.03408 18.9033 1.56524 18.4344C1.0964 17.9656 0.833008 17.3297 0.833008 16.6667V5C0.833008 4.33696 1.0964 3.70107 1.56524 3.23223Z"
                            fill=""
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                            fill=""
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_88_10224">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>

                    <textarea
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      id="bio"
                      rows={6}
                      placeholder="Write your bio here"
                      {...register("bio")}
                    ></textarea>
                    {errors.bio && (
                      <p className="text-red-500 text-sm">
                        {errors.bio.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4.5">
                  <button
                    className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    type="submit"
                    disabled={loading}
                  >
                    Batal
                  </button>
                  <button
                    className="flex justify-center rounded px-6 py-2 font-medium text-gray hover:bg-opacity-90 bg-[#4D55CC] text-white hover:bg-[#3A47A4]"
                    type="submit"
                    disabled={loading}
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-black">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Foto Kamu
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={onSubmitProfile}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full">
                    <Image
                      src={user?.profile || "/assets/image/logo.jpg"}
                      width={55}
                      height={55}
                      alt="User"
                    />
                  </div>
                  <div>
                    <span className="mb-1.5 text-black dark:text-white">
                      Edit Foto Kamu
                    </span>
                    <span className="flex gap-2.5">
                      <button
                        className="text-sm hover:text-primary"
                        disabled={loading}
                      >
                        Hapus
                      </button>
                      <button
                        className="text-sm hover:text-primary"
                        disabled={loading}
                      >
                        Edit
                      </button>
                    </span>
                  </div>
                </div>

                <UploadFile setProfile={setProfile} imageURL={profile} />

                <div className="flex justify-end gap-4.5">
                  <button
                    className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    type="submit"
                    disabled={loading}
                  >
                    Batal
                  </button>
                  <button
                    className="flex justify-center rounded px-6 py-2 font-medium text-gray hover:bg-opacity-90 bg-[#4D55CC] text-white hover:bg-[#3A47A4]"
                    type="submit"
                    disabled={loading}
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
