import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    this.logError(error, errorInfo);
  }

  logError(error: Error, errorInfo: ErrorInfo) {
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent
      };

      console.error('[Error Boundary]', errorLog);

      if (typeof window !== 'undefined' && window.localStorage) {
        const errors = localStorage.getItem('error_logs');
        const errorList = errors ? JSON.parse(errors) : [];
        
        errorList.push(errorLog);
        
        if (errorList.length > 50) {
          errorList.shift();
        }
        
        localStorage.setItem('error_logs', JSON.stringify(errorList));
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>😔</h1>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: '700' }}>
              Oops! Something went wrong
            </h2>
            <p style={{ fontSize: '16px', marginBottom: '30px', opacity: 0.9 }}>
              TileDrop encountered an unexpected error. Don't worry, your game progress is saved!
            </p>
            
            {this.state.error && (
              <details style={{
                textAlign: 'left',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '20px',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '10px', fontWeight: '600' }}>
                  Error Details
                </summary>
                <p style={{ margin: '5px 0' }}>{this.state.error.message}</p>
                {this.state.error.stack && (
                  <pre style={{ 
                    fontSize: '10px', 
                    overflow: 'auto', 
                    maxHeight: '200px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {this.state.error.stack}
                  </pre>
                )}
              </details>
            )}

            <button
              onClick={this.handleReset}
              style={{
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '0 auto',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.2)';
              }}
            >
              <RefreshCw size={20} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function getErrorLogs(): any[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const errors = localStorage.getItem('error_logs');
      return errors ? JSON.parse(errors) : [];
    }
    return [];
  } catch (error) {
    console.error('Failed to get error logs:', error);
    return [];
  }
}

export function clearErrorLogs(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('error_logs');
    }
  } catch (error) {
    console.error('Failed to clear error logs:', error);
  }
}
