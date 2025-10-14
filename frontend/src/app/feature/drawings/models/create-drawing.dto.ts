export interface CreateDrawingDto {
  name: string;
  width: number;
  height: number;
  folderId?: string | null;
  thumbnailUrl?: string;
  colors?: (string | null)[];
}
