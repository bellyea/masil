import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function BookmarkButton({
  id,
  isBookmarked,
}: {
  id: string;
  isBookmarked?: boolean;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "test-user",
          eventId: id,
        }),
      });

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmark", id] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  return (
    <button onClick={() => mutation.mutate()}>
      {isBookmarked ? "❤️ 북마크됨" : "🤍 북마크"}
    </button>
  );
}