const viewerMap = new Map<string, Set<string>>();

export const viewerStore = {
  getMap: () => viewerMap,

  join: (eventId: string, socketId: string) => {
    if (!viewerMap.has(eventId)) {
      viewerMap.set(eventId, new Set());
    }

    const set = viewerMap.get(eventId)!;

    if (set.has(socketId)) return;

    set.add(socketId);
  },

  leave: (eventId: string, socketId: string) => {
    const set = viewerMap.get(eventId);
    if (!set) return;

    set.delete(socketId);

    if (set.size === 0) {
      viewerMap.delete(eventId);
    }
  },

  removeSocket: (socketId: string): string[] => {
    const affectedEvents: string[] = [];

    viewerMap.forEach((sockets, eventId) => {
      if (sockets.has(socketId)) {
        sockets.delete(socketId);

        if (sockets.size === 0) {
          viewerMap.delete(eventId);
        }

        affectedEvents.push(eventId);
      }
    });

    return affectedEvents;
  },

  getCount: (eventId: string) => viewerMap.get(eventId)?.size || 0,
};