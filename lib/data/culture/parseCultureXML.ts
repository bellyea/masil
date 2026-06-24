import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: true,
  trimValues: true,
});

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

type CultureXmlItem = {
  seq?: unknown;
  title?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  place?: unknown;
  realmName?: unknown;
  thumbnail?: unknown;
  gpsX?: unknown;
  gpsY?: unknown;
  contents1?: unknown;
  url?: unknown;
  placeAddr?: unknown;
  imgUrl?: unknown;
  price?: unknown;
};

export type CultureEventListItem = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  place?: string;
  category?: string;
  thumbnail?: string;
  lat?: number;
  lng?: number;
};

export type CultureEventDetail = {
  id: string;
  title?: string;
  description?: string;
  website?: string;
  address?: string;
  image?: string;
  price?: string;
  lat?: number;
  lng?: number;
};

function toNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

export function parseCultureEventListXML(xml: string): CultureEventListItem[] {
  const parsed = parser.parse(xml);
  const items = parsed?.response?.body?.items?.item;

  return toArray<CultureXmlItem>(items)
    .filter((item) => item?.seq && item?.title && item?.startDate && item?.endDate)
    .map((item) => ({
      id: String(item.seq),
      title: String(item.title),
      startDate: String(item.startDate),
      endDate: String(item.endDate),
      place: item.place ? String(item.place) : undefined,
      category: item.realmName ? String(item.realmName) : undefined,
      thumbnail: item.thumbnail ? String(item.thumbnail) : undefined,
      lat: toNumber(item.gpsY),
      lng: toNumber(item.gpsX),
    }));
}

export function parseCultureEventDetailXML(
  xml: string
): CultureEventDetail | null {
  const parsed = parser.parse(xml);
  const item = toArray<CultureXmlItem>(parsed?.response?.body?.items?.item)[0];

  if (!item?.seq) return null;

  return {
    id: String(item.seq),
    title: item.title ? String(item.title) : undefined,
    description: item.contents1 ? String(item.contents1) : undefined,
    website: item.url ? String(item.url) : undefined,
    address: item.placeAddr ? String(item.placeAddr) : undefined,
    image: item.imgUrl ? String(item.imgUrl) : undefined,
    price: item.price ? String(item.price) : undefined,
    lat: toNumber(item.gpsY),
    lng: toNumber(item.gpsX),
  };
}
