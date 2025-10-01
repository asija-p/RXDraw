export class CreateLayerDto {
  drawingId: string;
  name: string;
  zIndex: number;
  visible?: boolean;
  opacity?: number;
  canvasData?: string;
}

export class UpdateLayerDto {
  name?: string;
  visible?: boolean;
  opacity?: number;
  zIndex?: number;
  canvasData?: string | null;
}
