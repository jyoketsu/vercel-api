export interface HolidayData {
  name: string;
  date: string;
  startDate: string;
  endDate: string;
}

export const HOLIDAYS: HolidayData[] = [
  { name: '元旦', date: '1月1日-1月3日', startDate: '2026-01-01', endDate: '2026-01-03' },
  { name: '春节', date: '2月15日-2月23日', startDate: '2026-02-15', endDate: '2026-02-23' },
  { name: '清明节', date: '4月4日-4月6日', startDate: '2026-04-04', endDate: '2026-04-06' },
  { name: '劳动节', date: '5月1日-5月5日', startDate: '2026-05-01', endDate: '2026-05-05' },
  { name: '端午节', date: '6月19日-6月21日', startDate: '2026-06-19', endDate: '2026-06-21' },
  { name: '中秋节', date: '9月25日-9月27日', startDate: '2026-09-25', endDate: '2026-09-27' },
  { name: '国庆节', date: '10月1日-10月7日', startDate: '2026-10-01', endDate: '2026-10-07' },
];