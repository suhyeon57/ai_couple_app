"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../src/lib/supabase";
import { useRouter } from "next/navigation";

export default function CoupleCodePage() {
  const router = useRouter();

  const [myCode, setMyCode] = useState("");
  const [coupleCode, setCoupleCode] = useState("");

  useEffect(() => {
    const fetchMyCode = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) return;
        const user = userData.user;
        if (!user) return;

        const { data, error } = await supabase
          .from("users")
          .select("couple_code")
          .eq("id", user.id)
          .single();

        if (error) return;
        if (data?.couple_code) setMyCode(data.couple_code);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyCode();
  }, []);

  const handleJoin = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) {
        alert(authError.message);
        return;
      }
      if (!user) {
        alert("로그인이 필요합니다.");
        return;
      }

      const { data: partnerData, error: partnerError } = await supabase
        .from("users")
        .select("*")
        .eq("couple_code", coupleCode)
        .single();

      if (partnerError) {
        alert(partnerError.message);
        return;
      }

      if (!partnerData) {
        alert("유효하지 않은 커플 코드입니다.");
        return;
      }

      const { data: coupleData, error: coupleError } = await supabase
        .from("couples")
        .insert({
          user1_id: user.id,
          user2_id: partnerData.id,
          start_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

      if (coupleError) {
        alert(coupleError.message);
        return;
      }

      await supabase
        .from("users")
        .update({ couple_id: coupleData.id })
        .eq("id", user.id);

      await supabase
        .from("users")
        .update({ couple_id: coupleData.id })
        .eq("id", partnerData.id);

      alert("커플 코드가 성공적으로 등록되었습니다!");
      router.push("/"); // 필요하면 "/signup/couple-code"에서 이동할 경로로 변경
    } catch (err) {
      console.error(err);
      alert("오류 발생");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-3xl font-bold">Join Couple</h1>

      <div className="items-start w-80">
        <h1 className="text-lg font-bold">Your Code</h1>
      </div>

      <div className="border p-2 w-80 rounded">{myCode}</div>

      <div className="items-start w-80">
        <h1 className="text-lg font-bold">Enter Couple Code</h1>
      </div>

      <input
        className="border p-2 w-80 rounded"
        placeholder="Couple Code"
        value={coupleCode}
        onChange={(e) => setCoupleCode(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white p-2 rounded w-80"
        onClick={handleJoin}
      >
        Join
      </button>
    </div>
  );
}
