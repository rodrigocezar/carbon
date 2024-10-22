import { Select } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useRef } from "react";
import { useControlField, useField } from "remix-validated-form";
import type {
  CustomerContact as CustomerContactType,
  getCustomerContacts,
} from "~/modules/sales";
import { path } from "~/utils/path";
import type { SelectProps } from "./Select";

type CustomerContactSelectProps = Omit<SelectProps, "options" | "onChange"> & {
  customer?: string;
  onChange?: (customerContact: CustomerContactType | undefined) => void;
};

const CustomerContact = ({
  name,
  label = "Customer Contact",
  customer,
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Customer Contact",
  onChange,
  ...props
}: CustomerContactSelectProps) => {
  const initialLoad = useRef(true);
  const { error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const customerContactFetcher =
    useFetcher<Awaited<ReturnType<typeof getCustomerContacts>>>();

  useEffect(() => {
    if (customer) {
      customerContactFetcher.load(path.to.api.customerContacts(customer));
    }

    if (initialLoad.current) {
      initialLoad.current = false;
    } else {
      setValue(undefined);
      if (onChange) {
        onChange(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const options = useMemo(
    () =>
      customerContactFetcher.data?.data
        ? customerContactFetcher.data?.data.map((c) => ({
            value: c.id,
            // @ts-ignore
            label: `${c.contact?.firstName} ${c.contact?.lastName}`,
          }))
        : [],
    [customerContactFetcher.data]
  );

  const handleChange = (selection: {
    value: string | number;
    label: string;
  }) => {
    const newValue = (selection.value as string) || undefined;
    setValue(newValue);
    if (onChange && typeof onChange === "function") {
      if (newValue === undefined) onChange(newValue);
      const contact = customerContactFetcher.data?.data?.find(
        (c) => c.id === newValue
      );

      onChange(contact);
    }
  };

  const controlledValue = useMemo(
    // @ts-ignore
    () => options.find((option) => option.value === value),
    [value, options]
  );

  // so that we can call onChange on load
  useEffect(() => {
    if (controlledValue && controlledValue.value === defaultValue) {
      handleChange(controlledValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledValue?.value]);

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <input type="hidden" name={name} id={name} value={value} />
      <Select
        {...props}
        value={controlledValue}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
        // @ts-ignore
        onChange={handleChange}
        w="full"
      />
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

CustomerContact.displayName = "CustomerContact";

export default CustomerContact;
