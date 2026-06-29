import React, { useState } from 'react';
import { SEO_MOCK_PRODUCTS, SEO_ORDER } from './seoMockData';
import styles from './SeoAuditSection.module.css';
import { IconTarget, IconRefresh } from '@/components/icons';

type ViewState = 'settings' | 'dashboard' | 'detail';

type TrackedItem = {
  id: number;
  prodKey: string;
  query: string;
  action: string;
  added: string;
  clicksAdd: number | string;
  clicksNow: number | string;
  ctrAdd: string;
  ctrNow: string;
  convAdd: string;
  convNow: string;
  posAdd: number;
  posNow: number;
};

export function SeoAuditSection() {
  const [view, setView] = useState<ViewState>('settings');
  const [isAuditing, setIsAuditing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  // Tracked requests state
  const [tracked, setTracked] = useState<TrackedItem[]>([]);
  const [trackerUid, setTrackerUid] = useState(1);
  const [spoilerOpen, setSpoilerOpen] = useState(false);
  const [trackFilter, setTrackFilter] = useState('all');

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setHasData(true);
      setView('dashboard');
    }, 1500); // simulate API call
  };

  const verClass = (v: string) => {
    if (v.includes('Ремонт')) return styles.vRed;
    if (v.includes('видимость')) return styles.vAmber;
    if (v.includes('ок')) return styles.vBlue;
    return styles.vGreen;
  };

  const verShort = (v: string) => v.replace('SEO ок — цена/фото', 'SEO ок · цена/фото');
  
  const covColor = (c: number) => c < 50 ? '#e23b3b' : c < 75 ? '#e69a17' : '#1f9d5b';

  const handleAddTrack = (key: string, idx: number) => {
    // @ts-ignore
    const p = SEO_MOCK_PRODUCTS[key];
    const x = p.hyp[idx];
    const m = p.m;
    
    setTracked(prev => [
      ...prev,
      {
        id: trackerUid,
        prodKey: key,
        query: x.tool,
        action: x.a,
        added: new Date().toLocaleDateString('ru-RU'),
        clicksAdd: m.clicks, clicksNow: m.clicks,
        ctrAdd: m.ctr, ctrNow: m.ctr,
        convAdd: m.conv, convNow: m.conv,
        posAdd: m.pos, posNow: m.pos
      }
    ]);
    setTrackerUid(u => u + 1);
    setSpoilerOpen(true);
    alert(`Запрос "${x.tool}" добавлен в отслеживание`);
  };

  const handleRemoveTrack = (id: number) => {
    setTracked(prev => prev.filter(t => t.id !== id));
  };

  const renderDashboard = () => {
    const kpiRed = SEO_ORDER.filter(k => (SEO_MOCK_PRODUCTS as any)[k].verdict.includes('Ремонт')).length;
    const kpiAmber = SEO_ORDER.filter(k => (SEO_MOCK_PRODUCTS as any)[k].verdict.includes('видимость')).length;
    const kpiBlue = SEO_ORDER.filter(k => (SEO_MOCK_PRODUCTS as any)[k].verdict.includes('ок')).length;
    const kpiGreen = SEO_ORDER.filter(k => (SEO_MOCK_PRODUCTS as any)[k].verdict === 'В норме').length;

    const filteredTrackedKeys = SEO_ORDER.filter(k => 
      tracked.some(t => t.prodKey === k) && (trackFilter === 'all' || trackFilter === k)
    );

    return (
      <div>
        <div className={styles.kpis}>
          <div className={`${styles.kpi} ${styles.red}`}><div className={styles.n}>{kpiRed}</div><div className={styles.l}>Нужен ремонт SEO</div></div>
          <div className={`${styles.kpi} ${styles.amber}`}><div className={styles.n}>{kpiAmber}</div><div className={styles.l}>SEO + видимость</div></div>
          <div className={`${styles.kpi} ${styles.blue}`}><div className={styles.n}>{kpiBlue}</div><div className={styles.l}>SEO ок — чинить цену/фото</div></div>
          <div className={`${styles.kpi} ${styles.green}`}><div className={styles.n}>{kpiGreen}</div><div className={styles.l}>В норме</div></div>
        </div>

        <div className={`${styles.spoiler} ${spoilerOpen ? styles.open : ''}`}>
          <div className={styles.spHead} onClick={() => setSpoilerOpen(!spoilerOpen)}>
            <span><span className={styles.caret}>▸</span>Отслеживаемые карточки</span>
            <span className={styles.cnt}>{tracked.length ? `${tracked.length} запр.` : 'пусто'}</span>
          </div>
          <div className={styles.spBody}>
            <div className={styles.selrow}>
              <label style={{ fontSize: '13px' }}>Товар:</label>
              <select value={trackFilter} onChange={e => setTrackFilter(e.target.value)}>
                <option value="all">Все товары</option>
                {SEO_ORDER.filter(k => tracked.some(t => t.prodKey === k)).map(k => (
                  <option key={k} value={k}>{(SEO_MOCK_PRODUCTS as any)[k].title}</option>
                ))}
              </select>
            </div>
            {filteredTrackedKeys.length === 0 ? (
              <div className={styles.empty}>Пока ничего не отслеживается. Добавляйте запросы из гипотез в детализации карточки.</div>
            ) : (
              filteredTrackedKeys.map(k => {
                const p = (SEO_MOCK_PRODUCTS as any)[k];
                const rows = tracked.filter(t => t.prodKey === k);
                return (
                  <div key={k} className={styles.tsub}>
                    <div className={styles.tsubH}>
                      <span>{p.title}<span className={styles.art}>{p.art}</span></span>
                      <span style={{ fontSize: '11.5px', opacity: 0.7 }}>{rows.length} запр.</span>
                    </div>
                    <div className={styles.twrap}>
                      <table className={`${styles.table} ${styles.trk}`}>
                        <thead>
                          <tr>
                            <th>Отслеживаемый запрос</th><th>Действие</th><th>Добавлен</th>
                            <th>Переходы</th><th>CTR</th><th>Конверсия</th><th>Позиция</th><th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map(t => (
                            <tr key={t.id}>
                              <td className={styles.q}>{t.query}</td>
                              <td><span className={styles.chip}>{t.action}</span></td>
                              <td>{t.added}</td>
                              <td>{t.clicksAdd} <span className={styles.pairnow}>→ <b>{t.clicksNow}</b></span></td>
                              <td>{t.ctrAdd} <span className={styles.pairnow}>→ <b>{t.ctrNow}</b></span></td>
                              <td>{t.convAdd} <span className={styles.pairnow}>→ <b>{t.convNow}</b></span></td>
                              <td>{t.posAdd} <span className={styles.pairnow}>→ <b>{t.posNow}</b></span></td>
                              <td><button className={styles.delbtn} onClick={() => handleRemoveTrack(t.id)}>Удалить</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.phead}>Все карточки <small>по приоритету, хуже — выше</small></div>
          <div className={styles.twrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Товар</th><th>Покрытие ключей</th><th>Разрывы</th>
                  <th>Показы (динамика)</th><th>CTR</th><th>Конв. в корзину</th><th>CPC</th><th>Вердикт</th>
                </tr>
              </thead>
              <tbody>
                {SEO_ORDER.map(k => {
                  const p = (SEO_MOCK_PRODUCTS as any)[k];
                  const m = p.m;
                  const impd = m.impd > 0 ? <span className={styles.up}>{m.imp} ↑{m.impd}%</span> : m.impd < 0 ? <span className={styles.down}>{m.imp} ↓{-m.impd}%</span> : `${m.imp} 0%`;
                  return (
                    <tr key={k}>
                      <td className={styles.nameCol}>{p.title}<small>{p.art}</small></td>
                      <td><span className={styles.bar}><i style={{ width: `${m.cov}%`, background: covColor(m.cov) }}></i></span>{m.cov}%</td>
                      <td>{m.gaps}</td><td>{impd}</td><td>{m.ctr}</td><td>{m.conv}</td><td>{m.cpc}</td>
                      <td><button className={`${styles.pill} ${verClass(p.verdict)}`} onClick={() => { setSelectedProduct(k); setView('detail'); }}>{verShort(p.verdict)}</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    if (!selectedProduct) return null;
    const p = (SEO_MOCK_PRODUCTS as any)[selectedProduct];

    return (
      <div>
        <span className={styles.back} onClick={() => setView('dashboard')}>← Назад к дашборду</span>
        <h2 style={{ fontSize: '21px', margin: '0 0 2px' }}>{p.title} <span className={`${styles.pill} ${verClass(p.verdict)}`} style={{ cursor: 'default' }}>{verShort(p.verdict)}</span></h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>{p.art} · прогон {new Date().toLocaleDateString('ru-RU')}</div>
        
        <div className={styles.evgrid}>
          {p.evidence.map((e: string[], i: number) => (
            <div key={i} className={styles.ev}><div className={styles.l}>{e[0]}</div><div className={styles.v}>{e[1]}</div></div>
          ))}
        </div>

        {p.fix && (
          <div className={styles.fix}>
            <div className={styles.lbl}>Что починить (вне SEO)</div>
            <div className={styles.txt}>{p.fix}</div>
          </div>
        )}

        <div className={styles.phead} style={{ padding: '0 0 10px' }}>Гипотезы ремонта · HADI — 5 шт., по убыванию мэтч × влияние</div>
        <div className={styles.hwrap}>
          <table className={`${styles.table} ${styles.hadi}`}>
            <thead>
              <tr>
                <th>#</th><th>Гипотеза (H)</th><th>Действие (A)</th><th>Данные — что считаем (D)</th>
                <th>Чем мерить (запрос)</th><th>Ориентир</th><th>Горизонт</th><th></th>
              </tr>
            </thead>
            <tbody>
              {p.hyp.map((x: any, i: number) => {
                const on = tracked.some(t => t.prodKey === selectedProduct && t.query === x.tool);
                return (
                  <tr key={i}>
                    <td className={styles.rk}>{i + 1}</td>
                    <td>{x.h}</td>
                    <td><span className={styles.chip}>{x.a}</span></td>
                    <td>{x.d}</td>
                    <td className={styles.tool}>{x.tool}</td>
                    <td>{x.aim}</td>
                    <td>{x.hz}</td>
                    <td>
                      <button 
                        className={`${styles.trackbtn} ${on ? styles.done : ''}`} 
                        disabled={on} 
                        onClick={() => handleAddTrack(selectedProduct, i)}
                      >
                        {on ? '✓ отслеживается' : '+ отслеживать'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={styles.hint}>Кнопка «отслеживать» переносит запрос, действие и снимок метрик в блок «Отслеживаемые карточки» — в подраздел этого товара.</div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div>
        <div className={styles.settingsBox}>
          <h3>Справочник ниш (Настройки классификации)</h3>
          <p>Вставьте содержимое Справочника ниш Ozon (в формате JSON или YAML). Данный справочник определяет правила распределения товаров по кластерам, стоп-слова и сиды для каждой ниши.</p>
          <textarea 
            className={styles.textarea} 
            placeholder='{"tennis": {"type": "теннисный стол", "seeds": ["теннисный стол", "стол для тенниса"]}}'
            defaultValue='{"tennis_indoor": {"type": "теннисный стол", "seeds": ["теннисный стол для дома", "теннисный стол для помещений"]}, "combo": {"type": "игровой стол", "seeds": ["игровой стол", "настольный футбол"]}}'
          />
        </div>

        <div className={styles.settingsBox}>
          <h3>Настройки загрузки частотностей (для парсера)</h3>
          <p>
            Для MVP (Этап 1) используется парсинг CSV-выгрузки частотностей. <br/>
            <strong>Формат CSV:</strong> файл должен содержать заголовки. Обязательные столбцы: <br/>
            <code style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 4px', borderRadius: '4px' }}>Ключевое слово</code> (или <code>Запрос</code>, <code>Keyword</code>) и <code style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 4px', borderRadius: '4px' }}>Частотность</code> (или <code>Показы</code>, <code>Frequency</code>). <br/>
            <em>Пример: "теннисный стол", 15400</em>
          </p>
          <button className={styles.runAuditBtn} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'inherit' }}>
            <IconRefresh size={14} /> Выбрать CSV файл
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className={styles.headerActions}>
        <div className={styles.tabs}>
          <button className={`${styles.tabBtn} ${view === 'settings' ? styles.active : ''}`} onClick={() => setView('settings')}>Настройки</button>
          {hasData && (
            <button className={`${styles.tabBtn} ${view === 'dashboard' ? styles.active : ''}`} onClick={() => setView('dashboard')}>Результаты аудита</button>
          )}
        </div>
        <button 
          className={styles.runAuditBtn} 
          onClick={handleRunAudit}
          disabled={isAuditing}
          style={{ marginLeft: 'auto' }}
        >
          {isAuditing ? <div className="spinner" style={{ width: 14, height: 14, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <IconTarget size={14} />}
          {isAuditing ? 'Анализ...' : 'Запустить аудит (MVP)'}
        </button>
      </div>

      {view === 'settings' && renderSettings()}
      {view === 'dashboard' && renderDashboard()}
      {view === 'detail' && renderDetail()}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
