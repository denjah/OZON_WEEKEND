import React, { useMemo } from 'react';
import { formatCurrency } from '../lib/formatters';

interface BrandStat {
  id: string;
  name: string;
  revenue: number;
  count: number;
  color?: string;
}

export function BrandTreemap({ data }: { data: BrandStat[] }) {
  const displayData = useMemo(() => {
    if (!data || data.length === 0) return [];
    // Take top 8 for treemap
    return data.slice(0, 8);
  }, [data]);

  const totalRevenue = useMemo(() => {
    return displayData.reduce((sum, item) => sum + item.revenue, 0);
  }, [displayData]);

  if (displayData.length === 0) return null;

  // Simple pseudo-treemap layout using flex/grid
  // We'll just do a flex layout where width/height are roughly proportional to revenue

  return (
    <div style={{
      width: '100%',
      height: '450px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '16px',
      background: 'var(--surface-alt)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {displayData.map((item, i) => {
        const percentage = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0;
        const color = item.color || `hsl(${(i * 50) % 360}, 65%, 45%)`;
        
        // Simple sizing heuristic
        const flexBasis = percentage > 25 ? '100%' : percentage > 15 ? '48%' : '30%';
        const flexGrow = percentage;

        return (
          <div key={item.id} style={{
            flexGrow,
            flexBasis,
            minHeight: '80px',
            background: `linear-gradient(135deg, color-mix(in srgb, ${color} 80%, transparent), ${color})`,
            borderRadius: '6px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, filter 0.2s',
            cursor: 'default',
            overflow: 'hidden',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)';
            e.currentTarget.style.filter = 'brightness(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.filter = 'brightness(1)';
          }}>
            <div style={{ zIndex: 1, position: 'relative' }}>
              <div style={{ fontWeight: 600, fontSize: percentage > 15 ? '18px' : '14px', marginBottom: '4px', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                {item.count} товаров
              </div>
            </div>
            <div style={{ 
              zIndex: 1, 
              position: 'relative', 
              fontWeight: 800, 
              fontSize: percentage > 15 ? '20px' : '16px',
              textAlign: 'right',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)'
            }}>
              {formatCurrency(item.revenue)}
            </div>
            
            {/* Background texture/pattern */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '150%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 10.01%)',
              backgroundSize: '20px 20px',
              opacity: 0.4,
              transform: 'rotate(15deg)',
              pointerEvents: 'none'
            }} />
          </div>
        );
      })}
    </div>
  );
}
