-- AlterTable
ALTER TABLE "employeeTypePermission" 
ADD COLUMN     "create" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "update" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "view" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "feature" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only claims admin can view/modify modues" ON "feature" FOR ALL USING (is_claims_admin());

ALTER TABLE "employeeTypePermission" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only claims admin can view/modify permissions for employee types" ON "employeeTypePermission" FOR ALL USING (is_claims_admin());
