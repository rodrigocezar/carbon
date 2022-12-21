import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import type { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";

export function getCurrentPath(request: Request) {
  return new URL(request.url).pathname;
}

export function makeRedirectToFromHere(request: Request) {
  return new URLSearchParams([["redirectTo", getCurrentPath(request)]]);
}

export function getRedirectTo(request: Request, defaultRedirectTo = "/app") {
  const url = new URL(request.url);
  return safeRedirect(url.searchParams.get("redirectTo"), defaultRedirectTo);
}

export function isGet(request: Request) {
  return request.method.toLowerCase() === "get";
}

export function isPost(request: Request) {
  return request.method.toLowerCase() === "post";
}

export function isDelete(request: Request) {
  return request.method.toLowerCase() === "delete";
}

export function notFound(message: string) {
  return new Response(message, { status: 404 });
}

function notAllowedMethod(message: string) {
  return new Response(message, { status: 405 });
}

function badRequest(message: string) {
  return new Response(message, { status: 400 });
}

export function getRequiredParam(
  params: Record<string, string | undefined>,
  key: string
) {
  const value = params[key];

  if (!value) {
    throw badRequest(`Missing required request param "${key}"`);
  }

  return value;
}

export function assertIsPost(request: Request, message = "Method not allowed") {
  if (!isPost(request)) {
    throw notAllowedMethod(message);
  }
}

export function assertIsDelete(
  request: Request,
  message = "Method not allowed"
) {
  if (!isDelete(request)) {
    throw notAllowedMethod(message);
  }
}

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect = "/app"
) {
  if (
    !to ||
    typeof to !== "string" ||
    !to.startsWith("/") ||
    to.startsWith("//")
  ) {
    return defaultRedirect;
  }

  return to;
}

export function parseNumberFromUrlParam(
  params: URLSearchParams,
  key: string,
  defaultValue: number
): number {
  const value = params.get(key);
  if (!value) {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return defaultValue;
  }

  return parsed;
}

export type Sort = {
  sortBy: string;
  sortAsc: boolean;
};

export interface PaginationParams {
  limit: number;
  offset: number;
  sorts?: Sort[];
}

export function getQueryFilters(params: URLSearchParams): PaginationParams {
  const limit = parseNumberFromUrlParam(params, "limit", 15);
  const offset = parseNumberFromUrlParam(params, "offset", 0);

  const sortParams = params.getAll("sort");
  const sorts: Sort[] =
    sortParams.length > 0
      ? (sortParams
          .map((sort) => {
            const [sortBy, sortDirection] = sort.split(":");
            if (
              !sortBy ||
              !sortDirection ||
              !["asc", "desc"].includes(sortDirection)
            )
              return undefined;
            return { sortBy, sortAsc: sortDirection === "asc" };
          })
          .filter((sort) => sort !== undefined) as Sort[])
      : [];

  return { limit, offset, sorts };
}

export function setQueryFilters<
  T extends GenericSchema,
  U extends Record<string, unknown>,
  V
>(
  query: PostgrestFilterBuilder<T, U, V>,
  args: PaginationParams,
  defaultSort?: string
): PostgrestFilterBuilder<T, U, V> {
  if (args.sorts && args.sorts.length > 0) {
    args.sorts.forEach((sort) => {
      if (sort.sortBy.includes(".")) {
        const [table, column] = sort.sortBy.split(".");
        query = query.order(`${table}(${column})`, {
          ascending: sort.sortAsc,
        });
      } else {
        query = query.order(sort.sortBy, { ascending: sort.sortAsc });
      }
    });
  } else if (defaultSort) {
    query = query.order(defaultSort, {
      ascending: true,
    });
  }

  return query.range(args.offset, args.offset + args.limit - 1);
}
