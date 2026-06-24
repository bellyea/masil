import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleBookmark } from "@/app/lib/api/bookmark";

export default function BookmarkButton({
  id,
  isBookmarked,
}: {
  id: string;
  isBookmarked?: boolean;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => toggleBookmark(id as string),

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
