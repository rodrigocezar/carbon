CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT GENERATED ALWAYS AS ("firstName" || ' ' || "lastName") STORED,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE UNIQUE INDEX "user_fullName_key" ON "user"("fullName");

ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view users" ON "user" FOR SELECT USING (true);
CREATE POLICY "Only claims admin can insert users" ON "user" FOR INSERT WITH CHECK (is_claims_admin());
CREATE POLICY "Only claims admin can update users" ON "user" FOR UPDATE WITH CHECK (is_claims_admin());
CREATE POLICY "Only claims admin can delete users" ON "user" FOR DELETE USING (is_claims_admin());
