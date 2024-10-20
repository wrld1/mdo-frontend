interface CompanyItemProps {
  id: string | number;
  name: string;
  createdAt: Date | string;
  type: string;
}

function CompanyItem({ id, name, createdAt, type }: CompanyItemProps) {
  return (
    <li key={id}>
      <strong>Name:</strong> {name} <br />
      <strong>Type:</strong> {type} <br />
      <strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}{" "}
      <br />
    </li>
  );
}

export default CompanyItem;
