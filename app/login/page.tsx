import { signInWithGoogle } from "../actions/auth-actions";

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl || "/";

  return (
    <main className="auth-page masil-page">
      <section className="auth-panel soft-panel">
        <p className="home-eyebrow">Login</p>
        <h1>마실을 이어서 둘러볼까요?</h1>
        <p>
          북마크와 마이페이지는 로그인 후 사용할 수 있어요. 별도 가입 없이 Google 계정으로 바로 시작합니다.
        </p>

        <form action={signInWithGoogle} className="auth-action-form">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <button type="submit" className="primary-action">
            Google로 로그인
          </button>
        </form>
      </section>
    </main>
  );
}

