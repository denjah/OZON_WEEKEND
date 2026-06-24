'use client';

import React from 'react';
import s from '@/styles/styleSwitcher.module.css';

/* ============================================================
   Style Definitions
   ============================================================ */

interface StyleDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
  fontPair: string;
}

const STYLES: StyleDef[] = [
  {
    id: '01',
    name: 'Midnight Command',
    emoji: '🌙',
    description: 'Inter + IBM Plex Mono · Indigo accent · Command center',
    gradient: 'linear-gradient(135deg, #5046E5, #06B6D4)',
    fontPair: 'Inter + IBM Plex Mono',
  },
  {
    id: '02',
    name: 'Aurora Luxe',
    emoji: '✨',
    description: 'Manrope + JetBrains Mono · Violet→Cyan · Glassmorphism',
    gradient: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
    fontPair: 'Manrope + JetBrains Mono',
  },
  {
    id: '03',
    name: 'Obsidian Noir',
    emoji: '🖤',
    description: 'Golos Text + IBM Plex Mono · Magenta + Gold · Editorial',
    gradient: 'linear-gradient(135deg, #FF3366, #FFD700)',
    fontPair: 'Golos Text + IBM Plex Mono',
  },
  {
    id: '04',
    name: 'Industrial Brutal',
    emoji: '⚙️',
    description: 'Inter + JetBrains Mono · Pure Data · High Contrast',
    gradient: 'linear-gradient(135deg, #E61919, #0A0A0A)',
    fontPair: 'Inter + JetBrains Mono',
  },
];

const LS_STYLE_KEY = 'ciq-style';
const LS_THEME_KEY = 'ciq-theme';
const LS_DEFAULT_KEY = 'ciq-default-style';

/* ============================================================
   Component
   ============================================================ */

export default function StyleSwitcher() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentStyle, setCurrentStyle] = React.useState('01');
  const [currentTheme, setCurrentTheme] = React.useState<'dark' | 'light'>('dark');
  const [defaultStyle, setDefaultStyle] = React.useState('01');

  // Initialize from localStorage
  React.useEffect(() => {
    const savedStyle = localStorage.getItem(LS_STYLE_KEY) || '01';
    const savedTheme = (localStorage.getItem(LS_THEME_KEY) || 'dark') as 'dark' | 'light';
    const savedDefault = localStorage.getItem(LS_DEFAULT_KEY) || '01';

    // eslint-disable-next-line
    setCurrentStyle(savedStyle);
    setCurrentTheme(savedTheme);
    setDefaultStyle(savedDefault);

    // Apply (in case FOUC script missed it)
    document.documentElement.setAttribute('data-style', savedStyle);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const applyStyle = (styleId: string) => {
    setCurrentStyle(styleId);
    document.documentElement.setAttribute('data-style', styleId);
    localStorage.setItem(LS_STYLE_KEY, styleId);
  };

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(LS_THEME_KEY, newTheme);
  };

  const setAsDefault = (styleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDefaultStyle(styleId);
    localStorage.setItem(LS_DEFAULT_KEY, styleId);
  };

  const handleCardClick = (styleId: string) => {
    if (styleId !== currentStyle) {
      applyStyle(styleId);
    }
  };

  // Close on Escape
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      {/* Collapsed Pill */}
      <button
        className={s.pill}
        onClick={() => setIsOpen(!isOpen)}
        id="style-switcher-pill"
        aria-label="Открыть панель стилей"
        aria-expanded={isOpen}
      >
        <span className={s.pillIcon}>🎨</span>
        СТИЛЬ
        <span className={s.pillDot} />
      </button>

      {/* Backdrop */}
      <div
        className={`${s.backdrop} ${isOpen ? s.backdropActive : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Dropdown Panel */}
      <div
        className={`${s.panel} ${isOpen ? s.panelOpen : ''}`}
        id="style-switcher-panel"
        role="dialog"
        aria-label="Переключатель стилей"
      >
        {/* Header */}
        <div className={s.panelHeader}>
          <div className={s.panelTitle}>
            <span className={s.panelTitleIcon}>🎨</span>
            СТИЛЬ
          </div>
          <button
            className={s.panelClose}
            onClick={() => setIsOpen(false)}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        {/* Style Cards */}
        <div className={s.cardsList}>
          {STYLES.map((style) => {
            const isActive = currentStyle === style.id;
            const isDefault = defaultStyle === style.id;

            return (
              <div
                key={style.id}
                className={`${s.card} ${isActive ? s.cardActive : ''}`}
                onClick={() => handleCardClick(style.id)}
                id={`style-card-${style.id}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCardClick(style.id)}
              >
                {/* Gradient strip */}
                <div
                  className={s.cardGradient}
                  style={{ background: style.gradient }}
                />

                {/* Header */}
                <div className={s.cardHeader}>
                  <div className={s.cardName}>
                    <span className={s.cardNumber}>{style.id}</span>
                    <span className={s.cardLabel}>{style.name}</span>
                    <span className={s.cardEmoji}>{style.emoji}</span>
                  </div>
                  {isActive && <div className={s.activeDot} />}
                </div>

                {/* Description */}
                <div className={s.cardDesc}>{style.description}</div>

                {/* Actions */}
                <div className={s.cardActions}>
                  {/* Theme toggle */}
                  <div
                    className={`${s.themeToggle} ${currentTheme === 'light' ? s.themeToggleLight : ''}`}
                    onClick={toggleTheme}
                    role="switch"
                    aria-checked={currentTheme === 'light'}
                    aria-label="Переключить тему"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && toggleTheme(e as unknown as React.MouseEvent)}
                  >
                    <div className={s.themeToggleThumb}>
                      {currentTheme === 'dark' ? '🌙' : '☀️'}
                    </div>
                  </div>
                  <span className={s.themeToggleLabel}>
                    {currentTheme === 'dark' ? 'Dark' : 'Light'}
                  </span>

                  {/* Star / Default button */}
                  <button
                    className={`${s.starBtn} ${isDefault ? s.starBtnActive : ''}`}
                    onClick={(e) => setAsDefault(style.id, e)}
                    aria-label={isDefault ? 'Стиль по умолчанию' : 'Сделать по умолчанию'}
                    title={isDefault ? 'По умолчанию' : 'Сделать по умолчанию'}
                  >
                    {isDefault ? '★' : '☆'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

