import { CardContent, ContentScoreBreakdown, VariantMetrics } from '../model/types';

export function calcContentScore(
  content: CardContent,
  metrics?: VariantMetrics
): ContentScoreBreakdown {
  // 1. Photos (0-100, weight 25%)
  let photosScore = 0;
  if (content.mainImageUrl) photosScore += 40; // Main photo is critical
  if (content.imageUrls.length >= 5) photosScore += 60;
  else if (content.imageUrls.length > 0) photosScore += (content.imageUrls.length / 5) * 60;

  // 2. Video (0-100, weight 15%)
  const videoScore = content.hasVideo ? 100 : 0;

  // 3. Title (0-100, weight 15%)
  let titleScore = 0;
  const titleLength = content.title.length;
  if (titleLength > 40 && titleLength <= 100) titleScore = 100;
  else if (titleLength > 10 && titleLength <= 40) titleScore = 70;
  else if (titleLength > 100) titleScore = 80; // too long but okay

  // 4. Characteristics (0-100, weight 20%)
  let charScore = 0;
  const charKeys = Object.keys(content.characteristics);
  if (charKeys.length >= 10) charScore = 100;
  else charScore = (charKeys.length / 10) * 100;

  // 5. Description (0-100, weight 15%)
  let descScore = 0;
  const descLength = content.description.length;
  if (descLength > 500) descScore = 100;
  else if (descLength > 200) descScore = 70;
  else if (descLength > 0) descScore = 30;

  // 6. Social Proof (0-100, weight 10%)
  let socialScore = 0;
  if (metrics) {
    if (metrics.rating >= 4.8) socialScore += 50;
    else if (metrics.rating >= 4.5) socialScore += 40;
    else if (metrics.rating >= 4.0) socialScore += 20;

    if (metrics.reviewsCount >= 50) socialScore += 50;
    else if (metrics.reviewsCount >= 10) socialScore += 30;
    else if (metrics.reviewsCount > 0) socialScore += 10;
  }

  const totalScore = 
    (photosScore * 0.25) + 
    (videoScore * 0.15) + 
    (titleScore * 0.15) + 
    (charScore * 0.20) + 
    (descScore * 0.15) + 
    (socialScore * 0.10);

  return {
    photos: Math.round(photosScore),
    video: Math.round(videoScore),
    title: Math.round(titleScore),
    characteristics: Math.round(charScore),
    description: Math.round(descScore),
    socialProof: Math.round(socialScore),
    totalScore: Math.round(totalScore)
  };
}


