import type { Permission } from "~/modules/Users/types";
import { useRouteData } from "./useRouteData";

export function usePermissions() {
  const data = useRouteData<{ permissions: unknown }>("/app");
  if (data?.permissions && isPermissions(data.permissions)) {
    return data.permissions;
  }
  // TODO: force logout -- the likely cause is development changes
  throw new Error(
    "usePermissions must be used within an authenticated route. If you are seeing this error, you are likely in development and have changed the session variables. Try deleting the cookies."
  );
}

function isPermissions(value: any): value is Record<string, Permission> {
  if (
    typeof value === "object" &&
    Array.isArray(value) === false &&
    value !== null
  ) {
    return Object.values(value as object).every(
      (permission) =>
        "view" in permission &&
        "create" in permission &&
        "update" in permission &&
        "delete" in permission
    );
  } else {
    return false;
  }
}
