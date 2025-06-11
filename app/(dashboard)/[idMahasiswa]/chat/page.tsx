"use client";

import { useEffect, useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import Message from "@/components/Message";
import ChatInput from "@/components/ChatInput";
import axios from "axios";
import db from "@/lib/axiosInstance";
import { useParams } from "next/navigation";

type MessageType = {
  id: string;
  text: string;
  isUser: boolean;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const params = useParams();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await db.get(`api/${params.idMahasiswa}/chat`);
        const mappedMessages: MessageType[] = response.data.map((msg: any) => ({
          id: msg.id,
          text: msg.message,
          isUser: msg.sender.role === "USER",
        }));
        setMessages(mappedMessages);
      } catch (error) {
        console.error("Gagal mengambil pesan:", error);
      }
    };
    fetchMessages();
  }, [params.idMahasiswa]);

  const sendMessage = async (msg: string) => {
    try {
      // Optimistik update (opsional)
      // setMessages((prev) => [
      //   ...prev,
      //   { id: crypto.randomUUID(), text: msg, isUser: true },
      // ]);

      // Ambil ulang pesan dari backend agar sinkron
      const response = await db.post(`api/${params.idMahasiswa}/chat`, {
        message: msg,
      });

      const data = response.data;

      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          text: data.message,
          isUser: data.sender.role === "USER",
        },
      ]);
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-100 min-h-[28rem] max-h-[28rem]">
      {/* Header Chat */}
      <ChatHeader />

      {/* Area Chat */}
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((msg) => (
          <Message key={msg.id} text={msg.text} isUser={msg.isUser} />
        ))}
      </div>

      {/* Input Chat */}
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
}
