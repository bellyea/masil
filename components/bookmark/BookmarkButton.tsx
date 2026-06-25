"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleBookmark } from "@/app/lib/api/bookmark";

type BookmarkButtonProps = {
  id: string;
  isBookmarked?: boolean;
  className?: string;
  compact?: boolean;
};

export default function BookmarkButton({
  id,
  isBookmarked = false,
  className = "",
  compact = false,
}: BookmarkButtonProps) {
  const queryClient = useQueryClient();
  const [override, setOverride] = useState<boolean | null>(null);
  const active = override ?? isBookmarked;

  const mutation = useMutation({
    mutationFn: () => toggleBookmark(id),
    onMutate: () => {
      setOverride(!active);
    },
    onError: () => {
      setOverride(active);
    },
    onSuccess: (data) => {
      if (typeof data?.isBookmarked === "boolean") {
        setOverride(data.isBookmarked);
      }
      queryClient.invalidateQueries({ queryKey: ["bookmark", id] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const label = active ? "북마크 해제" : "북마크 추가";

  return (
    <button
      type="button"
      className={`bookmark-button ${className}`}
      data-active={active}
      aria-pressed={active}
      aria-label={label}
      title={label}
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      <span className="bookmark-button__icon" aria-hidden="true">
        {active ? "♥" : "♡"}
      </span>
      {!compact && <span>{active ? "저장됨" : "북마크"}</span>}
    </button>
  );
}
