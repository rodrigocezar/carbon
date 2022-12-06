import type { InputProps } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  Input as ChakraInput,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { useField } from "remix-validated-form";

type FormHiddenProps = InputProps & {
  name: string;
};

const Hidden = forwardRef<HTMLInputElement, FormHiddenProps>(
  ({ name, ...rest }, ref) => {
    const { getInputProps, error } = useField(name);

    return (
      <FormControl isInvalid={!!error}>
        <ChakraInput
          ref={ref}
          {...getInputProps({
            id: name,
            ...rest,
          })}
          type="hidden"
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Hidden.displayName = "Hidden";

export default Hidden;
