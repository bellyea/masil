"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import styles from "./AiAssistant.module.css";

type EventItem = {
  id: string;
  title: string;
};

type ChatState = {
  messages: {
    role: "user" | "assistant";
    content: string;
    events?: { id: string; title: string }[];
  }[];
};



export default function AiAssistant() {
  const [message, setMessage] = useState("");

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("채팅 요청 실패");
      }

      return response.json();
    },
  });

  const handleAsk = () => {
    if (!message.trim()) return;

    chatMutation.mutate(message, {
      onSuccess: (data) => {
        const newMessages = [
          ...messages,
          {
            role: "user",
            content: message,
          },
          {
            role: "assistant",
            content: data.answer,
            events: data.events,
          },
        ];

        setMessages(newMessages);
        localStorage.setItem("chat", JSON.stringify(newMessages));
        setMessage("");
      },
    });
  };

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  return (
    <section className={styles.container}>
      <h2>🤖 AI Event Assistant</h2>

      <input
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAsk();
          }
        }}
        placeholder="전시 추천해줘"
      />

      <button
        onClick={handleAsk}
        disabled={chatMutation.isPending}
      >
        {chatMutation.isPending
         ? "검색 중..."
          : "질문하기"}
      </button>

      {messages.map((msg, idx) => (
        
      <div key={idx} className={msg.role === "user" ? styles.user : styles.ai}>
        {msg.role === "user" ? (
          <div>🙋 {msg.content}</div>
        ) : (
          <div style={{ whiteSpace: "pre-wrap" }}>
            🤖 {msg.content}

            {msg.events?.length > 0 && (
              <div>
                <br/><hr/><br/>
                <p>관련 이벤트</p><br/>
                <ul>
                  {msg.events.map((e: EventItem) => (
                    <li key={e.id}>
                      <Link href={`/events/${e.id}`}>
                        {e.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      ))}
    </section>
  );
}