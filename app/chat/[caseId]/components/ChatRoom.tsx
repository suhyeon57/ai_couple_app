"use client";

import { useState } from "react";
import Image from "next/image";

type Message = {
  id: number;
  sender: "judge" | "me" | "partner";
  text: string;
  time: string;
};

export default function ChatRoom() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "judge",
      text: "안녕하세요.",
      time: "22:31",
    },
    {
      id: 2,
      sender: "judge",
      text: "지금부터 재판을 시작하겠습니다.",
      time: "22:31",
    },
    {
      id: 3,
      sender: "judge",
      text: "원고부터 진술해주세요.",
      time: "22:31",
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "me",
        text: input,
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setInput("");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 ">
      <h1 className="text-3xl font-bold">뿌엥 로그</h1>
      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full">
        {messages.map((message, idx) => {
          // 이전 메시지 확인
          const prev = messages[idx - 1];
          const showJudgeAvatar =
            message.sender === "judge" && (!prev || prev.sender !== "judge");

          if (message.sender === "judge") {
            return (
              <div key={message.id} className="flex flex-col items-start">
                {showJudgeAvatar && (
                  <Image
                    src="/logo.png"
                    alt="뿌엥"
                    width={45}
                    height={45}
                    priority
                    className="rounded-full hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="bg-white rounded-2xl px-4 py-3 shadow max-w-xs whitespace-pre-line">
                  {message.text}
                </div>
              </div>
            );
          }

          if (message.sender === "partner") {
            return (
              <div key={message.id} className="flex justify-start">
                <div>
                  <div className="text-sm mb-1">😊 상대방</div>

                  <div className="bg-white rounded-2xl px-4 py-3 shadow inline-block max-w-xs">
                    {message.text}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {message.time}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className="flex justify-end">
              <div>
                <div className="bg-pink-300 text-white rounded-2xl px-4 py-3 shadow inline-block max-w-xs">
                  {message.text}
                </div>

                <div className="text-xs text-right text-gray-500 mt-1">
                  {message.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className=" border-t p-3 flex gap-2 w-full">
        <input
          className="flex-1 border rounded-full px-4 py-2 outline-none"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleSend}
          className="bg-pink-300 text-white px-3 rounded-full"
        >
          ⬆
        </button>
      </div>
    </div>
  );
}
