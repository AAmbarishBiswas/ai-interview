import Message from "./Message";

export default function ChatBox({ messages }: any) {
  return (
    <div className="h-[400px] overflow-y-auto border p-2">
      {messages.map((msg: any, i: number) => (
        <Message key={i} text={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
}