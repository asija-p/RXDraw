export interface CreateDrawingDto {
  name: string;
  width: number;
  height: number;
  userId: string;
  folderId?: string | null;
  thumbnailUrl?: string;
  colors?: (string | null)[];
}
