export class CreateLayerDto {
  drawingId: string;
  name: string;
  zIndex: number;
  visible?: boolean;
  opacity?: number;
  bitmapUrl?: string;
}

export class UpdateLayerDto {
  name?: string;
  visible?: boolean;
  opacity?: number;
  zIndex?: number;
  bitmapUrl?: string | null;
}
