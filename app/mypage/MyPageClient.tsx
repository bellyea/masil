"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

type Props = {
  initialEmail: string;
  initialNickname: string;
};

export default function MyPageClient({ initialEmail, initialNickname }: Props) {
  const router = useRouter();
  const [nickname, setNickname] = useState(initialNickname);
  const [draft, setDraft] = useState(initialNickname);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function saveNickname(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSaving(true);

    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname: draft.trim() }),
    });

    const data = await res.json().catch(() => null);
    setIsSaving(false);

    if (!res.ok) {
      setMessage(data?.error ?? "닉네임을 저장하지 못했어요.");
      return;
    }

    setNickname(data.nickname);
    setDraft(data.nickname);
    setMessage("닉네임을 저장했어요.");
    router.refresh();
  }

  return (
    <main className="mypage-page masil-page">
      <section className="mypage-panel soft-panel">
        <p className="home-eyebrow">My Page</p>
        <h1>{nickname} 님의 마실</h1>
        <p className="muted-copy">나들이 기록을 쌓기 전, 표시 이름부터 가볍게 정해둘 수 있어요.</p>

        <form className="profile-form" onSubmit={saveNickname}>
          <label htmlFor="nickname">닉네임</label>
          <div className="profile-form__row">
            <input
              id="nickname"
              value={draft}
              maxLength={20}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="마실러"
            />
            <button type="submit" disabled={isSaving || !draft.trim()}>
              {isSaving ? "저장 중" : "저장"}
            </button>
          </div>
          {message && <p className="form-message">{message}</p>}
        </form>

        <dl className="profile-facts">
          <div>
            <dt>이메일</dt>
            <dd>{initialEmail}</dd>
          </div>
          <div>
            <dt>북마크</dt>
            <dd>
              <Link href="/bookmarks" className="profile-link-button">
                저장한 행사 보기
              </Link>
            </dd>
          </div>
        </dl>

        <section className="account-zone">
          <h2>계정</h2>
          <button
            type="button"
            onClick={async () => {
              const ok = confirm("정말로 탈퇴하시겠어요?");

              if (!ok) return;

              await fetch("/api/me/delete", {
                method: "DELETE",
              });

              await signOut({ callbackUrl: "/" });
            }}
          >
            회원 탈퇴
          </button>
        </section>
      </section>
    </main>
  );
}
