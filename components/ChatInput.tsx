import { useState } from "react";

const ChatInput = ({
  sendMessage,
}: {
  sendMessage: (msg: string, img?: string) => void;
}) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleSend = () => {
    if (message.trim() !== "" || image) {
      sendMessage(message, image || undefined);
      setMessage("");
      setImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 bg-white flex items-center space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border rounded-lg"
        placeholder="Ketik pesan..."
      />
      <label className="cursor-pointer">
        📎
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        ➤
      </button>
    </div>
  );
};

export default ChatInput;
