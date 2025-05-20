import { Dwelling } from "./dwelling";

export type ObjectType = "ApartmentBuilding" | "OfficeBuilding" | "Warehouse";

export interface ObjectResponse {
  id: string;
  address: string;
  type: ObjectType;
  companyId: string;
  dwellings?: Dwelling[];
}
