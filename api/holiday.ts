import type { VercelRequest, VercelResponse } from '@vercel/node';

interface HolidayData {
  name: string;
  date: string;
  startDate: string;
  endDate: string;
}

interface HolidayInfo {
  name: string;
  date: string;
  rest: number;
  isCurrent: boolean;
  remainingDays?: number;
}

interface QueryParams {
  bgStartColor?: string;
  bgEndColor?: string;
  textColor?: string;
  textColor2?: string;
}

const HOLIDAYS: HolidayData[] = [
  { name: '元旦', date: '1月1日-1月3日', startDate: '2026-01-01', endDate: '2026-01-03' },
  { name: '春节', date: '2月15日-2月23日', startDate: '2026-02-15', endDate: '2026-02-23' },
  { name: '清明节', date: '4月4日-4月6日', startDate: '2026-04-04', endDate: '2026-04-06' },
  { name: '劳动节', date: '5月1日-5月5日', startDate: '2026-05-01', endDate: '2026-05-05' },
  { name: '端午节', date: '6月19日-6月21日', startDate: '2026-06-19', endDate: '2026-06-21' },
  { name: '中秋节', date: '9月25日-9月27日', startDate: '2026-09-25', endDate: '2026-09-27' },
  { name: '国庆节', date: '10月1日-10月7日', startDate: '2026-10-01', endDate: '2026-10-07' },
];

function getDaysBetween(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

function getNextHoliday(): HolidayInfo | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const holiday of HOLIDAYS) {
    const startDate = new Date(holiday.startDate + 'T00:00:00+08:00');
    const endDate = new Date(holiday.endDate + 'T00:00:00+08:00');

    if (today >= startDate && today <= endDate) {
      const remainingDays = getDaysBetween(today, endDate) + 1;
      return {
        name: holiday.name,
        date: holiday.date,
        rest: 0,
        isCurrent: true,
        remainingDays,
      };
    }

    const diffDays = getDaysBetween(today, startDate);
    if (diffDays > 0) {
      return {
        name: holiday.name,
        date: holiday.date,
        rest: diffDays,
        isCurrent: false,
      };
    }
  }

  return null;
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

  const { bgStartColor, bgEndColor, textColor, textColor2 } = req.query as QueryParams;

  const holidayInfo = getNextHoliday();

  if (holidayInfo) {
    const svg = generateHolidaySVG(holidayInfo, bgStartColor, bgEndColor, textColor, textColor2);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.send(svg);
  } else {
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

  const line1 = holiday.isCurrent
    ? `🎉 正在放假：<tspan fill="${textColor2}">${holiday.name} (${holiday.date})</tspan>`
    : `📅 下一个节假日是：<tspan fill="${textColor2}">${holiday.name} (${holiday.date})</tspan>`;

  const line2 = holiday.isCurrent
    ? `🧧 假期剩余：<tspan fill="#D05364">${holiday.remainingDays} 天</tspan>`
    : `⏳ 距离还有：<tspan fill="#D05364">${holiday.rest} 天</tspan>`;

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
    ${line1}
  </text>
  <text x="${padding}" y="${padding * 3 + lineHeight}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${textColor}">
    ${line2}
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