"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/src/lib/supabase";

type Message = {
  id: string;
  case_id: string;
  user_id: string;
  role: string;
  content: string;
  created_at: string;
};

type Props = {
  caseId: string;
};

export default function ChatRoom({ caseId }: Props) {
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [role, setRole] = useState<"plaintiff" | "defendant">("defendant");
  const [waitingCase, setWaitingCase] = useState<any>(null);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: authData, error: authErr } =
          await supabase.auth.getUser();
        if (authErr) {
          console.error(authErr);
          return;
        }
        const user = authData.user;
        if (!user) return;

        const { data: caseData, error } = await supabase
          .from("cases")
          .select("*")
          .eq("id", caseId)
          .single();

        if (error) {
          console.error(error);
          return;
        }

        setRole(caseData?.created_by === user.id ? "plaintiff" : "defendant");

        if (!caseData?.intro_started) {
          await supabase
            .from("cases")
            .update({ intro_started: true })
            .eq("id", caseId);

          const judgeMessages = [
            "안녕하세요.",
            "저는 뿌엥 재판장입니다.",
            "지금부터 재판을 시작하겠습니다.",
            "원고부터 진술해주세요.",
          ];

          for (const message of judgeMessages) {
            await supabase.from("statements").insert({
              case_id: caseData.id,
              user_id: user.id,
              role: "judge",
              content: message,
            });

            await sleep(5000); // 1.2초 대기
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserRole();
  }, [caseId]);

  console.log("caseId", caseId);

  useEffect(() => {
    const fetchMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(user.id);
      }
      const { data, error } = await supabase
        .from("statements")
        .select("*")
        .eq("case_id", caseId)
        .order("created_at");

      console.log("data", data);
      console.log("error", error);

      if (data) {
        setMessages(data);
      }
    };

    fetchMessages();
  }, [caseId]);

  useEffect(() => {
    const channel = supabase
      .channel(`statements-${caseId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "statements",
          filter: `case_id=eq.${caseId}`,
        },
        (payload) => {
          console.log("New message received:", payload.new);

          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe((status) => {
        console.log("Realtime Status :", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [caseId]);
  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

  const handleSend = async () => {
    const { data: caseData } = await supabase
      .from("cases")
      .select("*")
      .eq("id", caseId)
      .single();

    console.log("Sending message:", input);
    if (!input.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("statements").insert({
      case_id: caseId,
      user_id: user.id,
      role: role,
      content: input,
    });

    if (error) {
      console.error(error);
      return;
    }

    setInput("");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 ">
      <h1 className="text-3xl font-bold">뿌엥 로그</h1>
      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full">
        {messages.map((message, idx) => {
          const prev = messages[idx - 1];
          const isMe = message.user_id === currentUserId;
          const isJudge = message.role === "judge";
          const showJudgeAvatar = !prev || prev.role !== "judge";

          if (isJudge) {
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
                  {message.content}
                </div>
              </div>
            );
          }

          if (!isMe) {
            return (
              <div key={message.id} className="flex justify-start">
                <div>
                  <div className="text-sm mb-1">😊 상대방</div>

                  <div className="bg-white rounded-2xl px-4 py-3 shadow inline-block max-w-xs">
                    {message.content}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(message.created_at).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className="flex justify-end">
              <div>
                <div className="bg-pink-300 text-white rounded-2xl px-4 py-3 shadow inline-block max-w-xs">
                  {message.content}
                </div>

                <div className="text-xs text-right text-gray-500 mt-1">
                  {new Date(message.created_at).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
