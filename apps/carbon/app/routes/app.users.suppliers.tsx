import Todo from "~/components/Todo";

export default function UsersSuppliersRoute() {
  return (
    <Todo
      items={[
        "Add partners so that we can associate a supplier with an organization",
        "Add supplier account CRUD",
        "Add RLS such that suppliers can access things related to their orders",
      ]}
    />
  );
}
