"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "../../src/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CourtRequestModal from "../components/CourtRequestModal";

export default function HomePage() {
  const router = useRouter();

  const [userCode, setUserCode] = useState("");
  const [isMatched, setIsMatched] = useState(false);
  const [coupleData, setCoupleData] = useState<any | null>(null);
  const [userNickname, setUserNickname] = useState("");
  const [partnerNickname, setPartnerNickname] = useState("");
  const [open, setOpen] = useState(false);

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
            console.log("coupleData:", couple);
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

  useEffect(() => {
    const fetchNicknames = async () => {
      if (!coupleData) return; // coupleData가 준비된 후에 실행

      try {
        // 현재 로그인 유저 아이디 가져오기
        const { data: authData, error: authErr } =
          await supabase.auth.getUser();
        if (authErr) {
          console.error(authErr);
          return;
        }
        const currentUser = authData.user;
        if (!currentUser) return;

        // 내 닉네임 조회
        const { data: me, error: meErr } = await supabase
          .from("users")
          .select("id,nickname")
          .eq("id", currentUser.id)
          .single();
        if (meErr) {
          console.error(meErr);
          return;
        }

        // coupleData에서 상대 id 결정
        const partnerId =
          coupleData.user1_id === me.id
            ? coupleData.user2_id
            : coupleData.user1_id;

        // 상대 닉네임 조회
        const { data: partner, error: partnerErr } = await supabase
          .from("users")
          .select("id,nickname")
          .eq("id", partnerId)
          .single();
        if (partnerErr) {
          console.error(partnerErr);
          return;
        }

        setUserNickname(me.nickname);
        setPartnerNickname(partner.nickname);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNicknames();
  }, [coupleData]);

  const handleCourtRequest = async (reason: string) => {
    await supabase.from("cases").insert({
      couple_id: coupleData.id,
      created_by: coupleData.user1_id,
      reason,
      status: "pending",
    });

    setOpen(false);
  };

  return (
    <>
      {isMatched ? (
        <div className="text-2xl flex min-h-screen flex-col items-center justify-center gap-10 p-4">
          <h1 className="text-3xl font-bold">뿌엥 로그</h1>
          <div className="text-center p-2 w-80">
            <p>
              {userNickname} ❤️ {partnerNickname}
            </p>
            <p>Since {coupleData?.start_date}</p>
            <p>
              D+
              {coupleData?.start_date
                ? Math.floor(
                    (new Date().getTime() -
                      new Date(coupleData.start_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0}
            </p>
          </div>
          <Image
            src="/logo.png"
            alt="뿌엥"
            width={120}
            height={120}
            priority
            className="rounded-full hover:scale-105 transition-transform duration-300"
          />
          <p>뿌엥이 대기중</p>
          <button
            className="bg-[#F79F9F] text-white p-2 rounded w-80"
            onClick={() => setOpen(true)}
          >
            싸울 준비 완료 🚨
          </button>
          <CourtRequestModal
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleCourtRequest}
          />
          <div className="flex flex-row gap-8">
            <button className="bg-[#F79F9F] text-white p-2 rounded w-40">
              싸움 기록
            </button>
            <button className="bg-[#F79F9F] text-white p-2 rounded w-40">
              화해 기록
            </button>
          </div>
          <p>오늘의 커플 온도 </p>
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
