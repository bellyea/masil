const CULTURE_API_BASE_URL = "https://apis.data.go.kr/B553457/cultureinfo";

type CultureListParams = {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  pageNo?: number;
  rows?: number;
};

type CultureApiPath = "period2" | "detail2";

function getCultureApiKey() {
  const key = process.env.CULTURE_API_KEY;

  if (!key) {
    throw new Error("CULTURE_API_KEY is missing");
  }

  return key;
}

function toApiDate(date?: string) {
  if (!date) return undefined;

  return date.replaceAll("-", "").replaceAll(".", "");
}

async function callCultureApi(path: CultureApiPath, params: URLSearchParams) {
  params.set("serviceKey", getCultureApiKey());

  const response = await fetch(
    `${CULTURE_API_BASE_URL}/${path}?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Culture API request failed: ${response.status}`);
  }

  return response.text();
}

export function fetchCultureEventListRaw(params: CultureListParams = {}) {
  const query = new URLSearchParams({
    PageNo: String(params.pageNo ?? 1),
    numOfrows: String(params.rows ?? 100),
    serviceTp: "A",
    from: toApiDate(params.startDate) ?? "20260101",
    to: toApiDate(params.endDate) ?? "20261231",
  });

  if (params.keyword) {
    query.set("keyword", params.keyword);
  }

  return callCultureApi("period2", query);
}

export function fetchCultureEventDetailRaw(seq: string) {
  return callCultureApi(
    "detail2",
    new URLSearchParams({
      seq,
    })
  );
}
