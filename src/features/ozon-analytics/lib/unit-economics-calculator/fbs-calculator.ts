import { CalcInput, LogisticsResult } from './types';
import { calculateFBO } from './fbo-calculator';

export function calculateFBS(input: CalcInput): LogisticsResult {
  if (!input.dimensions || input.dimensions.volume <= 0) {
    return { cost: 0, returnCost: 0, details: 'Нет габаритов' };
  }

  // FBS is FBO logistics + FBS processing fee
  const fboResult = calculateFBO(input);
  
  if (fboResult.cost === 0) {
    return fboResult;
  }

  // Processing fee for FBS
  // 15 rubles for standard items, up to 50 for large. Let's use 25 rubles flat for processing.
  const FBS_PROCESSING = 25; 
  const cost = fboResult.cost + FBS_PROCESSING;
  
  // Return cost includes processing
  const returnCost = cost * (input.returnsPercent / 100);

  return {
    cost,
    returnCost,
    details: `${fboResult.details.split(' = ')[0]} + Proc(25₽) = ${cost.toFixed(2)}₽`
  };
}
