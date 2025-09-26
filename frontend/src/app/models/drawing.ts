import { Layer } from './layer';

export interface Drawing {
  id: string;
  name: string;
  width: number;
  height: number;
  layers: Layer[];
  thumbnail: string;
  updatedAt: string;
}
