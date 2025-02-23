import { CompanyStatus, CompanyType } from "@/types/types/company";

interface CompanyItemProps {
  id: string;
  name: string;
  createdAt: Date | string;
  type: CompanyType;
  status: CompanyStatus;
  code: number;
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
