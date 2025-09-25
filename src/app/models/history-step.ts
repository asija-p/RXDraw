import { Layer } from './layer';

type HistoryOp = 'paint' | 'createLayer' | 'deleteLayer' | 'setUndoOpacity' | 'setRedoOpacity';

export interface HistoryStep {
  layerId: string;
  before?: string; // base64
  after?: string; // base64

  op: HistoryOp;

  layer?: Layer;

  prevOpacity?: number;
  nextOpacity?: number;

  prevOrder?: string[];
  nextOrder?: string[];
}
