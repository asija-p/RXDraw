import { Layer } from '../../feature/studio/models/layer';

export interface Drawing {
  id: string;
  name: string;
  width: number;
  height: number;
  layers?: Layer[];
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt: string;
}
