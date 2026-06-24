import { searchEvents } from "@/lib/mcp/tools/searchEvents";
import { getEventDetail } from "@/lib/mcp/tools/getEventDetail";
import { getTrendingEvents } from "@/lib/mcp/tools/getTrendingEvents";

export async function executeTool(name: string, args: any) {
  switch (name) {
    case "search_events":
      return searchEvents(args);

    case "get_event_detail":
      return getEventDetail(args.id);

    case "get_trending_events":
      return getTrendingEvents();

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
