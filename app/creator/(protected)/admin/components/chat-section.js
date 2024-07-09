"use client";
import { useEffect, useState } from "react";
import ChatBox from "./chat-box";

export default function ChatSection({ users, chats }) {
  const [selectedUser, setUser] = useState("");
  const [selectedChats, setChats] = useState([]);
  const [unread, setUnread] = useState([]);

  useEffect(() => {
    if (selectedUser.length === 0) return;
    const _chats = chats.filter(
      (chat) => chat.opener.toLowerCase() == selectedUser.toLocaleLowerCase()
    );
    setChats(_chats);
  }, [selectedUser]);

  useEffect(() => {
    const _unread = [];
    chats.forEach((c) => {
      if (c.readbyadmin == 0) {
        if (!_unread.includes(c.opener.toLowerCase())) {
          _unread.push(c.opener.toLowerCase());
        }
      }
    });
    setUnread(_unread);
  }, []);

  return (
    <div className="flex mt-20">
      <div className="basis-1/4 h-screen overflow-x-auto border-r border-zinc-400 break-all">
        {users?.map((u, i) => (
          <p
            className={`text-xs ${
              unread.includes(u.opener.toLowerCase())
                ? "text-blue-400"
                : "text-zinc-400"
            } hover:bg-zinc-800 p-1`}
            key={`user_${i}`}
            onClick={() => setUser(u.opener)}
          >
            {u.opener}
          </p>
        ))}
      </div>
      <div className="basis-3/4">
        <ChatBox opener={selectedUser} chats={selectedChats} />
      </div>
    </div>
  );
}
