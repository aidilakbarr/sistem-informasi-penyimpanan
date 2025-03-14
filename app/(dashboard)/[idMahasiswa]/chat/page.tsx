"use client";

import { useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import Message from "@/components/Message";
import ChatInput from "@/components/ChatInput";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { text: "Halo, ada yang bisa dibantu?", isUser: false },
  ]);

  const sendMessage = (msg: string) => {
    setMessages([...messages, { text: msg, isUser: true }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Baik, akan kami cek!", isUser: false },
      ]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100 min-h-[28rem] max-h-[28rem]">
      {/* Header Chat */}
      <ChatHeader />

      {/* Area Chat */}
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} isUser={msg.isUser} />
        ))}
      </div>

      {/* Input Chat */}
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
}
