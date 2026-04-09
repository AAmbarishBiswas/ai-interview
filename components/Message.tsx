export default function Message({ text, sender }: any) {
  return (
    <div className={sender === "user" ? "text-right" : "text-left"}>
      <p className="my-2 p-2 border rounded inline-block">
        {text}
      </p>
    </div>
  );
}