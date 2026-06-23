"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function MyPage() {
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then(setMe);
  }, []);

  if (!me) return <p>로딩중...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>My Page</h1>

      {/* 유저 정보 */}
      <section style={{ marginBottom: 20 }}>
        <h2>내 정보</h2>
        <p>닉네임: {me.nickname}</p>
        <p>이메일: {me.email}</p>
      </section>

      {/* 북마크 요약 */}
      <section style={{ marginBottom: 20 }}>
        <h2>북마크</h2>
        <a href="/bookmarks">북마크 보기 →</a>
      </section>

      {/* 회원탈퇴 */}
      <section>
        <h2>계정</h2>
        <button
          onClick={async () => {
            const ok = confirm("정말로 탈퇴하시겠습니까?");

            if (!ok) return;

            await fetch("/api/me/delete", {
              method: "DELETE",
            });

            await signOut({ callbackUrl: "/" });

            alert("탈퇴 완료");
          }}
        >
          회원 탈퇴
        </button>
      </section>
    </div>
  );
}