'use client';

import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export function LoadingSkeleton({
  width = '100%',
  height = '100%',
  borderRadius = '8px',
  className = ''
}: SkeletonProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
          backgroundSize: '400% 100%',
          animation: 'shimmer 2s infinite linear',
        }}
      />
    </>
  );
}
