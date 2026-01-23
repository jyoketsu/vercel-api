import type { VercelRequest, VercelResponse } from '@vercel/node';

interface TimorHolidayResponse {
  code: number;
  holiday: {
    holiday: boolean;
    name: string;
    wage: number;
    date: string;
    rest: number;
  };
  type?: {
    holiday?: {
      type: number;
      name: string;
      week: number;
    };
    workday?: {
      type: number;
      name: string;
      week: number;
    };
  };
}

interface HolidayInfo {
  name: string;
  date: string;
  rest: number;
  isHoliday: boolean;
  wage?: number;
}

interface QueryParams {
  bgStartColor?: string;      // Background color
  bgEndColor?: string;      // Background color
  textColor?: string;    // Text color
  textColor2?: string;    // Text color
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { bgStartColor, bgEndColor, textColor, textColor2, } = req.query as QueryParams;

  // Use custom data if provided, otherwise fetch from API
  let holidayInfo: HolidayInfo | null = null;

  try {
    const response = await fetch('https://timor.tech/api/holiday/next');

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: TimorHolidayResponse = await response.json() as TimorHolidayResponse;

    if (data.code !== 0 || !data.holiday || !data.holiday.holiday) {
      // Generate SVG for no holiday available
      const svg = generateNoHolidaySVG(bgStartColor, bgEndColor, textColor);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
      res.send(svg);
      return;
    }

    holidayInfo = {
      name: data.holiday.name,
      date: data.holiday.date,
      rest: data.holiday.rest,
      isHoliday: true,
      wage: data.holiday.wage
    };
  } catch (error) {
    console.error('Error fetching holiday data:', error);

    // Generate error SVG
    const svg = generateErrorSVG(bgStartColor, bgEndColor, textColor);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(500).send(svg);
    return;
  }

  // Generate SVG for holiday card
  if (holidayInfo) {
    const svg = generateHolidaySVG(holidayInfo, bgStartColor, bgEndColor, textColor, textColor2);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.send(svg);
  } else {
    // Generate SVG for no holiday available
    const svg = generateNoHolidaySVG(bgStartColor, bgEndColor, textColor);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.send(svg);
  }
}

function generateHolidaySVG(holiday: HolidayInfo, bgStartColor: string = '#F0EAE9', bgEndColor: string = '#E7E0F2', textColor: string = '#8839EF', textColor2: string = '#D05364'): string {
  const width = 328;
  const height = 98;
  const padding = 12;
  const lineHeight = 35;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" gradientTransform="rotate(10)">
      <stop offset="0%" stop-color="${bgStartColor}" />
      <stop offset="100%" stop-color="${bgEndColor}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bgGradient)" rx="8" ry="8"/>
  <text x="${padding}" y="${padding * 3}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${textColor}">
    📅 下一个节假日是：<tspan fill="${textColor2}">${holiday.name} (${holiday.date})</tspan>
  </text>
  <text x="${padding}" y="${padding * 3 + lineHeight}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${textColor}">
    ⏳ 距离还有：<tspan fill="#D05364">${holiday.rest} 天</tspan>
  </text>
</svg>`;
}

function generateNoHolidaySVG(bgStartColor: string = '#F0EAE9', bgEndColor: string = '#E7E0F2', textColor: string = '#8839EF'): string {
  const width = 328;
  const height = 98;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" gradientTransform="rotate(10)">
      <stop offset="0%" stop-color="${bgStartColor}" />
      <stop offset="100%" stop-color="${bgEndColor}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bgGradient)" rx="8" ry="8"/>
  <text x="${12}" y="${height / 2}" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${textColor}">
    暂无节假日安排
  </text>
</svg>`;
}

function generateErrorSVG(bgStartColor: string = '#F0EAE9', bgEndColor: string = '#E7E0F2', textColor: string = '#8839EF'): string {
  const width = 328;
  const height = 98;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" gradientTransform="rotate(10)">
      <stop offset="0%" stop-color="${bgStartColor}" />
      <stop offset="100%" stop-color="${bgEndColor}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bgGradient)" rx="8" ry="8"/>
  <text x="${12}" y="${height / 2}" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${textColor}">
    服务暂时不可用
  </text>
</svg>`;
}