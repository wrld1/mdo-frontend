import { Object } from "./object";

export interface Service {
  id: number;
  name: string;
  description: string;
  //   price: { s: 1; e: 1; d: [Array] };
  logo: string;
  objectId?: string;
  dwellingId?: number;
  object: Object;
}
