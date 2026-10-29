import { PALETTE, type DesignSettings, type ThemeId } from '../types.ts';

export interface ReferenceMetrics {
  width: number;
  height: number;
  whiteSpace: number;
  visualDensity: number;
  margins: { top: number; right: number; bottom: number; left: number };
  accent: string | null;
  suggestedTheme: ThemeId;
  suggestedTextSize: DesignSettings['textSize'];
}

/** Analyze only raster pixels. This intentionally does not infer text, fonts, or semantic layout. */
export function analyzeReferencePixels(data: Uint8ClampedArray, width: number, height: number): ReferenceMetrics {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 ||
      width * height > 20_000_000 || data.length !== width * height * 4) {
    throw new Error('참고 이미지 크기 또는 픽셀 데이터가 올바르지 않습니다.');
  }
  const total = width * height;
  let white = 0, occupied = 0, minX = width, minY = height, maxX = -1, maxY = -1;
  const paletteCounts = new Array(PALETTE.length).fill(0) as number[];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], alpha = data[i + 3] / 255;
    const x = (i / 4) % width, y = Math.floor(i / 4 / width);
    const luminance = (r * .2126 + g * .7152 + b * .0722) * alpha + 255 * (1 - alpha);
    if (luminance >= 245) white++;
    if (luminance < 238) { occupied++; minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (alpha > .25 && max - min > 35 && max > 55 && max < 245) {
      let nearest = 0, best = Infinity;
      PALETTE.forEach((color, index) => {
        const hex = color.value.slice(1);
        const pr = parseInt(hex.slice(0, 2), 16), pg = parseInt(hex.slice(2, 4), 16), pb = parseInt(hex.slice(4, 6), 16);
        const distance = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
        if (distance < best) { nearest = index; best = distance; }
      });
      paletteCounts[nearest]++;
    }
  }
  const visualDensity = occupied / total;
  const whiteSpace = white / total;
  const dominant = Math.max(...paletteCounts);
  const accent = dominant ? PALETTE[paletteCounts.indexOf(dominant)].value : null;
  const margins = maxX < 0 ? { top: 0, right: 0, bottom: 0, left: 0 } : {
    top: minY / height, right: (width - maxX - 1) / width,
    bottom: (height - maxY - 1) / height, left: minX / width,
  };
  return {
    width, height, whiteSpace, visualDensity, margins, accent,
    suggestedTheme: visualDensity > .58 ? 'compact' : whiteSpace > .48 ? 'minimal' : 'editorial',
    suggestedTextSize: visualDensity > .58 ? 'small' : whiteSpace > .48 ? 'large' : 'medium',
  };
}
