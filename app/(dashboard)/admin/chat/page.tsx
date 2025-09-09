"use client";

import db from "@/lib/axiosInstance";
import { pusherClient } from "@/utils/pusher";
import { useEffect, useRef, useState } from "react";

type Role = "ADMIN" | "USER";

export interface UserBase {
  id: string;
  name: string;
  role: Role;
}

interface ChatMessage {
  id: string;
  message: string;
  createdAt: string;
  sender: Sender;
}

export type Sender = UserBase;
export type Student = UserBase;

const AdminChat = () => {
  const [chatRooms, setChatRooms] = useState<ChatMessage[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [adminId, setAdminId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const response = await db.get("api/admin/chat");

      setChatRooms(response.data);

      const allMessages: ChatMessage[] = response.data;

      console.log({ allMessages });

      const adminMessage = allMessages.find(
        (msg) => msg.sender.role === "ADMIN"
      );
      if (adminMessage) {
        setAdminId(adminMessage.sender.id);
      }
      const uniqueSenders: Student[] = Array.from(
        new Map(
          allMessages
            .filter((msg) => msg.sender.role === "USER")
            .map((msg) => [msg.sender.id, msg.sender])
        ).values()
      );

      setStudents(uniqueSenders);
    };

    fetchChatRooms();
  }, []);

  useEffect(() => {
    const channel = pusherClient.subscribe(`chat-${adminId}`);

    const handler = (newMessage: ChatMessage) => {
      console.log("Pesan baru diterima:", newMessage);

      if (
        newMessage?.sender?.role === "USER" &&
        newMessage?.sender?.id === selectedStudent
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }

      // Tambahkan student baru ke daftar jika belum ada
      if (
        newMessage?.sender?.role === "USER" &&
        !students.some((s) => s.id === newMessage.sender.id)
      ) {
        setStudents((prev) => [...prev, newMessage.sender]);
      }
    };

    channel.bind("new-message", handler);

    return () => {
      channel.unbind("new-message", handler);
      pusherClient.unsubscribe(`chat-${adminId}`);
    };
  }, [adminId, selectedStudent, students]);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudent(studentId);

    const filteredMessages = chatRooms.filter(
      (msg) => msg.sender.id === studentId || msg.sender.role === "ADMIN"
    );

    setMessages(filteredMessages);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent) return;

    try {
      const response = await db.post("/api/admin/chat", {
        idMahasiswa: selectedStudent,
        message: newMessage,
      });

      const sentMessage = response.data;

      const messageWithSender = {
        ...sentMessage,
        sender: {
          id: "admin",
          name: "Admin",
          role: "ADMIN",
        },
      };

      setMessages((prevMessages) => [...prevMessages, messageWithSender]);
      setNewMessage("");
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  };

  useEffect(() => {
    console.log({ chatRooms });
    console.log({ students });
    console.log({ onlineUserIds });
  }, [chatRooms, onlineUserIds, students]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = pusherClient.subscribe("presence-chat");

    channel.bind("pusher:subscription_succeeded", (members: any) => {
      const onlineIds: string[] = [];

      members.each((member: any) => {
        onlineIds.push(member.id);
      });

      setOnlineUserIds(onlineIds);
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

  return (
    <div className="flex">
      <div className="w-1/4 p-4">
        <h3 className="font-semibold">Mahasiswa</h3>
        <ul>
          {students.map((student) => (
            <li
              key={student.id}
              className={`cursor-pointer p-2 rounded flex items-center justify-between ${
                selectedStudent === student.id ? "bg-blue-100" : ""
              }`}
              onClick={() => handleSelectStudent(student.id)}
            >
              <span>{student.name}</span>

              {onlineUserIds.includes(student.id) && (
                <span
                  className="ml-2 w-2 h-2 bg-green-500 rounded-full"
                  title="Online"
                ></span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 p-4">
        <h3 className="font-semibold mb-4">Chat Admin - Mahasiswa</h3>
        <div className="h-80 bg-gray-100 p-4 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                message.sender.role === "ADMIN"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender.role === "ADMIN"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-300 text-black rounded-bl-none"
                }`}
              >
                <div className="text-sm">{message.message}</div>
                <div className="text-xs text-right opacity-70 mt-1">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex">
          <input
            type="text"
            className="w-full p-2 border rounded-l-lg"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tulis pesan..."
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-r-lg"
            onClick={handleSendMessage}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
