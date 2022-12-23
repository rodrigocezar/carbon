import { Checkbox } from "@chakra-ui/react";

type IndeterminateCheckboxProps = {
  checked: boolean;
  indeterminate: boolean;
  [key: string]: any;
};

const IndeterminateCheckbox = ({
  indeterminate,
  checked,
  ...rest
}: IndeterminateCheckboxProps) => {
  return (
    <Checkbox
      colorScheme="blackAlpha"
      isChecked={checked}
      isIndeterminate={indeterminate}
      ml={2}
      {...rest}
    />
  );
};

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

export default IndeterminateCheckbox;
