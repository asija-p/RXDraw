export interface CreateLayerDto {
  name: string;
  zIndex: number;
  visible?: boolean;
  opacity?: number;
  canvasData?: string;
  drawingId: string;
}
