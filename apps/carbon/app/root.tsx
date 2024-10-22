// root.tsx
import { ThemeProvider } from "@carbon/react";
import { Heading, VStack } from "@chakra-ui/react";
import { SkipNavLink } from "@chakra-ui/skip-nav";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import { getBrowserEnv } from "~/config/env";
import Background from "~/styles/background.css";
import NProgress from "~/styles/nprogress.css";

export function links() {
  return [
    { rel: "stylesheet", href: Background },
    { rel: "stylesheet", href: NProgress },
  ];
}

export const meta: MetaFunction = () => {
  return [
    {
      charset: "utf-8",
    },
    {
      title: "Carbon ERP",
    },
    {
      viewport: "width=device-width",
    },
  ];
};

export async function loader() {
  const { SUPABASE_API_URL, SUPABASE_ANON_PUBLIC } = getBrowserEnv();
  return json({
    env: {
      SUPABASE_API_URL,
      SUPABASE_ANON_PUBLIC,
    },
  });
}

function Document({
  children,
  title = "Carbon ERP",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  const env = loaderData?.env ?? {};

  return (
    <Document>
      <ThemeProvider>
        <SkipNavLink zIndex={7}>Skip to content</SkipNavLink>
        <Outlet />
      </ThemeProvider>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.env = ${JSON.stringify(env)}`,
        }}
      />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.data.message ?? error.data
    : error instanceof Error
    ? error.message
    : String(error);

  return (
    <Document title="Error!">
      <ThemeProvider>
        <VStack
          w="full"
          h="100vh"
          alignItems="center"
          justifyContent="center"
          gap={4}
          bg="black"
          color="white"
        >
          <Heading as="h1">Something went wrong</Heading>
          <p>{message}</p>
        </VStack>
      </ThemeProvider>
    </Document>
  );
}
