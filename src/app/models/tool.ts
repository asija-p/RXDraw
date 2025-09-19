export interface Tool {
  id: ToolId;
  icon: any;
}

export type ToolId = 'brush' | 'eraser' | 'bucket' | 'quill' | 'marker';
