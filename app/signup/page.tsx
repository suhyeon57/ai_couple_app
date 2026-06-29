"use client";

import { useState } from "react";
import { supabase } from "../../src/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSignup = async () => {
    try {
      // 랜덤 커플 코드 생성
      const coupleCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      // Auth 회원가입
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data.user) {
        alert("회원가입 실패");
        return;
      }

      // users 테이블 저장
      const { error: userError } = await supabase.from("users").insert({
        id: data.user.id,
        nickname,
        birthday,
        couple_code: coupleCode,
      });

      if (userError) {
        alert(userError.message);
        return;
      }

      alert("회원가입 완료!");

      router.push("/home");
    } catch (err) {
      console.error(err);
      alert("오류 발생");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-3xl font-bold">Sign up</h1>

      <div className="items-start w-80">
        <h1 className="text-lg font-bold">Email</h1>
      </div>
      <input
        className="border p-2 w-80 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="items-start w-80">
        <h1 className="text-lg font-bold">Password</h1>
      </div>
      <input
        type="password"
        className="border p-2 w-80 rounded"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="items-start w-80">
        <h1 className="text-lg font-bold">Nickname</h1>
      </div>
      <input
        className="border p-2 w-80 rounded"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <div className="items-start w-80">
        <h1 className="text-lg font-bold">🎂 Birth date</h1>
      </div>
      <input
        type="date"
        className="border p-2 w-80 rounded"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="bg-black text-white px-6 py-2 rounded"
      >
        회원가입
      </button>
    </div>
  );
}
