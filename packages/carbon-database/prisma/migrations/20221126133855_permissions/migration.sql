-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeTypePermission" (
    "employeeTypeId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EmployeeTypePermission_pkey" PRIMARY KEY ("employeeTypeId", "moduleId")
);

-- AddForeignKey
ALTER TABLE "EmployeeTypePermission" ADD CONSTRAINT "EmployeeTypePermission_employeeTypeId_fkey" FOREIGN KEY ("employeeTypeId") REFERENCES "EmployeeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeTypePermission" ADD CONSTRAINT "EmployeeTypePermission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
