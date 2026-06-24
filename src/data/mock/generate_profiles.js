/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const dataDir = path.join('z:', '!_STUFF', 'weekend biliard', 'CONCURENTS', 'data', 'mock');
const compsFile = path.join(dataDir, 'competitors.json');

const data = JSON.parse(fs.readFileSync(compsFile, 'utf8'));
const slugs = data.competitors.map(c => c.slug);
slugs.push(data.meta.ourBusiness.slug); // weekend-billiard

// 1. Get all directories in dataDir
const entries = fs.readdirSync(dataDir, { withFileTypes: true });
const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);

// 2. Delete old directories not in slugs
for (const dir of dirs) {
  if (!slugs.includes(dir)) {
    fs.rmSync(path.join(dataDir, dir), { recursive: true, force: true });
    console.log('Deleted old dir:', dir);
  }
}

// 3. Create generic profile for each slug
for (const comp of data.competitors) {
  const dirPath = path.join(dataDir, comp.slug);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const isBGroup = comp.slug === 'billiard-group';

  const profile = {
    competitorId: comp.slug,
    isOurBusiness: false,
    ratings: {
      overall: isBGroup ? 4.9 : 4.5,
      trend: "+0.1",
      trendDirection: "up",
      totalReviews: isBGroup ? 1200 : 350,
      newReviewsThisMonth: isBGroup ? 45 : 12,
      platforms: {
        googleMaps: { rating: isBGroup ? 4.8 : 4.4, reviews: 400, trend: "stable" },
        twogis: { rating: isBGroup ? 5.0 : 4.6, reviews: 600, trend: "up" },
        yandexMaps: { rating: 4.9, reviews: 200, trend: "up" }
      },
      distribution: { "5": 80, "4": 10, "3": 5, "2": 3, "1": 2 },
      sentimentScore: isBGroup ? 92 : 85,
      sentimentTrend: "+5%"
    },
    pricing: {
      currency: "RUB",
      pricePerHour: { current: 1500, previous: 1500, delta: 0, deltaDirection: "stable", lastChanged: "2026-01-10T00:00:00Z" },
      priceSegments: {
        "morning": { label: "Утро", price: 1000, previous: 1000 },
        "evening": { label: "Вечер", price: 2000, previous: 2000 }
      },
      priceHistory: [
        { month: "Янв", evening: 2000 },
        { month: "Фев", evening: 2000 }
      ],
      priceIndex: isBGroup ? 120 : 100,
      priceIndexLabel: isBGroup ? "Premium" : "Average",
      promotions: []
    },
    activity: {
      level: comp.activityLevel || "medium",
      levelLabel: comp.activityLevel === "high" ? "Высокая" : "Средняя",
      score: 75,
      socialMedia: {
        instagram: { followers: 5000, followersGrowth: "+2%", postsThisMonth: 10, avgEngagement: 3.5, lastPost: "2026-06-18T10:00:00Z" },
        vk: { followers: 3000, followersGrowth: "+1%", postsThisMonth: 8, avgEngagement: 2.1, lastPost: "2026-06-15T12:00:00Z" }
      },
      advertising: { activeCampaigns: 2, estimatedBudget: 50000, platforms: ["Yandex"], lastDetected: "2026-06-19T00:00:00Z" },
      websiteUpdates: { lastUpdate: "2026-06-01T00:00:00Z", updatesThisMonth: 1, changesDetected: ["Price update"] },
      activityHeatmap: {}
    },
    marketPosition: {
      qualityScore: isBGroup ? 90 : 75,
      priceLevel: 80,
      marketShareEstimate: isBGroup ? 25 : 5,
      quadrant: isBGroup ? "Leader" : "Niche"
    },
    radarMetrics: {
      price: 8, quality: 8, service: 7, location: 6, assortment: 8, atmosphere: 7, marketing: 6, loyalty: 7
    },
    swot: {
      strengths: ["Широкий ассортимент", "Хорошие отзывы"],
      weaknesses: ["Устаревший сайт"],
      opportunities: ["Новый сегмент B2B"],
      threats: ["Агрессивная ценовая политика конкурентов"]
    },
    businessInfo: {
      foundedYear: 2010,
      tablesCount: 0,
      tableTypes: { russian: 0, pool: 0, snooker: 0 },
      area_sqm: 1000,
      workingHours: "10:00 - 20:00",
      hasBar: false,
      hasKitchen: false,
      hasParking: true,
      hasWifi: true,
      additionalServices: ["Delivery", "Installation"],
      employeeCount: 50
    }
  };

  fs.writeFileSync(path.join(dirPath, 'profile.json'), JSON.stringify(profile, null, 2));
}

// 4. Create profile for weekend-billiard
const weekendDir = path.join(dataDir, data.meta.ourBusiness.slug);
if (!fs.existsSync(weekendDir)) {
  fs.mkdirSync(weekendDir, { recursive: true });
}
const weekendProfile = {
  competitorId: "weekend-billiard",
  isOurBusiness: true,
  ratings: {
    overall: 4.8,
    trend: "+0.2",
    trendDirection: "up",
    totalReviews: 850,
    newReviewsThisMonth: 25,
    platforms: {
      googleMaps: { rating: 4.7, reviews: 250, trend: "up" },
      twogis: { rating: 4.9, reviews: 400, trend: "stable" },
      yandexMaps: { rating: 4.8, reviews: 200, trend: "up" }
    },
    distribution: { "5": 70, "4": 15, "3": 10, "2": 3, "1": 2 },
    sentimentScore: 88,
    sentimentTrend: "+3%"
  },
  pricing: {
    currency: "RUB",
    pricePerHour: { current: 1500, previous: 1500, delta: 0, deltaDirection: "stable", lastChanged: "2026-01-10T00:00:00Z" },
    priceSegments: {
      "morning": { label: "Утро", price: 1000, previous: 1000 },
      "evening": { label: "Вечер", price: 2000, previous: 2000 }
    },
    priceHistory: [
      { month: "Янв", evening: 2000 },
      { month: "Фев", evening: 2000 }
    ],
    priceIndex: 100,
    priceIndexLabel: "Average",
    promotions: []
  },
  activity: {
    level: "medium",
    levelLabel: "Средняя",
    score: 65,
    socialMedia: {
      instagram: { followers: 3000, followersGrowth: "+1%", postsThisMonth: 5, avgEngagement: 2.5, lastPost: "2026-06-10T10:00:00Z" },
      vk: { followers: 2000, followersGrowth: "+0%", postsThisMonth: 4, avgEngagement: 1.8, lastPost: "2026-06-12T12:00:00Z" }
    },
    advertising: { activeCampaigns: 1, estimatedBudget: 30000, platforms: ["Yandex"], lastDetected: "2026-06-19T00:00:00Z" },
    websiteUpdates: { lastUpdate: "2026-05-01T00:00:00Z", updatesThisMonth: 0, changesDetected: [] },
    activityHeatmap: {}
  },
  marketPosition: {
    qualityScore: 85,
    priceLevel: 75,
    marketShareEstimate: 15,
    quadrant: "Challenger"
  },
  radarMetrics: {
    price: 7, quality: 9, service: 8, location: 8, assortment: 7, atmosphere: 8, marketing: 5, loyalty: 8
  },
  swot: {
    strengths: ["Эксклюзивные бренды (Rasson)", "Хороший сервис"],
    weaknesses: ["Устаревший дизайн", "Нет рассрочки"],
    opportunities: ["Развитие B2B сегмента", "Внедрение современного сайта"],
    threats: ["Сильные позиции B-Group"]
  },
  businessInfo: {
    foundedYear: 2005,
    tablesCount: 0,
    tableTypes: { russian: 0, pool: 0, snooker: 0 },
    area_sqm: 800,
    workingHours: "10:00 - 21:00",
    hasBar: false,
    hasKitchen: false,
    hasParking: true,
    hasWifi: true,
    additionalServices: ["Delivery", "Installation"],
    employeeCount: 40
  }
};
fs.writeFileSync(path.join(weekendDir, 'profile.json'), JSON.stringify(weekendProfile, null, 2));

console.log('Profiles generated for', slugs.length, 'competitors.');

