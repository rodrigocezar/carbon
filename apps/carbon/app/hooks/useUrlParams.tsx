import { useSearchParams, useSubmit } from "@remix-run/react";
import { useCallback } from "react";

export function useUrlParams(): [
  URLSearchParams,
  (params: Record<string, string | number | undefined | null>) => void
] {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  const setSearchParams = useCallback(
    (params: Record<string, string | number | undefined | null>) => {
      Object.entries(params).forEach(([name, value]) => {
        if (value) {
          searchParams.set(name, value.toString());
        } else {
          searchParams.delete(name);
        }
      });

      submit(searchParams);
    },
    [submit, searchParams]
  );

  return [searchParams, setSearchParams];
}
