// save.dto.ts
export interface SaveLayerDto {
  id?: string;
  name: string;
  zIndex: number;
  visible?: boolean;
  opacity?: number;
  canvasData?: string | null;
}

export interface SaveDto {
  name?: string;
  width?: number;
  height?: number;
  folderId?: string | null;
  thumbnailUrl?: string | null;
  colors?: (string | null)[];
  layers?: SaveLayerDto[];
}
