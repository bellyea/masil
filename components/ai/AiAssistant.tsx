"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import styles from "./AiAssistant.module.css";

type EventItem = {
  id: string;
  title: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  events?: EventItem[];
};

type AiAssistantProps = {
  compact?: boolean;
};

export default function AiAssistant({ compact = false }: AiAssistantProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const chatMutation = useMutation({
    mutationFn: async (value: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: value,
        }),
      });

      if (!response.ok) {
        throw new Error("채팅 요청에 실패했어요.");
      }

      return response.json() as Promise<{ answer: string; events?: EventItem[] }>;
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("chat");
    if (!saved) return;

    try {
      window.setTimeout(() => setMessages(JSON.parse(saved) as ChatMessage[]), 0);
    } catch {
      localStorage.removeItem("chat");
    }
  }, []);

  const handleAsk = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    chatMutation.mutate(trimmed, {
      onSuccess: (data) => {
        const nextMessages: ChatMessage[] = [
          ...messages,
          {
            role: "user",
            content: trimmed,
          },
          {
            role: "assistant",
            content: data.answer,
            events: data.events ?? [],
          },
        ];

        setMessages(nextMessages);
        localStorage.setItem("chat", JSON.stringify(nextMessages));
        setMessage("");
      },
    });
  };

  const visibleMessages = compact ? messages.slice(-3) : messages;

  return (
    <section
      className={`${styles.container} ${compact ? styles.compact : ""}`}
      aria-label="AI 행사 추천 채팅"
    >
      <div className={styles.header}>
        <span className={styles.mark} aria-hidden="true">
          ✦
        </span>
        <div>
          <h2>AI 추천실</h2>
          <p>기분이나 지역을 말하면 어울리는 행사를 찾아드려요.</p>
        </div>
      </div>

      <div className={styles.messages}>
        {visibleMessages.length === 0 ? (
          <div className={styles.empty}>
            “이번 주말에 갈 전시 추천해줘”처럼 물어보세요.
          </div>
        ) : (
          visibleMessages.map((msg, idx) => (
            <div
              key={`${msg.role}-${idx}`}
              className={msg.role === "user" ? styles.user : styles.ai}
            >
              <p>{msg.content}</p>

              {msg.events && msg.events.length > 0 && (
                <ul className={styles.eventLinks}>
                  {msg.events.map((event) => (
                    <li key={event.id}>
                      <Link href={`/events/${event.id}`}>{event.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>

      {chatMutation.isError && (
        <p className={styles.error}>잠시 후 다시 질문해 주세요.</p>
      )}

      <div className={styles.form}>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleAsk();
            }
          }}
          placeholder="전시 추천해줘"
          aria-label="AI에게 물어볼 내용"
        />
        <button onClick={handleAsk} disabled={chatMutation.isPending} type="button">
          {chatMutation.isPending ? "찾는 중" : "질문"}
        </button>
      </div>
    </section>
  );
}