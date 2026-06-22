import { useInfiniteQuery } from "@tanstack/react-query";

type Params = {
  key: string[];
  url: string;
  extraParams?: Record<string, string | undefined>;
};

export function useInfiniteList({ key, url, extraParams }: Params) {
  return useInfiniteQuery({
    queryKey: key,

    initialPageParam: undefined,

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();

      if (pageParam) params.set("cursor", pageParam);

      if (extraParams) {
        Object.entries(extraParams).forEach(([k, v]) => {
          if (v) params.set(k, v);
        });
      }

      const res = await fetch(`${url}?${params.toString()}`);
      return res.json();
    },

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}