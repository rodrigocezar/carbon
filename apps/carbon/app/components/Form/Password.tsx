import type { InputProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { useField } from "remix-validated-form";

type FormPasswordProps = {
  name: string;
  label?: string;
  isRequired?: boolean;
};

const Password = ({
  name,
  label,
  isRequired,
  ...rest
}: FormPasswordProps & InputProps) => {
  const { getInputProps, error } = useField(name);
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <InputGroup size="md">
        <Input
          {...getInputProps({
            id: name,
            ...rest,
          })}
          type={passwordVisible ? "text" : "password"}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default Password;
