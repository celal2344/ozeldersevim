export type SortDirection = "asc" | "desc";

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type ListMeta = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sort?: string;
  order?: SortDirection;
  filters?: Record<string, string | number | boolean>;
};

export type ListResponse<TItem> = {
  data: TItem[];
  meta: ListMeta;
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaults: Partial<PaginationParams> = {}
): PaginationParams {
  const page = Number(searchParams.get("page") ?? defaults.page ?? DEFAULT_PAGE);
  const pageSize = Number(searchParams.get("pageSize") ?? defaults.pageSize ?? DEFAULT_PAGE_SIZE);

  return {
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : DEFAULT_PAGE,
    pageSize:
      Number.isFinite(pageSize) && pageSize > 0
        ? Math.min(Math.floor(pageSize), MAX_PAGE_SIZE)
        : defaults.pageSize ?? DEFAULT_PAGE_SIZE,
  };
}

export function paginateItems<TItem>(
  items: TItem[],
  params: PaginationParams,
  meta: Omit<ListMeta, "total" | "page" | "pageSize" | "totalPages"> = {}
): ListResponse<TItem> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize));
  const page = Math.min(params.page, totalPages);
  const start = (page - 1) * params.pageSize;

  return {
    data: items.slice(start, start + params.pageSize),
    meta: {
      ...meta,
      total,
      page,
      pageSize: params.pageSize,
      totalPages,
    },
  };
}
