import type {
  getAbilities,
  getAbility,
  getAttribute,
  getAttributeCategories,
  getAttributeCategory,
  getContractors,
  getDepartments,
  getEmployeeAbilities,
  getEmployeeJob,
  getEquipment,
  getEquipmentType,
  getEquipmentTypes,
  getHolidays,
  getLocations,
  getPartners,
  getPeople,
  getShifts,
  getWorkCellType,
  getWorkCellTypes,
} from "./services";

export type Ability = NonNullable<
  Awaited<ReturnType<typeof getAbility>>["data"]
>;

export type Abilities = NonNullable<
  Awaited<ReturnType<typeof getAbilities>>["data"]
>;

export type AbilityDatum = {
  week: number;
  value: number;
};

export type AbilityEmployees = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getAbility>>["data"]>["employeeAbility"]
>;

export enum AbilityEmployeeStatus {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Complete = "Complete",
}

export function getTrainingStatus(
  employeeAbility: {
    lastTrainingDate: string | null;
    trainingDays: number;
    trainingCompleted: boolean | null;
  } | null
) {
  if (!employeeAbility) return undefined;
  if (employeeAbility.trainingCompleted) return AbilityEmployeeStatus.Complete;
  if (employeeAbility.trainingDays > 0) return AbilityEmployeeStatus.InProgress;
  return AbilityEmployeeStatus.NotStarted;
}

export type Attribute = NonNullable<
  Awaited<ReturnType<typeof getAttribute>>["data"]
>;

export type AttributeCategory = NonNullable<
  Awaited<ReturnType<typeof getAttributeCategories>>["data"]
>[number];

export type AttributeCategoryDetailType = NonNullable<
  Awaited<ReturnType<typeof getAttributeCategory>>["data"]
>;

export type AttributeDataType = {
  id: number;
  label: string;
  isBoolean: boolean;
  isDate: boolean;
  isList: boolean;
  isNumeric: boolean;
  isText: boolean;
};

export type Contractor = NonNullable<
  Awaited<ReturnType<typeof getContractors>>["data"]
>[number];

export type Department = NonNullable<
  Awaited<ReturnType<typeof getDepartments>>["data"]
>[number];

export type EmployeeAbility = NonNullable<
  Awaited<ReturnType<typeof getEmployeeAbilities>>["data"]
>[number];

export type EmployeeJob = NonNullable<
  Awaited<ReturnType<typeof getEmployeeJob>>["data"]
>;

export type Equipment = NonNullable<
  Awaited<ReturnType<typeof getEquipment>>["data"]
>;

export type EquipmentType = NonNullable<
  Awaited<ReturnType<typeof getEquipmentTypes>>["data"]
>[number];

export type EquipmentTypeDetailType = NonNullable<
  Awaited<ReturnType<typeof getEquipmentType>>["data"]
>;

export type Holiday = NonNullable<
  Awaited<ReturnType<typeof getHolidays>>["data"]
>[number];

export type Location = NonNullable<
  Awaited<ReturnType<typeof getLocations>>["data"]
>[number];

export type Partner = NonNullable<
  Awaited<ReturnType<typeof getPartners>>["data"]
>[number];

export type Person = NonNullable<
  Awaited<ReturnType<typeof getPeople>>["data"]
>[number];

export type Shift = NonNullable<
  Awaited<ReturnType<typeof getShifts>>["data"]
>[number];

export type ShiftLocation = NonNullable<
  Awaited<ReturnType<typeof getLocations>>["data"]
>[number];

export type WorkCellType = NonNullable<
  Awaited<ReturnType<typeof getWorkCellTypes>>["data"]
>[number];

export type WorkCellTypeDetailType = NonNullable<
  Awaited<ReturnType<typeof getWorkCellType>>["data"]
>;
