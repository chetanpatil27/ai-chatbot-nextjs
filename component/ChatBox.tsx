"use client";
import React, { useEffect, useRef, useState } from "react";
import { getChatResponse } from "../services/openai";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const t = (text ?? value).trim();
    if (!t) return;
    const userMsg: Message = { id: String(Date.now()), role: "user", text: t };
    setMessages((m) => [...m, userMsg]);
    setValue("");

    setIsTyping(true);
    const res = await getChatResponse(t);
    if (res?.error) {
      setMessages((m) => [
        ...m,
        { id: String(Date.now()), role: "assistant", text: res.error.message },
      ]);
    } else {
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now()),
          role: "assistant",
          text: res.choices[0].message.content,
        },
      ]);
    }
    setIsTyping(false);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center text-gray-900">
      <div className="flex-1 w-full flex flex-col max-w-4xl">
        {/* Welcome state */}
        {messages.length === 0 ? (
          <div className="flex flex-col flex-1 items-center justify-center text-center px-4">
            <h1 className="text-3xl font-semibold text-gray-900">
              Hello there!
            </h1>
            <p className="mt-2 text-gray-500 text-lg">
              How can I help you today?
            </p>
          </div>
        ) : (
          <div
            ref={listRef}
            className="flex-1 overflow-auto px-4 py-6 space-y-4 scroll-smooth"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gray-900 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400 text-lg px-2">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-150">●</span>
                <span className="animate-bounce delay-300">●</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat input area */}
      <div className="sticky bottom-0 w-full bg-linear-to-t from-white via-white/90 to-transparent pt-3 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-end gap-3 border border-gray-200 bg-white rounded-3xl px-4 py-2 shadow-sm focus-within:shadow-md transition-all">
            {/* Textarea */}
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Send a message..."
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-gray-900 text-sm py-2 placeholder:text-gray-400"
            />

            {/* Send button */}
            <button
              onClick={() => sendMessage()}
              disabled={!value.trim()}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40 transition"
              aria-label="Send"
            >
              ⬆️
            </button>
          </div>

          {/* <p className="text-xs text-gray-400 text-center mt-2">
            Press <span className="font-medium text-gray-500">Enter</span> to
            send •{" "}
            <span className="font-medium text-gray-500">Shift+Enter</span> for
            newline
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
