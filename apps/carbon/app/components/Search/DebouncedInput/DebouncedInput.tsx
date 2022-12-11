import { useDebounce } from "@carbon/react";
import type { InputProps } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUrlParams } from "~/hooks";

type DebounceInputProps = InputProps & {
  param: string;
};

const DebouncedInput = ({ param, ...props }: DebounceInputProps) => {
  const [params, setParams] = useUrlParams();
  const [query, setQuery] = useState(params.get(param) || "");
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    setParams({ [param]: debouncedQuery, limit: undefined, offset: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <Input
      defaultValue={params.get(param) || ""}
      onChange={(e) => setQuery(e.target.value)}
      {...props}
    />
  );
};

export default DebouncedInput;
