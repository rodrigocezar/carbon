import type { MutableRefObject, ReactElement, RefAttributes } from "react";
import { forwardRef } from "react";
import type { GroupBase, Props, SelectInstance } from "react-select";
import ReactSelect from "react-select";
import useChakraSelectProps from "../use-chakra-select-props";

export type SelectComponent = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group> &
    RefAttributes<SelectInstance<Option, IsMulti, Group>>
) => ReactElement;

// eslint-disable-next-line react/display-name
const Select = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: Props<Option, IsMulti, Group>,
    ref:
      | ((instance: SelectInstance<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<SelectInstance<Option, IsMulti, Group> | null>
      | null
  ) => {
    const chakraSelectProps = useChakraSelectProps(props);

    return <ReactSelect ref={ref} {...chakraSelectProps} />;
  }
) as SelectComponent;

export default Select;
