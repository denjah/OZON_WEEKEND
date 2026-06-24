import React, { useMemo, useState } from 'react';
import { formatCurrency } from '../lib/formatters';

interface BrandStat {
  id: string;
  name: string;
  revenue: number;
  count: number;
  color?: string;
}

export function BrandDonutChart({ data }: { data: BrandStat[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.slice(0, 6);
  }, [data]);

  const totalRevenue = useMemo(() => {
    return displayData.reduce((sum, item) => sum + item.revenue, 0);
  }, [displayData]);


  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 120;
  const strokeWidth = 50;

  const slices = useMemo(() => {
    let currentAngle = -Math.PI / 2; // start at top
    const result = [];
    for (let i = 0; i < displayData.length; i++) {
      const item = displayData[i];
      const percentage = totalRevenue > 0 ? item.revenue / totalRevenue : 0;
      const angle = percentage * 2 * Math.PI;
      const color = item.color || `hsl(${(i * 60) % 360}, 70%, 50%)`;
      
      const startX = cx + Math.cos(currentAngle) * radius;
      const startY = cy + Math.sin(currentAngle) * radius;
      
      const newAngle = currentAngle + angle;
      
      const endX = cx + Math.cos(newAngle) * radius;
      const endY = cy + Math.sin(newAngle) * radius;
      
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      
      // Path for the donut slice
      const d = `
        M ${startX} ${startY}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      `;

      result.push({ item, d, color, percentage, index: i });
      currentAngle = newAngle;
    }
    return result;
  }, [displayData, totalRevenue, cx, cy, radius]);

  if (displayData.length === 0) return null;

  return (
    <div style={{
      width: '100%',
      height: '450px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '40px',
      background: 'radial-gradient(circle at center, var(--surface-alt) 0%, var(--surface) 100%)',
      borderRadius: '8px',
      position: 'relative'
    }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Drop shadow filter */}
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.3" />
            </filter>
            {slices.map(slice => (
              <linearGradient key={`grad-${slice.index}`} id={`grad-${slice.index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={slice.color} stopOpacity="1" />
                <stop offset="100%" stopColor={slice.color} stopOpacity="0.6" />
              </linearGradient>
            ))}
          </defs>

          {slices.map((slice) => {
            const isHovered = hoveredIndex === slice.index;
            const currentRadius = isHovered ? radius + 10 : radius;
            
            // Recalculate path if hovered to scale out slightly
            if (isHovered) {
              // we just scale the stroke-width and pop it out slightly via CSS
            }

            return (
              <path
                key={slice.item.id}
                d={slice.d}
                fill="none"
                stroke={`url(#grad-${slice.index})`}
                strokeWidth={isHovered ? strokeWidth + 10 : strokeWidth}
                strokeLinecap="butt"
                filter="url(#shadow)"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  cursor: 'pointer',
                  transformOrigin: '50% 50%',
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)'
                }}
                onMouseEnter={() => setHoveredIndex(slice.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          {hoveredIndex !== null ? (
            <div style={{ animation: 'fadeIn 0.2s ease' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {slices[hoveredIndex].item.name}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatCurrency(slices[hoveredIndex].item.revenue)}
              </div>
              <div style={{ fontSize: '12px', color: slices[hoveredIndex].color, marginTop: '4px', fontWeight: 600 }}>
                {Math.round(slices[hoveredIndex].percentage * 100)}%
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Общая выручка
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatCurrency(totalRevenue)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '16px' }}>
        {slices.map((slice) => (
          <div 
            key={slice.item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '6px',
              background: hoveredIndex === slice.index ? 'var(--surface)' : 'transparent',
              cursor: 'pointer',
              transition: 'background 0.2s',
              border: '1px solid',
              borderColor: hoveredIndex === slice.index ? 'var(--border)' : 'transparent'
            }}
            onMouseEnter={() => setHoveredIndex(slice.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: slice.color }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{slice.item.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatCurrency(slice.item.revenue)}</div>
            </div>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
}
