import type { VercelRequest, VercelResponse } from '@vercel/node';

interface QueryParams {
  payday?: string;
  total?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function dateAtUtcMidnight(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function paydayForMonth(year: number, month: number, payday: number): Date {
  return dateAtUtcMidnight(year, month, Math.min(payday, daysInMonth(year, month)));
}

function parsePayday(value: string): number | null {
  if (/^\d{1,2}$/.test(value)) {
    const day = Number(value);
    return day >= 1 && day <= 31 ? day : null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = dateAtUtcMidnight(year, month - 1, day);

  return parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
    ? day
    : null;
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export default function handler(req: VercelRequest, res: VercelResponse): void {
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

  const { payday = '10', total = '3000' } = req.query as QueryParams;
  const paydayNumber = parsePayday(payday);
  const totalNumber = Number(total);
  if (paydayNumber === null) {
    res.status(400).json({ error: 'Invalid payday. Use a day from 1 to 31 or YYYY-MM-DD.' });
    return;
  }
  if (!Number.isFinite(totalNumber) || totalNumber < 0) {
    res.status(400).json({ error: 'Invalid total. Use a non-negative number.' });
    return;
  }

  // Use China Standard Time so the result matches the user's calendar day.
  const nowInShanghai = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
  const todayUtc = dateAtUtcMidnight(
    nowInShanghai.getFullYear(),
    nowInShanghai.getMonth(),
    nowInShanghai.getDate()
  );
  let cycleStart = paydayForMonth(todayUtc.getUTCFullYear(), todayUtc.getUTCMonth(), paydayNumber);
  if (todayUtc < cycleStart) {
    cycleStart = paydayForMonth(todayUtc.getUTCFullYear(), todayUtc.getUTCMonth() - 1, paydayNumber);
  }

  const nextMonth = cycleStart.getUTCMonth() + 1;
  const cycleEnd = paydayForMonth(cycleStart.getUTCFullYear() + Math.floor(nextMonth / 12), nextMonth % 12, paydayNumber);
  const cycleDays = Math.round((cycleEnd.getTime() - cycleStart.getTime()) / DAY_MS);
  const elapsedDays = Math.max(0, Math.round((todayUtc.getTime() - cycleStart.getTime()) / DAY_MS));
  const dailyExpense = totalNumber / cycleDays;
  const balance = roundCurrency(Math.max(0, totalNumber - dailyExpense * elapsedDays));

  res.status(200).json({
    balance: balance.toLocaleString('en-US', { maximumFractionDigits: 2 }),
    balanceValue: balance,
    dailyExpense: roundCurrency(dailyExpense),
    cycleDays,
    elapsedDays,
  });
}
