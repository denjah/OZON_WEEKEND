'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/layout.module.css';
import { ScrapedProductData } from '../model/types';

interface ReviewsAnalysisSectionProps {
  reviewsData?: ScrapedProductData[];
}

export function ReviewsAnalysisSection({ reviewsData = [] }: ReviewsAnalysisSectionProps) {
  const [insights, setInsights] = useState<{pros: { title: string, description: string }[], cons: { title: string, description: string }[]} | null>(null);
  
  useEffect(() => {
    fetch('/api/ozon/insights')
      .then(res => res.json())
      .then(data => {
        // Берем либо инсайты для "Общий рынок (Все товары)", либо первый доступный ключ
        const marketInsights = data["Общий рынок (Все товары)"] || Object.values(data)[0];
        if (marketInsights) {
          setInsights(marketInsights as {pros: { title: string, description: string }[], cons: { title: string, description: string }[]});
        }
      })
      .catch(console.error);
  }, []);

  // Уплощаем и дедублицируем отзывы
  const uniqueReviewsMap = new Map();
  reviewsData.forEach(p => {
    p.reviews?.items?.forEach(r => {
      // Ключ уникальности: автор + текст
      const key = `${r.author}_${r.text.substring(0, 50)}`;
      if (!uniqueReviewsMap.has(key)) {
        uniqueReviewsMap.set(key, { 
          ...r, 
          productName: p.productName, 
          brand: p.brand, 
          productUrl: p.url,
          mainImages: p.mainImages || []
        });
      }
    });
  });
  const allReviews = Array.from(uniqueReviewsMap.values());
  
  // Дедублицируем вопросы
  const uniqueQuestionsMap = new Map();
  reviewsData.forEach(p => {
    p.questions?.items?.forEach(q => {
      const key = q.question.substring(0, 100);
      if (!uniqueQuestionsMap.has(key)) {
        uniqueQuestionsMap.set(key, { 
          ...q, 
          productName: p.productName, 
          brand: p.brand, 
          productUrl: p.url,
          mainImages: p.mainImages || []
        });
      }
    });
  });
  const allQuestions = Array.from(uniqueQuestionsMap.values());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Колонка: Отзывы */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '800px', overflowY: 'auto', paddingRight: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
            Отзывы ({allReviews.length})
          </h3>
          {allReviews.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }}>Отзывов пока нет...</div>
          ) : (
            allReviews.map((r, idx) => (
              <div key={idx} className={styles.statCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {r.mainImages && r.mainImages.length > 0 && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.mainImages[0]} alt="product" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                      )}
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.brand} - {r.productName}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.author || 'Аноним'} • {r.date || 'Без даты'}</span>
                  </div>
                  <span style={{ color: r.rating >= 4 ? '#4ADE80' : r.rating <= 2 ? '#F87171' : '#FBBF24', fontWeight: 600 }}>
                    ★ {r.rating.toFixed(1)}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {r.text || 'Нет текста...'}
                </div>
                {r.photos && r.photos.length > 0 && (
                   <div style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                     {r.photos.map((img: string, i: number) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={img} alt="review" style={{ height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                     ))}
                   </div>
                )}
              </div>
            ))
          )}
        </div>
        {/* Колонка: Вопросы */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '800px', overflowY: 'auto', paddingRight: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
            Вопросы ({allQuestions.length})
          </h3>
          {allQuestions.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }}>Вопросов пока нет...</div>
          ) : (
            allQuestions.map((q, idx) => (
              <div key={idx} className={styles.statCard} style={{ borderColor: 'rgba(6, 182, 212, 0.2)' }}>
                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {q.mainImages && q.mainImages.length > 0 && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={q.mainImages[0]} alt="product" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                  )}
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{q.brand} - {q.productName}</span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Вопрос:</strong> {q.question}
                </div>
                {q.answer && (
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', padding: '8px', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '6px', borderLeft: '2px solid #06B6D4' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Ответ продавца:</strong> {q.answer}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {/* Колонка: Инсайты */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '800px', overflowY: 'auto', paddingRight: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
            AI-Инсайты
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className={styles.statCard} style={{ background: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
              <div className={styles.statLabel} style={{ color: '#4ADE80' }}>Главные преимущества (Плюсы)</div>
              <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                {insights ? insights.pros.map((pro, i) => (
                  <li key={i}><strong style={{ color: 'var(--text-primary)' }}>{pro.title}:</strong> {pro.description}</li>
                )) : (
                  <li>Загрузка инсайтов...</li>
                )}
              </ul>
            </div>
            <div className={styles.statCard} style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <div className={styles.statLabel} style={{ color: '#F87171' }}>Ключевые боли (Минусы)</div>
              <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                {insights ? insights.cons.map((con, i) => (
                  <li key={i}><strong style={{ color: 'var(--text-primary)' }}>{con.title}:</strong> {con.description}</li>
                )) : (
                  <li>Загрузка инсайтов...</li>
                )}
              </ul>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
            * Инсайты сгенерированы AI на основе реальных спарсенных отзывов.
          </div>
        </div>
      </div>
      
    </div>
  );
}
