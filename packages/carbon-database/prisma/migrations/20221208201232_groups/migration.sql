CREATE TABLE "group" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "isIdentityGroup" BOOLEAN NOT NULL DEFAULT false,
  "isEmployeeTypeGroup" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMP(3),
  
  CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "membership" (
  "id" SERIAL NOT NULL,
  "groupId" TEXT NOT NULL,
  "memberGroupId" TEXT,
  "memberUserId" TEXT,

  CONSTRAINT "membership_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "membership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "membership_memberGroupId_fkey" FOREIGN KEY ("memberGroupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "membership_memberUserId_fkey" FOREIGN KEY ("memberUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  
  CONSTRAINT uq_membership
    UNIQUE ( "groupId", "memberGroupId", "memberUserId" ),
  
  CONSTRAINT membership_hasPersonOrGroup
    CHECK (
      ("memberGroupId" IS NULL AND "memberUserId" IS NOT NULL) 
      OR 
      ("memberGroupId" IS NOT NULL AND "memberUserId" IS NULL)
    )
);

CREATE FUNCTION public.create_employee_type_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."group" ("id", "name", "isEmployeeTypeGroup")
  VALUES (new.id, new.name, TRUE);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.update_employee_type_group()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public."group" SET "name" = new.name
  WHERE "id" = new.id AND "isEmployeeTypeGroup" = TRUE;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.create_user_identity_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."group" ("id", "name", "isIdentityGroup")
  VALUES (new.id, new."fullName", TRUE);

  INSERT INTO public."membership"("groupId", "memberUserId")
  VALUES (new.id, new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.update_user_identity_group()
RETURNS TRIGGER AS $$
BEGIN
  update public."group" set "name" = new."fullName"
  where "id" = new.id and "isIdentityGroup" = TRUE;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE FUNCTION public.add_employee_to_employee_type_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."membership" ("groupId", "memberUserId")
  VALUES (new."employeeTypeId", new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.update_employee_to_employee_type_group()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public."membership" SET "groupId" = new."employeeTypeId"
  WHERE "groupId" = old."employeeTypeId" AND "memberUserId" = new.id;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE TRIGGER on_employee_type_created
  AFTER INSERT on public."employeeType"
  FOR EACH ROW EXECUTE PROCEDURE public.create_employee_type_group();

CREATE TRIGGER on_user_created
  AFTER INSERT on public.user
  FOR EACH ROW EXECUTE PROCEDURE public.create_user_identity_group();    

CREATE TRIGGER on_employee_created
  AFTER INSERT on public.employee
  FOR EACH ROW EXECUTE PROCEDURE public.add_employee_to_employee_type_group();

CREATE TRIGGER on_user_updated
  AFTER UPDATE on public.user
  FOR EACH ROW EXECUTE PROCEDURE public.update_user_identity_group();

CREATE TRIGGER on_employee_updated
  AFTER UPDATE on public.employee
  FOR EACH ROW EXECUTE PROCEDURE public.update_employee_to_employee_type_group();

CREATE TRIGGER on_employee_type_updated
  AFTER UPDATE on public."employeeType"
  FOR EACH ROW EXECUTE PROCEDURE public.update_employee_type_group();


CREATE VIEW "groupWithMember" AS 
SELECT
  g.name,
  g."isIdentityGroup",
  g."isEmployeeTypeGroup",
  gm."groupId",
  gm."memberGroupId",
  gm."memberUserId",
  to_jsonb(u) as member
FROM 
  "membership" gm 
  INNER JOIN "group" g ON g.id = gm."groupId"
  LEFT OUTER JOIN "user" u ON u.id = gm."memberUserId";

CREATE VIEW "groupsWithMembers" AS
SELECT 
  root_g."groupId", 
  root_g."name",
  root_g."memberGroupId",
  COALESCE(json_agg(members.member) FILTER (WHERE members.member IS NOT NULL), '[]') as users,
  count(members.member)
FROM 
  "groupWithMember" root_g
LEFT JOIN "groupWithMember" members
  ON members."groupId" = root_g."memberUserId"
WHERE root_g."isIdentityGroup" = false
GROUP BY 
  root_g."groupId",
  root_g."name",
  root_g."memberGroupId";

CREATE OR REPLACE FUNCTION groups_for_user(uid text) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER SET search_path = public
    AS $$
    DECLARE retval jsonb;
    BEGIN    
      WITH RECURSIVE "groupsForUser" AS (
      SELECT "groupId", "memberGroupId", "memberUserId" FROM "membership"
      WHERE "memberUserId" = uid::text
      UNION
        SELECT g1."groupId", g1."memberGroupId", g1."memberUserId" FROM "membership" g1
        INNER JOIN "groupsForUser" g2 ON g2."groupId" = g1."memberGroupId"
      ) SELECT coalesce(json_agg("groupId"), '[]') INTO retval AS groups FROM "groupsForUser";
      RETURN retval;
    END;
$$;

CREATE OR REPLACE FUNCTION users_for_groups(groups text[]) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER SET search_path = public
    AS $$
    DECLARE retval jsonb;
    BEGIN    
      WITH RECURSIVE "usersForGroups" AS (
      SELECT "groupId", "memberGroupId", "memberUserId" FROM "membership"
      WHERE "groupId" = ANY(groups)
      UNION
        SELECT g1."groupId", g1."memberGroupId", g1."memberUserId" FROM "membership" g1
        INNER JOIN "usersForGroups" g2 ON g2."memberGroupId" = g1."groupId"
      ) SELECT coalesce(json_agg("memberUserId"), '[]') AS groups INTO retval FROM "usersForGroups" WHERE "memberUserId" IS NOT NULL;
      RETURN retval;
    END;
$$;

NOTIFY pgrst, 'reload schema';
