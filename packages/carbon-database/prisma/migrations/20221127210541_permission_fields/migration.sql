-- AlterTable
ALTER TABLE "EmployeeTypePermission" ADD COLUMN     "create" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "update" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "view" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Feature" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only claims admin can view/modify modues" ON "Feature" FOR ALL USING (is_claims_admin());

ALTER TABLE "EmployeeTypePermission" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only claims admin can view/modify permissions for employee types" ON "EmployeeTypePermission" FOR ALL USING (is_claims_admin());
