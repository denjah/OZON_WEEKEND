'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { IconAlertTriangle } from '@/components/icons';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '24px',
          background: 'rgba(255, 59, 48, 0.1)',
          border: '1px solid rgba(255, 59, 48, 0.2)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FF3B30',
          height: '100%',
          width: '100%',
          minHeight: '120px'
        }}>
          <IconAlertTriangle size={32} />
          <h3 style={{ marginTop: '12px', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Что-то пошло не так</h3>
          <p style={{ fontSize: '12px', opacity: 0.8, textAlign: 'center' }}>
            {this.state.error?.message || 'Ошибка рендеринга компонента'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
