import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { requirePermissions } from "~/services/auth";
import { deleteEmployeeType, getEmployeeType } from "~/services/users";
import { setSessionFlash } from "~/services/session";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
  });
  const { employeeTypeId } = params;

  return json(await getEmployeeType(client, employeeTypeId!));
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "users",
  });

  const { employeeTypeId } = params;
  if (!employeeTypeId) {
    return redirect(
      "/app/users/employee-types",
      await setSessionFlash(request, {
        success: false,
        message: "Employee type ID is required",
      })
    );
  }

  const deleteType = await deleteEmployeeType(client, employeeTypeId);
  if (deleteType.error) {
    return redirect(
      "/app/users/employee-types",
      await setSessionFlash(request, {
        success: false,
        message: deleteType.error.message,
      })
    );
  }

  // TODO - delete employeeType group

  return redirect(
    "/app/users/employee-types",
    await setSessionFlash(request, {
      success: true,
      message: "Successfully deleted employee type",
    })
  );
}

export default function DeleteEmployeeTypeRoute() {
  const { employeeTypeId } = useParams();
  const { data } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const onCancel = () => navigate("/app/users/employee-types");

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{data?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the {data?.name} employee type? This
          cannot be undone.
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onCancel}>
            Cancel
          </Button>
          <Form method="post">
            <input type="hidden" name="id" value={employeeTypeId} />
            <Button colorScheme="red" type="submit">
              Delete
            </Button>
          </Form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
