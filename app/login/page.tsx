"use client";

import { useState } from "react";
import { supabase } from "../../src/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data.user) {
        alert("로그인 실패");
        return;
      }

      alert("로그인 성공!");
      router.push("/home");
    } catch (err) {
      console.error(err);
      alert("오류 발생");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-3xl font-bold">로그인</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-80 rounded"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-80 rounded"
      />
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-[#F79F9F] text-white rounded hover:bg-blue-600 transition-colors duration-300"
      >
        로그인
      </button>
    </div>
  );
}
