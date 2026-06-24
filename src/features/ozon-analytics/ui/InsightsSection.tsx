import React from 'react';
import styles from '@/styles/ozon.module.css';
import { InsightItem } from '../model/types';
import { IconSparkles } from '@/components/icons';

interface Props {
  insights: InsightItem[];
}

export function InsightsSection({ insights }: Props) {
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return '#10B981'; // green
      case 'warning': return '#F59E0B'; // yellow
      case 'risk': return '#EF4444'; // red
      case 'success': return '#3B82F6'; // blue
      default: return '#8B5CF6'; // purple
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return '💡';
      case 'warning': return '⚠️';
      case 'risk': return '🚨';
      case 'success': return '🏆';
      default: return '✨';
    }
  };

  const sortedInsights = [...insights].sort((a, b) => b.score - a.score);

  return (
    <div className={styles.sectionCard} style={{ padding: '24px', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span style={{ color: '#8B5CF6', display: 'flex' }}><IconSparkles size={24} /></span>
        <h3 style={{ margin: 0, fontSize: '18px' }}>AI-Инсайты</h3>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {sortedInsights.map(insight => (
          <div 
            key={insight.id} 
            style={{ 
              padding: '16px', 
              borderRadius: '8px', 
              border: `1px solid ${getInsightColor(insight.type)}40`,
              backgroundColor: `${getInsightColor(insight.type)}10`,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>{getInsightIcon(insight.type)}</span>
              <span style={{ fontWeight: 'bold', color: getInsightColor(insight.type) }}>{insight.title}</span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {insight.description}
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                Скор: {insight.score}/10
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
