import {
  Box,
  Image,
  Text,
  VStack,
  useColorModeValue,
  Button,
  HStack,
} from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";
import { Password, Submit } from "~/components/Form";
import { getSupabaseAdmin } from "~/lib/supabase";
import { resetPasswordValidator } from "~/services/auth/auth.form";
import {
  getAuthSession,
  requireAuthSession,
  setSessionFlash,
} from "~/services/session";
import { assertIsPost } from "~/utils/http";

export async function loader({ request }: LoaderArgs) {
  await requireAuthSession(request);
  return null;
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const validation = await resetPasswordValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { password } = validation.data;

  const authSession = await getAuthSession(request);

  if (!authSession) {
    return redirect("/");
  }

  const { userId } = authSession;
  const { error } = await getSupabaseAdmin().auth.admin.updateUserById(userId, {
    password,
  });

  if (error) {
    return json(
      {},
      await setSessionFlash(request, {
        success: false,
        message: "Failed to reset password",
      })
    );
  }

  return redirect(
    "/app",
    await setSessionFlash(request, {
      success: true,
      message: "Password updated",
    })
  );
}

export default function ResetPasswordRoute() {
  const boxBackground = useColorModeValue("white", "gray.700");
  const navigate = useNavigate();

  return (
    <Box
      minW="100vw"
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <VStack spacing={8} mx="auto" maxW="lg" pt={24} px={6}>
        <Image
          src={useColorModeValue("/logo-dark.png", "/logo-light.png")}
          alt="Carbon Logo"
          maxW={100}
          marginBottom={3}
        />

        <Box rounded="lg" bg={boxBackground} boxShadow="lg" w={380} p={8}>
          <ValidatedForm
            method="post"
            action="/reset-password"
            validator={resetPasswordValidator}
          >
            <VStack spacing={4} alignItems="start">
              <Text>Please select a new password.</Text>

              <Password name="password" label="New Password" />
              <HStack spacing={4}>
                <Submit w="full">Reset Password</Submit>
                <Button size="md" onClick={() => navigate("/app")}>
                  Skip
                </Button>
              </HStack>
            </VStack>
          </ValidatedForm>
        </Box>
      </VStack>
    </Box>
  );
}
