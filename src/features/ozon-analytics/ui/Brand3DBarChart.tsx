import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../lib/formatters';

interface BrandStat {
  id: string;
  name: string;
  revenue: number;
  count: number;
  color?: string;
}

interface Props {
  data: BrandStat[];
}

export function Brand3DBarChart({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!data || data.length === 0) return null;

  const maxRev = Math.max(...data.map(d => d.revenue));
  
  return (
    <div style={{ 
      width: '100%', 
      height: '300px', 
      position: 'relative',
      perspective: '1000px',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: '20px',
      paddingBottom: '40px',
      paddingTop: '20px',
    }}>
      {data.map((item, index) => {
        const heightPercent = maxRev > 0 ? (item.revenue / maxRev) * 100 : 0;
        const barHeight = Math.max(heightPercent * 2.2, 10); // scale up to 220px max
        const color = item.color || `hsl(${(index * 60) % 360}, 70%, 50%)`;
        
        return (
          <div 
            key={item.id} 
            className="brand-bar-container"
            style={{
              position: 'relative',
              width: '40px',
              height: `${barHeight}px`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: mounted ? 'rotateX(15deg) rotateY(-15deg)' : 'translateY(100px) opacity(0)',
              cursor: 'pointer',
              zIndex: 10 - index,
            }}
          >
            {/* Front Face */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: `linear-gradient(to top, color-mix(in srgb, ${color} 50%, transparent), ${color})`,
              transform: 'translateZ(20px)',
              border: `1px solid ${color}`,
              borderBottom: 'none',
              boxShadow: '0 0 15px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
              overflow: 'visible'
            }}>
              {/* Tooltip on hover (via CSS later) */}
              <div className="bar-tooltip" style={{
                position: 'absolute',
                top: '-50px',
                background: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                padding: '8px 12px',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                opacity: 0,
                transform: 'translateY(10px)',
                transition: 'all 0.3s ease',
                pointerEvents: 'none',
                zIndex: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.name}</div>
                <div>{formatCurrency(item.revenue)}</div>
              </div>
            </div>
            {/* Back Face */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: color,
              transform: 'translateZ(-20px) rotateY(180deg)',
              opacity: 0.5,
            }} />
            {/* Left Face */}
            <div style={{
              position: 'absolute',
              width: '40px',
              height: '100%',
              background: `linear-gradient(to top, color-mix(in srgb, ${color} 40%, transparent), color-mix(in srgb, ${color} 80%, transparent))`,
              transform: 'translateX(-20px) rotateY(-90deg)',
              borderLeft: `1px solid ${color}`,
            }} />
            {/* Right Face */}
            <div style={{
              position: 'absolute',
              width: '40px',
              height: '100%',
              background: `linear-gradient(to top, color-mix(in srgb, ${color} 25%, transparent), color-mix(in srgb, ${color} 60%, transparent))`,
              transform: 'translateX(20px) rotateY(90deg)',
              borderRight: `1px solid ${color}`,
            }} />
            {/* Top Face */}
            <div style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              background: `${color}`,
              transform: 'translateY(-20px) rotateX(90deg)',
              border: `1px solid ${color}`,
            }} />
            
            {/* Label at bottom */}
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              width: '100%',
              textAlign: 'center',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              transform: 'translateZ(20px)',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>
              {item.name.split('/')[0]}
            </div>
          </div>
        );
      })}

      <style dangerouslySetInnerHTML={{__html: `
        .brand-bar-container:hover {
          transform: rotateX(5deg) rotateY(-5deg) translateY(-10px) scale(1.05) !important;
        }
        .brand-bar-container:hover .bar-tooltip {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}} />
    </div>
  );
}

