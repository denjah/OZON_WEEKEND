// ============================================================
// CompetitorIQ — TypeScript Type Definitions
// Полная типизация всех моковых данных портала
// ============================================================

// --- Common Types ---

export type ThreatLevel = 'critical' | 'warning' | 'normal';
export type CompetitorType = 'self' | 'direct' | 'indirect' | 'potential';
export type TrendDirection = 'up' | 'down' | 'stable';
export type ActivityLevel = 'very-high' | 'high' | 'medium' | 'low';
export type EventType = 'price' | 'content' | 'advertising' | 'reviews' | 'structural' | 'hr' | 'legal';
export type EventSeverity = 'critical' | 'warning' | 'info';
export type InsightType = 'threat' | 'opportunity' | 'trend' | 'recommendation' | 'forecast' | 'comparison';
export type ImpactLevel = 'high' | 'medium' | 'low';

// --- Competitor Profile ---

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CompetitorLocation {
  city: string;
  district: string;
  address: string;
  coordinates: Coordinates;
}

export interface CompetitorContacts {
  phone: string;
  website: string | null;
  instagram: string | null;
  vk: string | null;
}

export interface TableTypes {
  russian: number;
  pool: number;
  snooker: number;
}

export interface BusinessInfo {
  foundedYear: number;
  tablesCount: number;
  tableTypes: TableTypes;
  area_sqm: number;
  workingHours: string;
  hasBar: boolean;
  hasKitchen: boolean;
  hasParking: boolean;
  hasWifi: boolean;
  additionalServices: string[];
  employeeCount: number;
}

export interface CompetitorBase {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  type: CompetitorType;
  topicColor: string;
  threatLevel: ThreatLevel;
  monitoringSince: string;
  description: string;
  location: CompetitorLocation;
  contacts: CompetitorContacts;
  businessInfo: BusinessInfo;
}

// --- Ratings & Reviews ---

export interface PlatformRating {
  rating: number;
  reviews: number;
  trend: string;
}

export interface RatingDistribution {
  '5': number;
  '4': number;
  '3': number;
  '2': number;
  '1': number;
}

export interface Ratings {
  overall: number;
  trend: string;
  trendDirection: TrendDirection;
  totalReviews: number;
  newReviewsThisMonth: number;
  platforms: {
    googleMaps: PlatformRating;
    twogis: PlatformRating;
    yandexMaps: PlatformRating;
  };
  distribution: RatingDistribution;
  sentimentScore: number;
  sentimentTrend: string;
}

// --- Pricing ---

export interface PriceSegment {
  label: string;
  price: number;
  previous: number;
}

export interface PriceHistoryEntry {
  month: string;
  evening: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  discount: number;
  status: 'active' | 'upcoming' | 'expired';
}

export interface Pricing {
  currency: string;
  pricePerHour: {
    current: number;
    previous: number;
    delta: number;
    deltaDirection: TrendDirection;
    lastChanged: string;
  };
  priceSegments: Record<string, PriceSegment>;
  priceHistory: PriceHistoryEntry[];
  priceIndex: number;
  priceIndexLabel: string;
  promotions: Promotion[];
}

// --- Activity ---

export interface SocialMediaPlatform {
  followers: number | null;
  followersGrowth: string | null;
  postsThisMonth: number | null;
  avgEngagement: number | null;
  lastPost: string | null;
}

export interface Advertising {
  activeCampaigns: number;
  estimatedBudget: number;
  platforms: string[];
  lastDetected: string | null;
}

export interface WebsiteUpdates {
  lastUpdate: string | null;
  updatesThisMonth: number;
  changesDetected: string[];
}

export type HeatmapWeek = Record<string, number>;

export interface Activity {
  level: ActivityLevel;
  levelLabel: string;
  score: number;
  socialMedia: {
    instagram: SocialMediaPlatform;
    vk: SocialMediaPlatform;
  };
  advertising: Advertising;
  websiteUpdates: WebsiteUpdates;
  activityHeatmap: Record<string, HeatmapWeek>;
}

// --- Market Position ---

export interface MarketPosition {
  qualityScore: number;
  priceLevel: number;
  marketShareEstimate: number;
  quadrant: string;
}

// --- Radar Metrics ---

export interface RadarMetrics {
  price: number;
  quality: number;
  service: number;
  location: number;
  assortment: number;
  atmosphere: number;
  marketing: number;
  loyalty: number;
}

// --- SWOT ---

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

// --- Full Competitor Profile ---

export interface CompetitorProfile {
  competitorId: string;
  isOurBusiness?: boolean;
  ratings: Ratings;
  pricing: Pricing;
  activity: Activity;
  marketPosition: MarketPosition;
  radarMetrics: RadarMetrics;
  swot?: SWOT;
  businessInfo?: BusinessInfo;
}

// --- Graph Data ---

export interface GraphNode {
  id: string;
  name: string;
  type: CompetitorType | 'platform' | 'audience';
  color: string;
  size: number;
  rating?: number;
  price?: number;
  group: number;
}

export type LinkType = 'price_competition' | 'shared_audience' | 'direct_substitution' | 'shared_platform' | 'audience_segment' | 'partnership';

export interface GraphLink {
  source: string;
  target: string;
  type: LinkType;
  strength: number;
  label?: string;
}

export interface GraphData {
  meta: {
    description: string;
    graphEngine: string;
  };
  nodes: GraphNode[];
  links: GraphLink[];
}

// --- Events (Observatory) ---

export interface EventDetails {
  [key: string]: string | number | string[] | null | undefined;
}

export interface CompetitorEvent {
  id: string;
  competitorId: string;
  type: EventType;
  severity: EventSeverity;
  title: string;
  description: string;
  details: EventDetails;
  source: string;
  sourceUrl: string | null;
  timestamp: string;
  isRead: boolean;
  isPinned: boolean;
}

export interface EventsData {
  period: string;
  events: CompetitorEvent[];
}

// --- Dashboard KPI ---

export interface KPIValue {
  value: number;
  delta: string;
  deltaDirection: TrendDirection;
  deltaLabel: string;
  description: string;
  formatted?: string;
  scale?: string;
  items?: Array<{
    id: string;
    level: ThreatLevel;
    reason: string;
  }>;
}

export interface DashboardKPI {
  period: string;
  generatedAt: string;
  kpi: {
    totalCompetitors: KPIValue;
    avgPriceIndex: KPIValue;
    activeThreats: KPIValue;
    sentimentScore: KPIValue;
  };
  marketOverview: {
    totalMarketPlayers: number;
    avgMarketPrice: number;
    priceRange: { min: number; max: number };
    avgRating: number;
    ourPosition: {
      pricePercentile: number;
      ratingPercentile: number;
      marketShareRank: number;
    };
  };
  competitorsSummary: Array<{
    id: string;
    name: string;
    type: CompetitorType;
    rating: number;
    price: number;
    priceDelta: number;
    activityLevel: ActivityLevel;
    threatLevel: ThreatLevel;
  }>;
  activityTimeline: {
    labels: string[];
    series: {
      socialPosts: number[];
      websiteUpdates: number[];
      adCampaigns: number[];
      promotions: number[];
    };
  };
}

// --- AI Insights ---

export interface Insight {
  id: string;
  type: InsightType;
  severity: EventSeverity;
  title: string;
  description: string;
  affectedCompetitors: string[];
  impact: ImpactLevel;
  confidence: number;
  recommendations: string[];
  createdAt: string;
  acknowledged: boolean;
}

export interface Report {
  id: string;
  title: string;
  subtitle: string;
  type: 'monthly' | 'swot' | 'pricing' | 'custom';
  generatedAt: string;
  generatedBy: 'auto' | 'manual';
  formats: string[];
  sections: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface InsightsData {
  period: string;
  insights: Insight[];
  reports: Report[];
  chatHistory: ChatMessage[];
}

// --- Config ---

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

export interface CompetitorGroup {
  id: string;
  label: string;
  color: string;
  count: number;
}

export interface AnalysisType {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export interface DataSourceStatus {
  label: string;
  status: 'active' | 'error' | 'paused';
  lastSync: string;
}

export interface PortalConfig {
  appName: string;
  appSubtitle: string;
  businessName: string;
  period: string;
  navigation: NavigationItem[];
  competitorGroups: CompetitorGroup[];
  recentReports: Array<{ id: string; title: string; date: string }>;
  analysisTypes: AnalysisType[];
  aiPromptSuggestions: string[];
  filterOptions: {
    eventTypes: string[];
    threatLevels: string[];
    timePeriods: string[];
    competitorTypes: string[];
  };
  dataSourcesStatus: Record<string, DataSourceStatus>;
}
