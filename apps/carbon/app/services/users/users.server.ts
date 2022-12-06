import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "~/lib/supabase";
import type {
  EmployeeRow,
  EmployeeTypePermission,
  Feature,
  Permission,
  User,
} from "~/modules/Users/types";
import { deleteAuthAccount, sendInviteByEmail } from "~/services/auth";
import type { Result } from "~/types";

export async function createEmployeeAccount(
  client: SupabaseClient<Database>,
  {
    email,
    firstName,
    lastName,
    employeeType,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    employeeType: string;
  }
): Promise<Result> {
  const employeeTypePermissions = await getPermissionsByEmployeeType(
    client,
    employeeType
  );
  if (employeeTypePermissions.error) {
    return {
      success: false,
      message: employeeTypePermissions.error.message,
    };
  }

  // TODO: we should only send this after we've done the other stuff
  const invitation = await sendInviteByEmail(email);

  if (invitation.error)
    return {
      success: false,
      message: invitation.error.message,
    };

  const userId = invitation.data.user.id;

  const claims = makeClaimsFromEmployeeType(employeeTypePermissions);
  const claimsUpdate = await setUserClaims(userId, claims);
  if (claimsUpdate.error) {
    await deleteAuthAccount(userId);
    return {
      success: false,
      message: claimsUpdate.error.message,
    };
  }

  const insertUser = await createUser(client, {
    id: userId,
    email,
    firstName,
    lastName,
  });

  if (insertUser.error) {
    return {
      success: false,
      message: insertUser.error.message,
    };
  }

  if (!insertUser.data) {
    return {
      success: false,
      message: "No data returned from createUser",
    };
  }

  const createEmployee = await insertEmployee(client, {
    id: insertUser.data[0].id,
    employeeTypeId: employeeType,
  });

  if (createEmployee.error) {
    return {
      success: false,
      message: createEmployee.error.message,
    };
  }

  return {
    success: true,
    message: "Employee account created",
  };
}

async function createUser(client: SupabaseClient<Database>, user: User) {
  const { data, error } = await insertUser(client, user);

  if (error) {
    await deleteAuthAccount(user.id);
  }

  return { data, error };
}

export async function deleteEmployeeType(
  client: SupabaseClient<Database>,
  employeeTypeId: string
) {
  return client.from("EmployeeType").delete().eq("id", employeeTypeId);
}

export async function getClaimsById(
  client: SupabaseClient<Database>,
  uid: string
) {
  return client.rpc("get_claims", { uid });
}

export async function getEmployees(
  client: SupabaseClient<Database>,
  args: {
    name: string | null;
    type: string | null;
  }
) {
  let query = client
    .from("Employee")
    .select(
      "User!inner(id, firstName, lastName, email), EmployeeType!inner(name)"
    );

  if (args.name) {
    query = query.or(
      `lastName.ilike.${args.name}%, firstName.ilike.${args.name}%`,
      {
        foreignTable: "User",
      }
    );
  }

  if (args.type) {
    query = query.eq("employeeTypeId", args.type);
  }

  query = query
    .range(0, 9)
    .order("lastName", { foreignTable: "User", ascending: true });

  return query;
}

export async function getEmployeeType(
  client: SupabaseClient<Database>,
  employeeTypeId: string
) {
  return client
    .from("EmployeeType")
    .select("id, name, color, protected")
    .eq("id", employeeTypeId)
    .single();
}

export async function getEmployeeTypes(client: SupabaseClient<Database>) {
  return client
    .from("EmployeeType")
    .select("id, name, color, protected")
    .order("name");
}

export async function getFeatures(client: SupabaseClient<Database>) {
  return client.from("Feature").select("id, name").order("name");
}

export async function getPermissionsByEmployeeType(
  client: SupabaseClient<Database>,
  employeeTypeId: string
) {
  return client
    .from("EmployeeTypePermission")
    .select("view, create, update, delete, Feature (id, name)")
    .eq("employeeTypeId", employeeTypeId);
}

export async function getUserById(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("User").select("*").eq("id", id).single();
}

export async function getUserByEmail(email: string) {
  return getSupabaseAdmin()
    .from("User")
    .select("*")
    .eq("email", email)
    .single();
}

export async function getUsers(client: SupabaseClient<Database>) {
  return client
    .from("User")
    .select("id, firstName, lastName, email")
    .range(0, 9)
    .order("lastName");
}

export async function insertEmployee(
  client: SupabaseClient<Database>,
  employee: EmployeeRow
) {
  return client.from("Employee").insert([employee]);
}

async function insertUser(client: SupabaseClient<Database>, user: User) {
  return client.from("User").insert([user]).select("*");
}

function makeClaimsFromEmployeeType({
  data,
}: {
  data: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    Feature:
      | { id: string; name: string }
      | { id: string; name: string }[]
      | null;
  }[];
}) {
  const claims: Record<string, boolean> = {};

  data.forEach((permission) => {
    if (permission.Feature === null || Array.isArray(permission.Feature)) {
      throw new Error(
        `TODO: permission.Feature is an array or null for permission ${JSON.stringify(
          permission,
          null,
          2
        )}`
      );
    }

    const module = permission.Feature.name.toLowerCase();

    claims[`${module}_view`] = permission.view;
    claims[`${module}_create`] = permission.create;
    claims[`${module}_update`] = permission.update;
    claims[`${module}_delete`] = permission.delete;
  });

  return claims;
}

function isClaimPermission(key: string, value: unknown) {
  const action = key.split("_")[1];
  return (
    action !== undefined &&
    ["view", "create", "update", "delete"].includes(action) &&
    typeof value === "boolean"
  );
}

export function makeEmptyPermissionsFromFeatures(data: Feature[]) {
  return data.reduce<Record<string, { id: string; permission: Permission }>>(
    (acc, module) => {
      acc[module.name] = {
        id: module.id,
        permission: {
          view: false,
          create: false,
          update: false,
          delete: false,
        },
      };
      return acc;
    },
    {}
  );
}

export function makePermissionsFromClaims(claims: Json[] | null) {
  if (typeof claims !== "object" || claims === null) return null;
  let permissions: Record<string, Permission> = {};

  Object.entries(claims).forEach(([key, value]) => {
    if (isClaimPermission(key, value)) {
      const [module, action] = key.split("_");
      if (!(module in permissions)) {
        permissions[module] = {
          view: false,
          create: false,
          update: false,
          delete: false,
        };
      }

      switch (action) {
        case "view":
          permissions[module].view = value as boolean;
        case "create":
          permissions[module].create = value as boolean;
        case "update":
          permissions[module].update = value as boolean;
        case "delete":
          permissions[module].delete = value as boolean;
      }
    }
  });

  return permissions;
}

export function makePermissionsFromEmployeeType(
  data: EmployeeTypePermission[]
) {
  const result: Record<string, { id: string; permission: Permission }> = {};
  if (!data) return result;
  data.forEach((permission) => {
    if (Array.isArray(permission.Feature) || !permission.Feature) {
      // hmm... TODO: handle this
      throw new Error(
        `TODO: permission.Feature is an array or null for permission ${JSON.stringify(
          permission,
          null,
          2
        )}`
      );
    } else {
      result[permission.Feature.name] = {
        id: permission?.Feature?.id!,
        permission: {
          view: permission.view,
          create: permission.create,
          update: permission.update,
          delete: permission.delete,
        },
      };
    }
  });

  return result;
}

async function setUserClaims(userId: string, claims: Record<string, boolean>) {
  return getSupabaseAdmin().auth.admin.updateUserById(userId, {
    app_metadata: claims,
  });
}

export async function updatePermissions(
  client: SupabaseClient<Database>,
  { id, permissions }: { id: string; permissions: Record<string, Permission> }
): Promise<Result> {
  if (await client.rpc("is_claims_admin")) {
    const getClaims = await getClaimsById(client, id);

    if (getClaims.error) {
      return {
        success: false,
        message: "Failed parse claims",
      };
    }
    const currentClaims =
      typeof getClaims.data !== "object" ||
      Array.isArray(getClaims.data) ||
      getClaims.data === null
        ? {}
        : getClaims.data;

    const newClaims: Record<string, boolean> = {};
    Object.entries(permissions).forEach(([name, permission]) => {
      newClaims[`${name}_view`] = permission.view;
      newClaims[`${name}_create`] = permission.create;
      newClaims[`${name}_update`] = permission.update;
      newClaims[`${name}_delete`] = permission.delete;
    });

    const claimsUpdate = await setUserClaims(id, {
      ...currentClaims,
      ...newClaims,
    });
    if (claimsUpdate.error) {
      return {
        success: false,
        message: "Failed to update permissions",
      };
    }

    return {
      success: true,
      message: "Permissions updated",
    };
  } else {
    return {
      success: false,
      message: "Unauthorized",
    };
  }
}

export async function upsertEmployeeType(
  client: SupabaseClient<Database>,
  employeeType: { id?: string; name: string; color: string | null }
) {
  return client.from("EmployeeType").upsert([employeeType]).select("id");
}

export async function upsertEmployeeTypePermissions(
  client: SupabaseClient<Database>,
  employeeTypeId: string,
  permissions: { id: string; permission: Permission }[]
) {
  const employeeTypePermissions = permissions.map(({ id, permission }) => ({
    employeeTypeId,
    moduleId: id,
    view: permission.view,
    create: permission.create,
    update: permission.update,
    delete: permission.delete,
  }));

  return client.from("EmployeeTypePermission").upsert(employeeTypePermissions);
}
