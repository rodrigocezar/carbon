import { useSearchParams, useSubmit } from "@remix-run/react";
import { useCallback } from "react";

export function useUrlParams(): [
  URLSearchParams,
  (name: string, value?: string | number) => void
] {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  const setSearchParams = useCallback(
    (name: string, value?: string | number) => {
      if (value) {
        searchParams.set(name, value.toString());
      } else {
        searchParams.delete(name);
      }
      submit(searchParams);
    },
    [submit, searchParams]
  );

  return [searchParams, setSearchParams];
}
