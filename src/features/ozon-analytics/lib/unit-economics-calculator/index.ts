import { CalcInput, CalcResult } from './types';
import { calculateFBO } from './fbo-calculator';
import { calculateFBS } from './fbs-calculator';
import { calculateRFBS } from './rfbs-calculator';

export * from './types';
export * from './helpers';
export { calculateFBO, calculateFBS, calculateRFBS };

export function calculateEconomics(input: CalcInput, schema: 'fbo' | 'fbs' | 'rfbs'): CalcResult {
  const commission = input.sellingPrice * (input.commissionPercent / 100);
  const acquiring = input.sellingPrice * (input.acquiringPercent / 100);
  
  let logistics;
  if (schema === 'fbo') logistics = calculateFBO(input);
  else if (schema === 'fbs') logistics = calculateFBS(input);
  else logistics = calculateRFBS(input);
  
  // Expenses = COGS + Commission + Acquiring + Forward Logistics + Return Logistics
  const totalExpenses = input.cogs + commission + acquiring + logistics.cost + logistics.returnCost;
  
  // Tax applies to revenue before expenses (usually)
  const tax = input.sellingPrice * (input.taxPercent / 100);
  
  const netProfit = input.sellingPrice - totalExpenses - tax;
  
  const marginPercent = input.sellingPrice > 0 ? (netProfit / input.sellingPrice) * 100 : 0;
  
  // ROI = NetProfit / COGS 
  const roiPercent = input.cogs > 0 ? (netProfit / input.cogs) * 100 : 0;
  
  // Break-even price
  // BEP = (COGS + fixed_logistics_forward + fixed_logistics_return) / (1 - comm - acq - tax)
  const variableCostsPercent = (input.commissionPercent + input.acquiringPercent + input.taxPercent) / 100;
  let breakEven = 0;
  if (variableCostsPercent < 1) {
    breakEven = (input.cogs + logistics.cost + logistics.returnCost) / (1 - variableCostsPercent);
  }

  return {
    totalExpenses,
    netProfit,
    marginPercent,
    roiPercent,
    breakEven,
    commission,
    acquiring,
    tax,
    logistics,
  };
}
