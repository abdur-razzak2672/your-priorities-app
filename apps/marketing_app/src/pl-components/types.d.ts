
declare module 'lit-tailwindcss';

interface PlausibleQueryFilters {
  goal?: string;
  props?: string;
  prop_key?: string;
  prop_value?: string;
  source?: string;
  utm_medium?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  screen?: string;
  browser?: string;
  browser_version?: string;
  os?: string;
  os_version?: string;
  country?: string;
  region?: string;
  city?: string;
  page?: string;
  entry_page?: string;
  exit_page?: string;
}

interface PlausibleSiteData {
  domain?: string;
  hasGoals: boolean;
  embedded: boolean;
  offset?: number;
}

interface PlausibleQueryData {
  period: string;
  date?: Date;
  from?: Date;
  to?: Date;
  filters?: PlausibleQueryFilters;
  with_imported?: boolean;
  auth?: string;
}

interface PlausibleQueryStringsData {
  date?: string;
  from?: string;
  to?: string;
  period: string;
  filters?: PlausibleQueryFilters;
  with_imported?: boolean;
  auth?: string;
}

interface PlausiblePropValueData {
  value: number;
  name: string;
  unique_conversions: number;
  total_conversions: number;
}

interface PlausibleStateData {
  query?: PlausibleQueryData;
  timer?: any;
  exported?: boolean;
  loading?: boolean;
  loadingStage?: number;
  metric?: string;
  viewport?: number;
  graphData?: any;
  propKey?: string;
  goals?: PlausibleGoalData[];
  prevHeight?: number;
  breakdown?: PlausiblePropValueData[];
  topStatData?: PlausibleTopStatsData;
  page?: number;
  moreResultsAvailable?: boolean;
}

interface PlausibleStatData {
  value: number;
  change: number;
  name: string;
}

interface PlausibleTopStatsData {
  top_stats: PlausibleStatData[];
  sample_percent: number;
  imported_source: string;
  with_imported: boolean;
}

interface PlausibleGoalData {
  prop_names: string[];
  name: string;
  total_conversions: number;
  unique_conversions: number;
}