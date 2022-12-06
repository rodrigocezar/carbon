import { useNotification } from "@carbon/react";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { IconSidebar, Topbar } from "~/components/Navigation";
import { getSupabase, SupabaseProvider } from "~/lib/supabase";
import { getPermissionsByClient, getUserByClient } from "~/services/auth";
import {
  destroyAuthSession,
  getSessionFlash,
  requireAuthSession,
} from "~/services/session";
import { makePermissionsFromClaims } from "~/services/users";

export async function loader({ request }: LoaderArgs) {
  const { accessToken, expiresAt, expiresIn } = await requireAuthSession(
    request
  );

  // don't create a new client for every request
  const client = getSupabase(accessToken);

  // parallelize the requests
  const [sessionFlash, claims, user] = await Promise.all([
    getSessionFlash(request),
    getPermissionsByClient(client),
    getUserByClient(client),
  ]);

  if (user.error) {
    await destroyAuthSession(request);
  }

  if (claims.error || user.error || claims.data === null) {
    await destroyAuthSession(request);
  }

  const permissions = makePermissionsFromClaims(claims?.data);
  if (permissions === null) {
    await destroyAuthSession(request);
  }

  return json(
    {
      session: {
        accessToken,
        expiresIn,
        expiresAt,
      },

      user: user?.data,
      permissions,
      result: sessionFlash?.result,
    },
    {
      headers: sessionFlash?.headers,
    }
  );
}

export default function AppRoute() {
  const { session, result } = useLoaderData<typeof loader>();
  const notify = useNotification();

  useEffect(() => {
    if (result?.success === true) {
      notify.success(result.message);
    } else if (result?.message) {
      notify.error(result.message);
    }
  }, [result, notify]);

  return (
    <SupabaseProvider session={session}>
      <Grid h="100vh" w="100vw" templateRows="auto 1fr">
        <Topbar />
        <GridItem w="full" h="full">
          <Grid templateColumns="auto 1fr" h="full" w="full">
            <IconSidebar />
            <Box w="full" h="full">
              <Outlet />
            </Box>
          </Grid>
        </GridItem>
      </Grid>
    </SupabaseProvider>
  );
}
