import type { NextApiRequest, NextApiResponse } from 'next';

interface QueryParams {
  birthday?: string;
  color?: string;
  style?: string;
  logo?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
): void {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' } as any);
    return;
  }

  const { birthday, color, style, logo } = req.query as QueryParams;

  if (!birthday) {
    res.status(400).json({ error: 'Missing birthday parameter. Format: YYYY-MM-DD' } as any);
    return;
  }

  // Parse and validate birthday
  const birthDate = new Date(birthday);
  if (isNaN(birthDate.getTime())) {
    res.status(400).json({ error: 'Invalid birthday format. Use YYYY-MM-DD' } as any);
    return;
  }

  // Calculate age
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Build badge URL
  const badgeColor = color ?? 'green';
  const badgeStyle = style ?? 'for-the-badge';
  const badgeLogo = logo ?? 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzY4NTI4MTkxNzU5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY4NjkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUxMiAyMzQuNjY2NjY3YzM0LjEzMzMzMyAwIDY0LTI5Ljg2NjY2NyA2NC02NCAwLTEyLjgtNC4yNjY2NjctMjEuMzMzMzMzLTguNTMzMzMzLTM0LjEzMzMzM0w1MTIgNDIuNjY2NjY3bC01NS40NjY2NjcgOTMuODY2NjY3Yy00LjI2NjY2NyA4LjUzMzMzMy04LjUzMzMzMyAyMS4zMzMzMzMtOC41MzMzMzMgMzQuMTMzMzMzQzQ0OCAyMDQuOCA0NzcuODY2NjY3IDIzNC42NjY2NjcgNTEyIDIzNC42NjY2Njd6TTc4OS4zMzMzMzMgMzQxLjMzMzMzMyA1NTQuNjY2NjY3IDM0MS4zMzMzMzMgNTU0LjY2NjY2NyAyNzcuMzMzMzMzbC04NS4zMzMzMzMgMEw0NjkuMzMzMzMzIDM0MS4zMzMzMzMgMjM0LjY2NjY2NyAzNDEuMzMzMzMzQzEyOCAzNDEuMzMzMzMzIDQyLjY2NjY2NyA0MjYuNjY2NjY3IDQyLjY2NjY2NyA1MzMuMzMzMzMzYzAgNjguMjY2NjY3IDM0LjEzMzMzMyAxMjMuNzMzMzMzIDg1LjMzMzMzMyAxNTcuODY2NjY3TDEyOCA5ODEuMzMzMzMzbDc2OCAwIDAtMjkwLjEzMzMzM2M1MS4yLTM0LjEzMzMzMyA4NS4zMzMzMzMtOTMuODY2NjY3IDg1LjMzMzMzMy0xNTcuODY2NjY3Qzk4MS4zMzMzMzMgNDI2LjY2NjY2NyA4OTYgMzQxLjMzMzMzMyA3ODkuMzMzMzMzIDM0MS4zMzMzMzN6TTc4OS4zMzMzMzMgNjQwYy0yOS44NjY2NjcgMC01NS40NjY2NjctMTIuOC03Ni44LTI5Ljg2NjY2N2wtNjQtNjQtNjQgNjRDNTY3LjQ2NjY2NyA2MjcuMiA1NDEuODY2NjY3IDY0MCA1MTIgNjQwYy0yOS44NjY2NjcgMC01NS40NjY2NjctMTIuOC03Ni44LTI5Ljg2NjY2N2wtNjQtNjQtNjQgNjRDMjkwLjEzMzMzMyA2MjcuMiAyNjQuNTMzMzMzIDY0MCAyMzQuNjY2NjY3IDY0MCAxNzQuOTMzMzMzIDY0MCAxMjggNTkzLjA2NjY2NyAxMjggNTMzLjMzMzMzM1MxNzQuOTMzMzMzIDQyNi42NjY2NjcgMjM0LjY2NjY2NyA0MjYuNjY2NjY3bDU1NC42NjY2NjcgMGM1OS43MzMzMzMgMCAxMDYuNjY2NjY3IDQ2LjkzMzMzMyAxMDYuNjY2NjY3IDEwNi42NjY2NjdTODQ5LjA2NjY2NyA2NDAgNzg5LjMzMzMzMyA2NDB6IiBwLWlkPSI2ODcwIiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+';

  const badgeUrl = `https://img.shields.io/badge/Age-${age}-${badgeColor}?style=${badgeStyle}&logo=${badgeLogo}`;

  // Redirect to the badge
  res.redirect(badgeUrl);
}
