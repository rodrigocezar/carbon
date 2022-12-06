import type { InputProps } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { useField } from "remix-validated-form";

type FormInputProps = InputProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
};

const Input = forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, label, isRequired, ...rest }, ref) => {
    const { getInputProps, error } = useField(name);

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <ChakraInput
          ref={ref}
          {...getInputProps({
            id: name,
            ...rest,
          })}
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Input.displayName = "Input";

export default Input;
