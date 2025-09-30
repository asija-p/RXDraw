export type LayerForThumb = {
  canvasData: string;
  visible: boolean;
  opacity?: number;
  zIndex?: number;
};

export async function composeThumbSimple(
  layers: LayerForThumb[],
  w: number,
  h: number,
  targetW = 256
): Promise<string> {
  const scale = targetW / w;
  const targetH = Math.round(h * scale);

  const c = document.createElement('canvas');
  c.width = targetW;
  c.height = targetH;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const ordered = [...layers].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));

  for (const L of ordered) {
    if (!L.visible) continue;
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const el = new Image();
      el.onload = () => res(el);
      el.onerror = rej;
      el.decoding = 'async';
      el.src = L.canvasData;
    });
    ctx.globalAlpha = L.opacity ?? 1;
    ctx.drawImage(img, 0, 0, w, h, 0, 0, targetW, targetH);
  }
  ctx.globalAlpha = 1;
  return c.toDataURL('image/png');
}
