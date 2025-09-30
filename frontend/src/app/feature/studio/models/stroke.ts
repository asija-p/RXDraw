export interface Stroke {
  color: string;
  size: number;
  tool: 'bucket' | 'eraser' | 'brush' | 'quill' | 'marker';
}
