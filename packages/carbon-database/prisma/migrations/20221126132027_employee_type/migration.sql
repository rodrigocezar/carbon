CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "EmployeeType" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "color" TEXT DEFAULT '#000000',
    "protected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EmployeeType_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "EmployeeType"
ADD CONSTRAINT employee_type_color_check
CHECK ("color" is null or "color" ~* '^#[a-f0-9]{6}$');

ALTER TABLE "EmployeeType" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only claims admin can view/modify permissions for employee types" ON "EmployeeType" FOR ALL USING (is_claims_admin());

