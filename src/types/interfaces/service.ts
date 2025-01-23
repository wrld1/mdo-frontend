import { Object } from "./object";

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  logo: string;
  objectId?: string;
  dwellingId?: number;
  object: Object;
}
