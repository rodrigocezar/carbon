import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  DatePicker,
  Hidden,
  Input,
  Select,
  SelectControlled,
  Submit,
  Supplier,
  SupplierContact,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import {
  purchaseOrderStatusType,
  purchaseOrderTypeType,
  purchaseOrderValidator,
} from "~/modules/purchasing";
import type { TypeOfValidator } from "~/types/validators";

type PurchaseOrderFormValues = TypeOfValidator<typeof purchaseOrderValidator>;

type PurchaseOrderFormProps = {
  initialValues: PurchaseOrderFormValues;
};

const PurchaseOrderForm = ({ initialValues }: PurchaseOrderFormProps) => {
  const permissions = usePermissions();
  const [supplier, setSupplier] = useState<string | undefined>(
    initialValues.supplierId
  );
  const isEditing = initialValues.id !== undefined;
  const isSupplier = permissions.is("supplier");

  const statusOptions = purchaseOrderStatusType.map((status) => ({
    label: status,
    value: status,
  }));

  const typeOptions = purchaseOrderTypeType.map((type) => ({
    label: type,
    value: type,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={purchaseOrderValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">
            {isEditing ? "Purchase Order" : "New Purchase Order"}
          </Heading>
          {!isEditing && (
            <Text color="gray.500">
              A purchase order contains information about the agreement between
              the company and a specific supplier for parts and services.
            </Text>
          )}
        </CardHeader>
        <CardBody>
          <Hidden name="purchaseOrderId" />
          <VStack spacing={2} w="full" alignItems="start">
            <Grid
              gridTemplateColumns={
                isEditing ? ["1fr", "1fr", "1fr 1fr 1fr"] : "1fr"
              }
              gridColumnGap={8}
              gridRowGap={2}
              w="full"
            >
              <VStack alignItems="start" spacing={2} w="full">
                <Supplier
                  name="supplierId"
                  label="Supplier"
                  onChange={(newValue) =>
                    setSupplier(newValue?.value as string | undefined)
                  }
                />
                {isEditing && (
                  <SupplierContact
                    name="supplierContactId"
                    label="Supplier Contact"
                    supplier={supplier}
                  />
                )}
                <Input
                  name="supplierReference"
                  label="Supplier Invoice Number"
                />
              </VStack>
              <VStack alignItems="start" spacing={2} w="full">
                <DatePicker
                  name="orderDate"
                  label="Order Date"
                  isDisabled={isSupplier}
                />
                <Select
                  name="type"
                  label="Type"
                  options={typeOptions}
                  isReadOnly={isSupplier}
                />
                {isEditing && permissions.can("delete", "purchasing") && (
                  <SelectControlled
                    name="status"
                    label="Status"
                    value={initialValues.status}
                    options={statusOptions}
                    isReadOnly={isSupplier}
                  />
                )}
              </VStack>
              <VStack alignItems="start" spacing={2} w="full">
                {isEditing && (
                  <>
                    <TextArea
                      name="notes"
                      label="Notes"
                      isReadOnly={isSupplier}
                    />
                  </>
                )}
              </VStack>
            </Grid>
          </VStack>
        </CardBody>
        <CardFooter>
          <Submit
            isDisabled={
              isEditing
                ? !permissions.can("update", "purchasing")
                : !permissions.can("create", "purchasing")
            }
          >
            Save
          </Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PurchaseOrderForm;
