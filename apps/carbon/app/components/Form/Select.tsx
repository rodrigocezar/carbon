import { Select as CarbonSelect } from "@carbon/react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useField } from "remix-validated-form";

type SelectProps = {
  name: string;
  label: string;
  isLoading?: boolean;
  options: { value: string | number; label: string }[];
  placeholder?: string;
};

const Select = ({
  name,
  label,
  isLoading,
  options,
  placeholder,
}: SelectProps) => {
  const { getInputProps, error } = useField(name);

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <CarbonSelect
        {...getInputProps({
          id: name,
        })}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

Select.displayName = "Select";

export default Select;
