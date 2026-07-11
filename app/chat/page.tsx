type Props = {
  params: {
    caseId: string;
  };
};

export default function ChatPage({ params }: Props) {
  const { caseId } = params;

  return (
    <div>
      <h1>채팅방</h1>
      <p>Case ID : {caseId}</p>
    </div>
  );
}
