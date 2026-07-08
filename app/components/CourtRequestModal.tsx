import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

export default function CourtRequestModal({ open, onClose, onSubmit }: Props) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-[400px]">
        <h2 className="text-xl font-bold mb-4">재판 신청</h2>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="재판을 신청하는 이유를 적어주세요."
          className="text-sm border rounded w-full h-32 p-3"
        />

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose}>취소</button>

          <button onClick={() => onSubmit(reason)}>신청하기</button>
        </div>
      </div>
    </div>
  );
}
