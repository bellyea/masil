import { signInWithGoogle } from "../actions/auth-actions";

export default function LoginPage() {
  return (
    <div
      style={{
        padding: 40,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
      }}
    >
      <h1>로그인</h1>

      <p>
        이벤트 북마크와 개인화 기능을 이용하려면 로그인하세요.
      </p>

      <form action={signInWithGoogle}>
        <button type="submit">
          Google로 로그인
        </button>
      </form>
    </div>
  );
}