-- CreateTable
CREATE TABLE "feature" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employeeTypePermission" (
    "employeeTypeId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "employeeTypePermission_pkey" PRIMARY KEY ("employeeTypeId", "featureId")
);

-- AddForeignKey
ALTER TABLE "employeeTypePermission" ADD CONSTRAINT "employeeTypePermission_employeeTypeId_fkey" FOREIGN KEY ("employeeTypeId") REFERENCES "employeeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeTypePermission" ADD CONSTRAINT "employeeTypePermission_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
