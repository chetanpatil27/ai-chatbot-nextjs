"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getChatResponse } from "../services/openai";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("_chat");
      const storedMessages = stored ? JSON.parse(stored) : [];
      setMessages(storedMessages);
    }
    setIsMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (listRef.current && isMounted) {
      scrollToBottom();
    }
  }, [messages, isTyping, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("_chat", JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  const sendMessage = async (text?: string) => {
    const t = (text ?? value).trim();
    if (!t) return;

    const userMsg: Message = { id: String(Date.now()), role: "user", text: t };
    setMessages((m) => [...m, userMsg]);
    setValue("");
    setIsTyping(true);

    const res = await getChatResponse(t);

    if (res?.error) {
      alert(res.error.message);
      setIsTyping(false);
    } else if (res?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const assistantMsg: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: res.candidates[0].content.parts[0].text,
      };
      setMessages((m) => [...m, assistantMsg]);

      setIsTyping(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearchat = () => {
    setMessages([]);
    localStorage.removeItem("_chat");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center text-gray-900">
      <div className="flex-1 w-full flex flex-col max-w-4xl">
        {!isMounted || messages.length === 0 ? (
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
            className="flex-1 overflow-auto px-4 py-6 space-y-4 scroll-smooth min-h-0"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] overflow-auto px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gray-900 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-md"
                  }`}
                >
                  <ReactMarkdown>{m.text}</ReactMarkdown>
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

      <div className="sticky bottom-0 w-full bg-linear-to-t from-white via-white/90 to-transparent pt-3 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 border border-gray-200 bg-white rounded-3xl px-4 py-2 shadow-sm focus-within:shadow-md transition-all">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Send a message..."
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-gray-900 text-sm py-2 placeholder:text-gray-400"
            />
            {messages.length !== 0 ? (
              <button
                onClick={clearchat}
                className="flex items-center justify-center rounded-full text-black/70 hover:underline cursor-pointer"
              >
                clear chat
              </button>
            ) : null}

            <button
              onClick={() => sendMessage()}
              disabled={!value.trim() || isTyping}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40 transition"
              aria-label="Send"
            >
              ⬆️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
