import { useQuery } from "@tanstack/react-query";

export function useEvent(id: string | string[] | undefined) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await fetch(`/api/events/${id}`);
      return res.json();
    },
    enabled: !!id,
  });
}