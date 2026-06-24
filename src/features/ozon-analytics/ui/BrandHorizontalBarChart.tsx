import React, { useMemo } from 'react';
import { formatCurrency } from '../lib/formatters';

interface BrandStat {
  id: string;
  name: string;
  revenue: number;
  count: number;
  color?: string;
}

export function BrandHorizontalBarChart({ data }: { data: BrandStat[] }) {
  const displayData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.slice(0, 8); // Top 8 for horizontal bars
  }, [data]);

  const maxRevenue = useMemo(() => {
    if (displayData.length === 0) return 0;
    return Math.max(...displayData.map(d => d.revenue));
  }, [displayData]);

  if (displayData.length === 0) return null;

  return (
    <div style={{
      width: '100%',
      height: '450px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '24px',
      background: 'var(--surface-alt)',
      borderRadius: '8px',
      overflowY: 'auto'
    }}>
      {displayData.map((item, i) => {
        const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
        const color = item.color || `hsl(${(i * 50) % 360}, 70%, 55%)`;

        return (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.count} товаров</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatCurrency(item.revenue)}
              </span>
            </div>
            
            <div style={{ 
              width: '100%', 
              height: '12px', 
              background: 'var(--surface)', 
              borderRadius: '6px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${percentage}%`,
                background: `linear-gradient(90deg, color-mix(in srgb, ${color} 50%, transparent), ${color})`,
                borderRadius: '6px',
                boxShadow: `0 0 10px color-mix(in srgb, ${color} 40%, transparent)`,
                transition: 'width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                animation: `slideRight 1s ease-out forwards`
              }}>
                {/* Micro-animation shimmer */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animation: 'shimmer 2s infinite'
                }} />
              </div>
            </div>
          </div>
        );
      })}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideRight {
          from { width: 0; }
        }
        @keyframes shimmer {
          100% { left: 200%; }
        }
      `}} />
    </div>
  );
}
