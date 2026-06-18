import { useQuery } from "@tanstack/react-query";
import { fetchEvent } from "@/app/lib/api/event";

export function useEvent(id: string | string[] | undefined) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent(id as string),
    enabled: !!id,
  });
}