import { Polygon, GeoJsonObject } from 'geojson';

export enum ZoneType {
  DISTRIBUTION = 'distribution',
  DELIVERY = 'delivery',
}

export interface Organisation {
  id: string;
  orgNumber: string;
  name: string;
  email: string;
  contactPerson: string;
  mobileNumber: string;
  pinCode: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Feature {
  type: 'Feature';
  geometry: Polygon;
  properties: {
    id: string;
    name: string;
    address: string;
    area: string;
    type: ZoneType;
    Organisation: Organisation;
    enteredAtTime: string;
  };
}

export type Zones = GeoJsonObject & {
  type: 'FeatureCollection';
  features: [Feature];
};

export const a = 1;
