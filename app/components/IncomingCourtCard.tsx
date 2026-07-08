type IncomingCourtCardProps = {
  reason: string;
  onAccept: () => void;
  onReject: () => void;
};

export default function IncomingCourtCard({
  reason,
  onAccept,
  onReject,
}: IncomingCourtCardProps) {
  return (
    <div className="text-2xl text-center flex flex-col items-center justify-center gap-10 p-4">
      <div className="rounded-xl border p-5 shadow-md bg-white w-[400px]">
        <h2 className="text-xl font-bold ">⚖️ 재판 소환장</h2>

        <p className="mt-3 text-gray-600">상대방이 재판을 신청했습니다.</p>

        <div className="mt-4 rounded bg-gray-100 p-3">{reason}</div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onAccept}
            className="flex-1 rounded bg-blue-500 py-2 text-white"
          >
            수락
          </button>

          <button
            onClick={onReject}
            className="flex-1 rounded bg-red-500 py-2 text-white"
          >
            거절
          </button>
        </div>
      </div>
    </div>
  );
}
