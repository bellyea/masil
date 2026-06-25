import { auth } from "@/auth";
import Link from "next/link";
import TrendingEvents from "@/components/event/TrendingEvents";
import AiAssistant from "@/components/ai/AiAssistant";

const categoryLinks = [
  {
    href: "/events?category=EXHIBITION",
    icon: "▣",
    label: "전시",
    description: "조용히 오래 머무는 오늘의 전시",
  },
  {
    href: "/events?category=THEATER",
    icon: "◐",
    label: "공연",
    description: "무대 위에서 펼쳐지는 이야기",
  },
];

export default async function HomePage() {
  const session = await auth();
  const userLabel = session?.user?.nickname ?? session?.user?.name;

  return (
    <main className="home-page masil-page">
      <section className="home-shell masil-shell" aria-label="Masil 홈">
        <div className="home-copy">
          <p className="home-eyebrow">Masil 문화 산책</p>
          <h1>전시와<br /> 공연을<br /> 마실 가듯<br /> 가볍게</h1>
          <p className="home-subtitle">
            공공 문화정보를 모아 보고,<br />
            마음에 드는 행사는 북마크하고,<br />
            AI에게 가볍게 추천을 물어볼 수 있어요.
          </p>
          <p className="home-session">
            {userLabel
              ? `${userLabel} 님, 오늘의 마실을 골라볼까요?`
              : "로그인하면 북마크를 모아볼 수 있어요."}
          </p>
        </div>

        <TrendingEvents />

        <aside className="home-side" aria-label="추천과 바로가기">
          <AiAssistant compact />

          <nav className="category-shortcuts" aria-label="주요 카테고리 바로가기">
            {categoryLinks.map((item) => (
              <Link key={item.href} href={item.href} className="category-shortcut">
                <span className="category-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              </Link>
            ))}
          </nav>
        </aside>
      </section>
    </main>
  );
}

