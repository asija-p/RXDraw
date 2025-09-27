export class CreateDrawingDto {
  name: string;
  width: number;
  height: number;
  userId: string;
  folderId?: string;
  thumbnailUrl?: string;
  colors?: (string | null)[];
}

export class UpdateDrawingDto {
  name?: string;
  width?: number;
  height?: number;
  folderId?: string | null;
  thumbnailUrl?: string | null;
  colors?: (string | null)[];
}
