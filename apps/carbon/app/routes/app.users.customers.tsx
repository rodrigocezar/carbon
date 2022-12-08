import Todo from "~/components/Todo";

export default function UsersCustomersRoute() {
  return (
    <Todo
      items={[
        "Add partners so that we can associate a customers with an organization",
        "Add customer account CRUD",
        "Add RLS such that customers can access things related to their orders",
      ]}
    />
  );
}
