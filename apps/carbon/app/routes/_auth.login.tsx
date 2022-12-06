import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Image,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { Link, useActionData, useSearchParams } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";

import { Input, Password, Submit } from "~/components/Form";
import { createAuthSession, getAuthSession } from "~/services/session";
import { signInWithEmail, loginValidator } from "~/services/auth";
import type { FormActionData, Result } from "~/types";
import { assertIsPost } from "~/utils/http";

export const meta: MetaFunction = () => ({
  title: "Carbon | Login",
});

export async function loader({ request }: LoaderArgs) {
  const authSession = await getAuthSession(request);
  if (authSession) return redirect("/app");
  return null;
}

export async function action({ request }: ActionArgs): FormActionData {
  assertIsPost(request);
  const validation = await loginValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { email, password, redirectTo } = validation.data;

  const authSession = await signInWithEmail(email, password);

  if (!authSession) {
    return json(
      { success: false, message: "Invalid email/password" },
      { status: 400 }
    );
  }

  return createAuthSession({
    request,
    authSession,
    redirectTo: redirectTo || "/app",
  });
}

export default function LoginRoute() {
  const result = useActionData<Result>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

  return (
    <Flex
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

        <Box
          rounded="lg"
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          w={380}
          p={8}
        >
          <ValidatedForm
            validator={loginValidator}
            defaultValues={{ redirectTo }}
            method="post"
          >
            <VStack spacing={4} alignItems="start">
              {result && result?.message && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>{result?.message}</AlertTitle>
                </Alert>
              )}
              <Input name="email" label="Email" />
              <Password name="password" label="Password" type="password" />
              <Input name="redirectTo" value={redirectTo} type="hidden" />
              <Submit w="full">Sign in</Submit>
              <Link
                to="/forgot-password"
                color={useColorModeValue("black", "white")}
              >
                Forgot password?
              </Link>
            </VStack>
          </ValidatedForm>
        </Box>
      </VStack>
    </Flex>
  );
}
