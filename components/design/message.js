import { getDate } from "@/utils/string-utils";

export default function Message({ data, reader = "user" }) {
  return (
    <div className="hover:bg-zinc-800 p-2">
      {data.sender === "user" && (
        <p className="text-tock-green font-bold text-xs">
          {reader === "user" ? "You: " : "User: "}
          <span className="text-end text-xs text-zinc-500">
            {getDate(data.date)}
          </span>
        </p>
      )}
      {data.sender === "admin" && (
        <p className="text-tock-orange font-bold text-xs">
          {reader === "user" ? "Mod: " : "You: "}
          <span className="text-end text-xs text-zinc-500">
            {getDate(data.date)}
          </span>
        </p>
      )}
      <div className="p-2">
        <p className="text-sm text-zinc-300">{data.content}</p>
      </div>
    </div>
  );
}
