CREATE TABLE "employee" (
    "id" TEXT NOT NULL,
    "employeeTypeId" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "employee_employeeTypeId_fkey" FOREIGN KEY ("employeeTypeId") REFERENCES "employeeType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "employee_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

ALTER TABLE "employee" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view employees" ON "employee" FOR SELECT USING (true);
CREATE POLICY "Only claims admin can insert employees" ON "employee" FOR INSERT WITH CHECK (is_claims_admin());
CREATE POLICY "Only claims admin can update employees" ON "employee" FOR UPDATE WITH CHECK (is_claims_admin());
CREATE POLICY "Only claims admin can delete employees" ON "employee" FOR DELETE USING (is_claims_admin());

