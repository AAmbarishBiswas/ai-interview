"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";

export default function Page() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("interview");

    channel.bind("message", (data: any) => {
      setMessages((prev) => [...prev, data]);
    });

    axios.post("/api/interview", { isFirst: true });

    return () => {
      pusher.unsubscribe("interview");
    };
  }, []);

  const sendMessage = async () => {
    if (!input) return;

    setMessages((prev) => [
      ...prev,
      { text: input, sender: "user" },
    ]);

    await axios.post("/api/interview", { message: input });
    setInput("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold">AI Interview</h1>

      <div className="h-[400px] border overflow-y-auto p-2 mt-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === "user" ? "text-right" : ""}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="flex mt-2 gap-2">
        <input
          className="border p-2 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}