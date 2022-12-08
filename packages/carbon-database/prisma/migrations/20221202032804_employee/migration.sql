-- CreateTable
CREATE TABLE "employee" (
    "id" TEXT NOT NULL,
    "employeeTypeId" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_employeeTypeId_fkey" FOREIGN KEY ("employeeTypeId") REFERENCES "employeeType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
