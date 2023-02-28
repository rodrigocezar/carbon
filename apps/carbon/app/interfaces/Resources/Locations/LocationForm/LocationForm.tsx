import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Input, Number, Submit, Timezone } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { locationValidator } from "~/services/resources";

type LocationFormProps = {
  initialValues: {
    id?: string;
    name: string;
    timezone: string;
    latitude?: number;
    longitude?: number;
  };
};

const LocationForm = ({ initialValues }: LocationFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={locationValidator}
        method="post"
        action={
          isEditing
            ? `/x/resources/locations/${initialValues.id}`
            : "/x/resources/locations/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Location</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={4} alignItems="start">
              <Input name="name" label="Location Name" />
              <Timezone name="timezone" label="Timezone" />
              <Number name="latitude" label="Latitude" min={-90} max={90} />
              <Number name="longitude" label="Longitude" min={-180} max={180} />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack spacing={2}>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button
                size="md"
                colorScheme="gray"
                variant="solid"
                onClick={onClose}
              >
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </ValidatedForm>
    </Drawer>
  );
};

export default LocationForm;