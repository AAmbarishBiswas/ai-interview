export default function InputBox({ input, setInput, sendMessage }: any) {
  return (
    <div className="flex gap-2 mt-2">
      <input
        className="border p-2 w-full"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your answer..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}