import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MyPageClient from "./MyPageClient";

export default async function MyPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/mypage");
  }

  return (
    <MyPageClient
      initialEmail={session.user.email}
      initialNickname={session.user.nickname ?? session.user.name ?? "마실러"}
    />
  );
}
