interface MessageItemProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageItem({ role, content }: MessageItemProps) {
  return (
    <div
      className={`mb-3 flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`rounded-lg p-3 ${role === "user" ? " text-white" : " "}`}
      >
        {content}
      </div>
    </div>
  );
}
