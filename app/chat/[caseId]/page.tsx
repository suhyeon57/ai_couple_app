"use client";

import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const caseId = params.caseId as string;

  return (
    <div>
      <h1>채팅방</h1>
      <p>Case ID: {caseId}</p>
    </div>
  );
}
