export function firstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function searchPageHref(params: URLSearchParams, page: number) {
  const nextParams = new URLSearchParams(params);
  nextParams.set("page", String(page));
  return `/ogretmen-bul?${nextParams.toString()}`;
}

export function pageSearchParamsFromRecord(record: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  Object.entries(record).forEach(([key, value]) => {
    const normalized = firstSearchParam(value);
    if (normalized) params.set(key, normalized);
  });

  return params;
}
