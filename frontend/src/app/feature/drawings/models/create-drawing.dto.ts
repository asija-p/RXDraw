export interface CreateDrawingDto {
  name: string;
  width: number;
  height: number;
  userId: string;
  folderId?: string;
  thumbnailUrl?: string;
  colors?: (string | null)[];
}
