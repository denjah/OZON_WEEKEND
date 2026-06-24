'use client';

import { useLayoutEffect } from 'react';
import fx from '@/styles/themeEffects.module.css';

/**
 * ThemeEffects — Background effects layer for style themes.
 * Renders CSS-only effects: mesh gradient orbs, particles, noise overlay.
 * All effects are pointer-events: none, z-index: 0.
 * Visibility is controlled by data-style attribute on <html> via CSS.
 * 
 * Also handles FOUC prevention via useLayoutEffect (synchronous, before paint).
 */
export default function ThemeEffects() {
  /* FOUC Prevention: read localStorage and apply theme before first paint */
  useLayoutEffect(() => {
    try {
      const style = localStorage.getItem('ciq-style') || localStorage.getItem('ciq-default-style') || '01';
      const theme = localStorage.getItem('ciq-theme') || 'dark';
      document.documentElement.setAttribute('data-style', style);
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) { /* localStorage недоступен */ }
  }, []);

  return (
    <div className={fx.effectsLayer} aria-hidden="true">
      {/* Aurora Luxe — Mesh Gradient Orbs */}
      <div className={fx.meshGradient}>
        <div className={fx.meshOrb1} />
        <div className={fx.meshOrb2} />
        <div className={fx.meshOrb3} />
      </div>

      {/* Aurora Luxe — Floating Particles */}
      <div className={fx.particles}>
        <div className={fx.particle} />
        <div className={fx.particle} />
        <div className={fx.particle} />
        <div className={fx.particle} />
        <div className={fx.particle} />
        <div className={fx.particle} />
        <div className={fx.particle} />
        <div className={fx.particle} />
      </div>

      {/* Obsidian Noir — Noise Grain Overlay */}
      <div className={fx.noiseOverlay} />

      {/* Obsidian Noir — Top Accent Line */}
      <div className={fx.accentLine} />
    </div>
  );
}

