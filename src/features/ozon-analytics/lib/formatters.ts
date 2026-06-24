export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} млн ₽`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k ₽`;
  }
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`;
}

export function formatCurrencyFull(value: number): string {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function formatDelta(value: number, type: 'percent' | 'absolute' = 'absolute'): string {
  const sign = value > 0 ? '+' : '';
  if (type === 'percent') {
    return `${sign}${value.toFixed(1)}%`;
  }
  return `${sign}${value}`;
}

export function formatVelocity(value: number): string {
  return `${value.toFixed(1)} шт/день`;
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString('ru-RU');
}
