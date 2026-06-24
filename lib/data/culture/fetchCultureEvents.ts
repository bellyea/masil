import {
  fetchCultureEventDetailRaw,
  fetchCultureEventListRaw,
} from "./cultureClient";
import {
  parseCultureEventDetailXML,
  parseCultureEventListXML,
} from "./parseCultureXML";

export async function fetchCultureEvents(
  args: {
    keyword?: string;
    startDate?: string;
    endDate?: string;
  } = {}
) {
  const xml = await fetchCultureEventListRaw(args);

  return parseCultureEventListXML(xml);
}

export async function fetchCultureEventDetail(seq: string) {
  const xml = await fetchCultureEventDetailRaw(seq);

  return parseCultureEventDetailXML(xml);
}
