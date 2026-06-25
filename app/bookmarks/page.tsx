import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BookmarksClient from "./BookmarksClient";

export default async function BookmarksPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/bookmarks");
  }

  return <BookmarksClient />;
}
