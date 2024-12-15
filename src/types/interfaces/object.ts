export type ObjectType = "ApartmentBuilding" | "OfficeBuilding" | "Warehouse";

export interface Object {
  id: string;
  address: string;
  type: ObjectType;
  companyId: string;
}
