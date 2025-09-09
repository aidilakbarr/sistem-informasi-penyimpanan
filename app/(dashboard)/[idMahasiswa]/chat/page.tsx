"use client";

import { useEffect, useRef, useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import Message from "@/components/Message";
import ChatInput from "@/components/ChatInput";
import db from "@/lib/axiosInstance";
import { useParams } from "next/navigation";
import { pusherClient } from "@/utils/pusher"; 

type MessageType = {
  time: unknown;
  id: string;
  text: string;
  isUser: boolean;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const params = useParams();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await db.get(`api/${params.idMahasiswa}/chat`);

        const mappedMessages: MessageType[] = response.data.map((msg: any) => ({
          id: msg.id,
          text: msg.message,
          isUser: msg.sender.role === "USER",
          time: msg.createdAt,
        }));
        setMessages(mappedMessages);

        const isAdminOnline = response.data.find(
          (msg: any) => msg.sender.role === "ADMIN"
        );
        if (isAdminOnline) {
          setAdminId(isAdminOnline.sender.id);
        }
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
      await db.post(`api/${params.idMahasiswa}/chat`, {
        message: msg,
      });
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  };

  useEffect(() => {
    if (!params.idMahasiswa) return;

    // Channel berdasarkan ID Mahasiswa (cocok dengan backend `chatRoom.userId`)
    const channel = pusherClient.subscribe(`chat-${params.idMahasiswa}`);

    const handleNewMessage = (data: any) => {
      console.log({ data });

      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          text: data.message,
          isUser: data.sender.role === "USER",
          time: data.createdAt,
        },
      ]);
    };

    channel.bind("new-message", handleNewMessage);

    return () => {
      channel.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe(`chat-${params.idMahasiswa}`);
    };
  }, [params?.idMahasiswa]);

  // Presence untuk status online
  useEffect(() => {
    const channel = pusherClient.subscribe("presence-chat");

    channel.bind("pusher:subscription_succeeded", (members: any) => {
      const ids: string[] = [];
      members.each((member: any) => ids.push(member.id));
      setOnlineUserIds(ids);
    });

    channel.bind("pusher:member_added", (member: any) => {
      setOnlineUserIds((prev) => [...prev, member.id]);
    });

    channel.bind("pusher:member_removed", (member: any) => {
      setOnlineUserIds((prev) => prev.filter((id) => id !== member.id));
    });

    return () => {
      pusherClient.unsubscribe("presence-chat");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-100 min-h-[28rem] max-h-[28rem]">
      {/* Header Chat */}
      <ChatHeader adminId={adminId || ""} onlineUserIds={onlineUserIds} />

      {/* Area Chat */}
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            text={msg.text}
            isUser={msg.isUser}
            time={msg.time}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Chat */}
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
}
