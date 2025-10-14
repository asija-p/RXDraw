export class CreateLayerDto {
  drawingId: string;
  name: string;
  zIndex: number;
  visible?: boolean;
  opacity?: number;
  canvasData?: string;
}

export class UpdateLayerDto {
  id?: string;
  name!: string;
  zIndex!: number;
  visible?: boolean;
  opacity?: number;
  canvasData?: string | null;
}
