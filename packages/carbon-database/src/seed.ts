import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import type { Database } from "./types";
import type { Feature, EmployeeType } from "./seed/index";
import {
  admin,
  claims,
  features,
  employeeTypePermissionsDefinitions,
  employeeTypes,
} from "./seed/index";

dotenv.config();

const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_API_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const getUserId = async (): Promise<string> => {
  const existingUserId = await supabaseAdmin.auth.admin
    .listUsers()
    .then(
      ({ data }) => data.users.find((user) => user.email === admin.email)?.id
    );

  if (existingUserId) return existingUserId;

  const newUserId = await supabaseAdmin.auth.admin
    .createUser({
      email: admin.email,
      password: admin.password,
      email_confirm: true,
    })
    .then(({ data }) => data.user?.id);

  if (newUserId) return newUserId;

  throw new Error("Could not create or get user");
};

async function seed() {
  const id = await getUserId();

  const upsertAdmin = await supabaseAdmin.from("User").upsert([
    {
      id,
      email: admin.email,
      emailVerified: new Date().toISOString(),
      firstName: admin.firstName,
      lastName: admin.lastName,
    },
  ]);
  if (upsertAdmin.error) throw upsertAdmin.error;

  // give the admin user all the claims
  await supabaseAdmin.auth.admin.updateUserById(id, {
    app_metadata: claims,
  });

  const deleteFeatures = await supabaseAdmin
    .from("Feature")
    .delete()
    .neq("id", 0);
  if (deleteFeatures.error) throw deleteFeatures.error;

  const insertFeatures = await supabaseAdmin
    .from("Feature")
    .insert([...Object.values(features)]);
  if (insertFeatures.error) throw insertFeatures.error;

  const deleteEmployeeTypes = await supabaseAdmin
    .from("EmployeeType")
    .delete()
    .neq("id", 0);
  if (deleteEmployeeTypes.error) throw deleteEmployeeTypes.error;

  const insertEmployeeTypes = await supabaseAdmin
    .from("EmployeeType")
    .insert([...Object.values(employeeTypes)]);
  if (insertEmployeeTypes.error) throw insertEmployeeTypes.error;

  const employeeTypePermissions = [] as {
    employeeTypeId: string;
    moduleId: string;
    create: boolean;
    update: boolean;
    delete: boolean;
    view: boolean;
  }[];

  Object.entries(employeeTypePermissionsDefinitions).forEach(
    ([empType, modulePermissions]) => {
      const employeeTypeId = employeeTypes[empType as EmployeeType].id;
      Object.keys(modulePermissions).forEach((module) => {
        const moduleId = features[module as Feature].id;
        employeeTypePermissions.push({
          employeeTypeId,
          moduleId,
          ...modulePermissions[module as Feature],
        });
      });
    }
  );

  const insertEmployeeTypePermissions = await supabaseAdmin
    .from("EmployeeTypePermission")
    .insert(employeeTypePermissions);

  if (insertEmployeeTypePermissions.error)
    throw insertEmployeeTypePermissions.error;

  const insertEmployee = await supabaseAdmin
    .from("Employee")
    .upsert([{ id, employeeTypeId: employeeTypes.Admin.id }]);

  if (insertEmployee.error) throw insertEmployee.error;

  console.log(`Database has been seeded. 🌱\n`);
  console.log(
    `Admin user is 👇 \n🆔: ${id}\n📧: ${admin.email}\n🔑: ${admin.password}`
  );
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
