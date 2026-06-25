import { useInfiniteQuery } from "@tanstack/react-query";

type Params = {
  key: string[];
  url: string;
  extraParams?: Record<string, string | undefined>;
};

export function useInfiniteList<TPage extends { nextCursor?: string | null }>({
  key,
  url,
  extraParams,
}: Params) {
  return useInfiniteQuery<TPage>({
    queryKey: key,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();

      if (pageParam) params.set("cursor", String(pageParam));

      if (extraParams) {
        Object.entries(extraParams).forEach(([k, v]) => {
          if (v) params.set(k, v);
        });
      }

      const res = await fetch(`${url}?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch list");
      }

      return (await res.json()) as TPage;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
