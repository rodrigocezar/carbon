import { possibleFeatures } from "./features";

const admin = {
  email: "admin@carbon.app",
  password: "carbon",
  firstName: "Carbon",
  lastName: "Admin",
};

const claims: Record<string, boolean> = {
  claims_admin: true,
};

possibleFeatures.forEach((name) => {
  const moduleName = name.toLowerCase();
  claims[`${moduleName}_view`] = true;
  claims[`${moduleName}_create`] = true;
  claims[`${moduleName}_update`] = true;
  claims[`${moduleName}_delete`] = true;
});

export { admin, claims };
