import { auth } from "@/auth";
import { useQuery } from "@tanstack/react-query";

export default async function HomePage() {
  const session = await auth();
  const { data } = useQuery({
    queryKey: ["trending"],
    queryFn: () => fetch("/api/events/trending").then((r) => r.json()),
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>홈</h1>

      {session ? <p>로그인됨: {session.user?.email}</p> : <p>로그인 안됨</p>}
      {data?.map((event: any) => (
        <div key={event.id}>
          {event.title} 👀 {event.viewers}
        </div>
      ))}
    </div>
  );
}
