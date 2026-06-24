export function parseVolumeToBucket(vol: number): string {
  if (vol <= 0.2) return '0-0,200 л';
  if (vol <= 0.4) return '0,201-0,4 л';
  if (vol <= 0.6) return '0,401-0,6 л';
  if (vol <= 0.8) return '0,601-0,8 л';
  if (vol <= 1) return '0,801-1 л';
  if (vol <= 1.25) return '1,001-1,25 л';
  if (vol <= 1.5) return '1,251-1,5 л';
  if (vol <= 1.75) return '1,501-1,75 л';
  if (vol <= 2) return '1,751-2 л';
  if (vol <= 3) return '2,001-3 л';
  if (vol <= 4) return '3,001-4 л';
  if (vol <= 5) return '4,001-5 л';
  if (vol <= 6) return '5,001-6 л';
  if (vol <= 7) return '6,001-7 л';
  if (vol <= 8) return '7,001-8 л';
  if (vol <= 9) return '8,001-9 л';
  if (vol <= 10) return '9,001-10 л';
  if (vol <= 11) return '10,001-11 л';
  if (vol <= 12) return '11,001-12 л';
  if (vol <= 13) return '12,001-13 л';
  if (vol <= 14) return '13,001-14 л';
  if (vol <= 15) return '14,001-15 л';
  if (vol <= 17) return '15,001-17 л';
  if (vol <= 20) return '17,001-20 л';
  if (vol <= 25) return '20,001-25 л';
  if (vol <= 30) return '25,001-30 л';
  if (vol <= 35) return '30,001-35 л';
  if (vol <= 40) return '35,001-40 л';
  if (vol <= 45) return '40,001-45 л';
  if (vol <= 50) return '45,001-50 л';
  if (vol <= 60) return '50,001-60 л';
  if (vol <= 70) return '60,001-70 л';
  if (vol <= 80) return '70,001-80 л';
  if (vol <= 90) return '80,001-90 л';
  if (vol <= 100) return '90,001-100 л';
  if (vol <= 125) return '100,001-125 л';
  if (vol <= 150) return '125,001-150 л';
  if (vol <= 175) return '150,001-175 л';
  if (vol <= 200) return '175,001-200 л';
  if (vol <= 400) return '200,001-400 л';
  if (vol <= 600) return '400,001-600 л';
  if (vol <= 800) return '600,001-800 л';
  return 'От 800,001 л'; // Handled via 'От 800,001 л' in original, our text is 'свыше 800,001 л' roughly. 
}

export function parseStringPrice(val: unknown): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  return parseFloat(val.toString().replace(',', '.').replace(/[^\d.-]/g, ''));
}
