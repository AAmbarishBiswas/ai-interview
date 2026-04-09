"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Page() {
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  // ✅ LOAD CHATS
  useEffect(() => {
    const saved = localStorage.getItem("chats");
    if (saved) {
      setChats(JSON.parse(saved));
    } else {
      setChats([[]]);
    }
  }, []);

  // ✅ SAVE CHATS
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  // ✅ NEW CHAT
  const createNewChat = () => {
    setChats([[], ...chats]);
    setCurrentChatIndex(0);
  };

  // ✅ DELETE CHAT
  const deleteChat = (index: number) => {
    const updated = chats.filter((_, i) => i !== index);
    setChats(updated.length ? updated : [[]]);
    setCurrentChatIndex(0);
  };

  // 🎤 VOICE INPUT
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  // 📷 IMAGE UPLOAD
  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 💬 SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim() && !image) return;

    const updatedChats = [...chats];
    const currentChat = updatedChats[currentChatIndex] || [];

    const newMessages = [
      ...currentChat,
      {
        role: "user",
        content: input || "📷 Image uploaded",
      },
    ];

    updatedChats[currentChatIndex] = newMessages;
    setChats(updatedChats);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/interview", {
        messages: newMessages,
        image: image,
      });

      updatedChats[currentChatIndex] = [
        ...newMessages,
        { role: "assistant", content: res.data.reply },
      ];

      setChats([...updatedChats]);
    } catch (err) {
      console.error(err);
    }

    setImage(null);
    setLoading(false);
  };

  return (
    <div className="flex h-screen text-white bg-gradient-to-br from-[#1f1c2c] via-[#928dab] to-[#1f1c2c]">

      {/* SIDEBAR */}
      <div className="w-64 bg-black/30 backdrop-blur-lg p-4 flex flex-col border-r border-white/10">
        <button
          onClick={createNewChat}
          className="mb-4 p-2 border border-gray-600 rounded hover:bg-gray-700"
        >
          + New Chat
        </button>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/5 backdrop-blur-md rounded-tl-2xl">
          {chats.map((chat, i) => (
            <div
              key={i}
              className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                i === currentChatIndex
                  ? "bg-gray-700"
                  : "hover:bg-gray-800"
              }`}
            >
              <span onClick={() => setCurrentChatIndex(i)}>
                {chat[0]?.content?.slice(0, 20) || "New Chat"}
              </span>

              <button onClick={() => deleteChat(i)}>🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col">

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* IMAGE PREVIEW */}
          {image && (
            <div className="flex justify-center">
              <img src={image} className="w-40 rounded-lg" />
            </div>
          )}

          {(chats[currentChatIndex] || []).map((msg: any, i: number) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[60%] ${
                  msg.role === "user"
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
            : "bg-white/10 backdrop-blur-md text-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && <div className="text-gray-400">AI is typing...</div>}
        </div>

        {/* INPUT BAR */}
        <div className="p-4 flex justify-center border-t border-gray-700 bg-[#343541]">
          <div className="flex items-center w-full max-w-xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 shadow-lg">

            <input
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            {/* 🎤 VOICE */}
            <button
              onClick={startListening}
              className={`ml-2 px-3 py-1 rounded-full ${
              listening
              ? "bg-red-500 animate-pulse"
              : "bg-purple-500 hover:bg-purple-600"
              }`}
            >
              🎤
            </button>

            {/* 📷 CAMERA */}
            <label className="ml-2 cursor-pointer hover:scale-110 transition">
              📷
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* SEND */}
            <button
              onClick={sendMessage}
              className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 rounded-full hover:scale-110 transition"
            >
              ➤
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}