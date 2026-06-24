import React from 'react';
import { formatCurrency } from '../lib/formatters';

interface BrandStat {
  id: string;
  name: string;
  revenue: number;
  count: number;
  color?: string;
}

export function Brand3DPointCloud({ data }: { data: BrandStat[] }) {
  if (!data || data.length === 0) return null;

  // We only show top 5-7 to not clutter the cloud
  const displayData = data.slice(0, 7);
  const maxRev = Math.max(...displayData.map(d => d.revenue));

  // Generate fixed random-looking positions for consistency
  const positions = displayData.map((item, i) => {
    const angle = (i / displayData.length) * Math.PI * 2;
    const radius = 120 + (i % 2 === 0 ? 40 : -20);
    const y = -60 + (i * 20 - 40); // Spread vertically
    
    // Scale the circle size based on revenue (min 90px, max 200px)
    const circleSize = maxRev > 0 ? 90 + (item.revenue / maxRev) * 110 : 90;

    return { angle, radius, y, item, circleSize };
  });

  return (
    <div style={{
      width: '100%',
      height: '450px',
      position: 'relative',
      perspective: '1200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'radial-gradient(circle at center, var(--surface-alt) 0%, var(--surface) 70%)',
      borderRadius: '8px'
    }}>
      <div className="cloud-container" style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        animation: 'cloudSpin 30s infinite linear'
      }}>
        {positions.map((pos, i) => {
          const { item, angle, radius, y, circleSize } = pos;
          const color = item.color || `hsl(${(i * 60) % 360}, 70%, 50%)`;
          
          return (
            <div key={item.id} style={{
              position: 'absolute',
              transformStyle: 'preserve-3d',
              transform: `translateY(${y}px) rotateY(${angle}rad) translateZ(${radius}px)`
            }}>
              {/* Un-rotate the initial angle */}
              <div style={{ transformStyle: 'preserve-3d', transform: `rotateY(-${angle}rad)` }}>
                {/* Counter-rotate the continuous spin to face camera */}
                <div style={{
                  animation: 'cloudCounterSpin 30s infinite linear',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  width: `${circleSize}px`,
                  height: `${circleSize}px`,
                  transform: 'translateX(-50%) translateY(-50%)', // center on point
                  position: 'relative'
                }}>
                  {/* Background Circle with opacity */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: color,
                    opacity: 0.5,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                    zIndex: -1
                  }} />
                  
                  {/* Outer Border */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: `2px solid ${color}`,
                    opacity: 0.8,
                    zIndex: -1
                  }} />
                  <span style={{ 
                    fontWeight: 800, 
                    fontSize: `${Math.max(12, circleSize * 0.12)}px`, 
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                  }}>
                    {item.name}
                  </span>
                  <span style={{ 
                    opacity: 0.9, 
                    fontSize: `${Math.max(10, circleSize * 0.09)}px`, 
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    marginTop: '4px'
                  }}>
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cloudSpin {
          0% { transform: rotateX(-5deg) rotateY(0deg); }
          100% { transform: rotateX(-5deg) rotateY(360deg); }
        }
        @keyframes cloudCounterSpin {
          0% { transform: translateX(-50%) translateY(-50%) rotateY(0deg) rotateX(5deg); }
          100% { transform: translateX(-50%) translateY(-50%) rotateY(-360deg) rotateX(5deg); }
        }
      `}} />
    </div>
  );
}
