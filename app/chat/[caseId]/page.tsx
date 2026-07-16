"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Intro from "./components/Intro";
import ChatRoom from "./components/ChatRoom";

export default function ChatPage() {
  const params = useParams();
  const caseId = params.caseId as string;

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return <>{showIntro ? <Intro /> : <ChatRoom caseId={caseId} />}</>;
}
