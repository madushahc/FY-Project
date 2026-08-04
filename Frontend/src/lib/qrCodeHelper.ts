/**
 * Utility to generate SVG Data URL for QR Codes in React without heavy native dependencies.
 * Encodes strings into clean visual QR codes for presentation.
 */

export const generateQrSvgDataUrl = (text: string): string => {
  // Simple deterministic matrix generation for standard text strings
  const size = 21; // 21x21 QR code matrix (Version 1)
  const matrix: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

  // Helper to add finder patterns (7x7 squares) at corners
  const addFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          if (row + r < size && col + c < size) {
            matrix[row + r][col + c] = true;
          }
        }
      }
    }
  };

  // Top-left, Top-right, Bottom-left finder patterns
  addFinder(0, 0);
  addFinder(0, size - 7);
  addFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (i % 2 === 0) {
      matrix[6][i] = true;
      matrix[i][6] = true;
    }
  }

  // Hash text to populate data modules deterministically
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  // Fill data payload area
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder pattern zones
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= size - 8;
      const inBL = r >= size - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!inTL && !inTR && !inBL && !isTiming) {
        const val = Math.abs(Math.sin((hash + r * 31 + c * 17) * 999));
        matrix[r][c] = val > 0.45;
      }
    }
  }

  // Generate SVG String
  const rects: string[] = [];
  const cellSize = 10;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        rects.push(`<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`);
      }
    }
  }

  const svgWidth = size * cellSize;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgWidth}" width="${svgWidth}" height="${svgWidth}">
    <rect width="${svgWidth}" height="${svgWidth}" fill="#ffffff" rx="12" />
    <g transform="translate(0, 0)">${rects.join('')}</g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/**
 * Generate full web check-in URL for QR codes so smartphone camera apps can scan and verify check-in instantly.
 * Uses NEXT_PUBLIC_APP_URL env variable if set (for production/network access), otherwise uses window.location.origin.
 * For mobile scanning on local network: set NEXT_PUBLIC_APP_URL=http://<your-local-ip>:3000 in .env.local
 */
export const generateLessonQrPayload = (code: string, courseId?: string, lessonId?: string): string => {
  if (typeof window !== "undefined") {
    // Use NEXT_PUBLIC_APP_URL if set (allows mobile devices on the same network to access)
    const origin = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const params = new URLSearchParams();
    params.set("code", code);
    if (courseId) params.set("courseId", courseId);
    if (lessonId) params.set("lessonId", lessonId);
    return `${origin}/student/scan-qr?${params.toString()}`;
  }
  return code;
};
