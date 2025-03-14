"use client";

import { useState } from "react";

const AdminChat = () => {
  const [students, setStudents] = useState([
    { id: "student1", name: "Rudi Hartanto" },
    { id: "student2", name: "Nina Saraswati" },
    { id: "student3", name: "Budi Setiawan" },
  ]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSelectStudent = (studentId) => {
    setSelectedStudent(studentId);
    setMessages([]); // Reset pesan untuk mahasiswa yang dipilih
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        sender: "Admin",
        message: newMessage,
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4">
        <h3 className="font-semibold">Mahasiswa</h3>
        <ul>
          {students.map((student) => (
            <li
              key={student.id}
              className={`cursor-pointer ${
                selectedStudent === student.id ? "bg-blue-100" : ""
              }`}
              onClick={() => handleSelectStudent(student.id)}
            >
              {student.name}
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
              className={`mb-3 ${
                message.sender === "Admin" ? "text-blue-500" : "text-gray-700"
              }`}
            >
              <span className="font-semibold">{message.sender}: </span>
              <span>{message.message}</span>
            </div>
          ))}
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
