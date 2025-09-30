export interface CreateLayerDto {
  name: string;
  zIndex: number;
  visible?: boolean;
  opacity?: number;
  bitmapUrl?: string;
  drawingId: string;
}
