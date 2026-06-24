import { auth } from "@/auth";
import TrendingEvents from "@/components/event/TrendingEvents";

export default async function HomePage() {
  const session = await auth();

  return (
    <div style={{ padding: 20 }}>
      <h1>홈</h1>

      {session ? <p>로그인됨: {session.user?.email}</p> : <p>로그인 안됨</p>}
      <main>
        <TrendingEvents />
      </main>
    </div>
  );
}
