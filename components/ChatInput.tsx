"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

const ChatInput = ({
  sendMessage,
}: {
  sendMessage: (msg: string, img?: string) => void;
}) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleSend = () => {
    if (message.trim() !== "" || image) {
      sendMessage(message.trim(), image || undefined);
      setMessage("");
      setImage(null);
    }
  };

  useEffect(() => {
    console.log({ image });
  }, [image]);

  return (
    <div className="p-4 bg-white flex items-center space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border rounded-lg"
        placeholder="Ketik pesan..."
      />

      <CldUploadWidget
        uploadPreset="image-product-store" // Ganti dengan upload preset kamu
        options={{ multiple: false }}
        onSuccess={(result: any) => setImage(result.info.secure_url)}
      >
        {({ open }) => (
          <label
            className="cursor-pointer text-xl"
            onClick={() => open?.()}
            title="Upload Gambar"
          >
            📎
          </label>
        )}
      </CldUploadWidget>

      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        ➤
      </button>

      {image && (
        <div className="ml-2 relative">
          <Image
            src={image}
            alt="Preview"
            width={40}
            height={40}
            className="rounded border object-cover"
          />
          <button
            onClick={() => setImage(null)}
            className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
