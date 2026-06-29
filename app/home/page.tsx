"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../src/lib/supabase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const [userCode, setUserCode] = useState("");
  const [isMatched, setIsMatched] = useState(false);
  const [coupleData, setCoupleData] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) return;
        const user = userData.user;
        if (!user) return;

        // users 테이블에서 couple_code, couple_id 조회
        const { data: row, error: rowError } = await supabase
          .from("users")
          .select("couple_code, couple_id")
          .eq("id", user.id)
          .single();

        if (rowError) {
          console.error(rowError);
          return;
        }

        if (row?.couple_code) setUserCode(row.couple_code);

        // couple_id가 있으면 couples 테이블에서 데이터 조회하여 매칭 화면으로 전환
        if (row?.couple_id) {
          const { data: couple, error: coupleErr } = await supabase
            .from("couples")
            .select("*")
            .eq("id", row.couple_id)
            .single();

          if (!coupleErr && couple) {
            setIsMatched(true);
            setCoupleData(couple);
          } else {
            console.error(coupleErr);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      {isMatched ? (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
          <h1 className="text-3xl font-bold">커플 매칭 완료!</h1>
          <div className="border p-2 w-80 rounded">
            <p>커플 코드: {userCode}</p>
            <p>커플 ID: {coupleData?.id}</p>
            <p>커플 이름: {coupleData?.name}</p>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
          <h1 className="text-3xl font-bold">Your Couple Code</h1>
          <div className="border p-2 w-80 rounded">{userCode}</div>

          <h1 className="text-3xl font-bold">아직 커플이 매칭되지 않았어요.</h1>

          <button onClick={() => router.push("/signup/couple-code")}>
            커플 코드 생성하러 가기
          </button>
        </div>
      )}
    </>
  );
}
