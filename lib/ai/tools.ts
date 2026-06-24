export const tools = [
  {
    type: "function",

    function: {
      name: "search_events",

      description:
        "Search events by keyword or category",

      parameters: {
        type: "object",

        properties: {
          keyword: {
            type: "string",
          },

          category: {
            type: "string",

            enum: [
              "EXHIBITION",
              "POPUP",
              "FESTIVAL",
              "PERFORMANCE",
              "ETC",
            ],
          },
        },
      },
    },
  },

  {
    type: "function",

    function: {
      name: "get_trending_events",

      description:
        "Get currently trending events",

      parameters: {
        type: "object",

        properties: {},
      },
    },
  },
];