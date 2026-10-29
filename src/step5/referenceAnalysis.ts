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

export interface PdfTypographyMetrics {
  selectableTextCount: number;
  medianFontSize: number | null;
  largestToMedianRatio: number | null;
  largestFragmentAlignment: 'left' | 'center' | 'right' | 'unavailable';
}

/** Derive rough typography/layout clues from embedded PDF text; never OCR pixels. */
export function analyzePdfTypography(
  items: readonly { str: string; transform: readonly number[]; width: number }[],
  pageWidth: number,
): PdfTypographyMetrics {
  const fragments = items.flatMap(item => {
    const size = Math.hypot(item.transform[2] ?? NaN, item.transform[3] ?? NaN);
    const x = item.transform[4] ?? NaN;
    if (!item.str.trim() || !Number.isFinite(size) || size <= 0 || !Number.isFinite(x) || !Number.isFinite(item.width)) return [];
    return [{ size, center: x + item.width / 2 }];
  });
  if (!fragments.length || !Number.isFinite(pageWidth) || pageWidth <= 0) {
    return { selectableTextCount: fragments.length, medianFontSize: null, largestToMedianRatio: null, largestFragmentAlignment: 'unavailable' };
  }
  const sizes = fragments.map(fragment => fragment.size).sort((a, b) => a - b);
  const middle = Math.floor(sizes.length / 2);
  const medianFontSize = sizes.length % 2 ? sizes[middle] : (sizes[middle - 1] + sizes[middle]) / 2;
  const largest = fragments.reduce((best, fragment) => fragment.size > best.size ? fragment : best);
  const centerRatio = largest.center / pageWidth;
  const largestFragmentAlignment = centerRatio < .38 ? 'left' : centerRatio > .62 ? 'right' : 'center';
  return {
    selectableTextCount: fragments.length,
    medianFontSize,
    largestToMedianRatio: medianFontSize > 0 ? largest.size / medianFontSize : null,
    largestFragmentAlignment,
  };
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
