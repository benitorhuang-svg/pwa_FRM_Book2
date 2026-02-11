import { useEffect, useState } from 'react';
import './LoadingProgress.css';

/**
 * 載入進度指示器組件
 * 用於顯示 Pyodide 和其他資源的載入進度
 */
export default function LoadingProgress({ stage, progress, error }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getStageText = () => {
    switch (stage) {
      case 'loading':
        return '正在初始化 Python 環境';
      case 'downloading':
        return '正在下載 Python 套件';
      case 'complete':
        return '載入完成！';
      case 'error':
        return '載入失敗';
      default:
        return '準備中';
    }
  };

  const getStageIcon = () => {
    switch (stage) {
      case 'loading':
        return '⚙️';
      case 'downloading':
        return '📦';
      case 'complete':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '🚀';
    }
  };

  if (stage === 'complete') {
    return null; // 載入完成後隱藏
  }

  return (
    <div className="loading-progress">
      <div className="loading-progress-content">
        <div className="loading-progress-icon">
          {getStageIcon()}
        </div>

        <div className="loading-progress-text">
          <h3>{getStageText()}{dots}</h3>
          {error && (
            <p className="loading-progress-error">
              錯誤：{error.message}
            </p>
          )}
        </div>

        {stage === 'downloading' && (
          <div className="loading-progress-bar">
            <div
              className="loading-progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {stage === 'downloading' && (
          <div className="loading-progress-percentage">
            {Math.round(progress)}%
          </div>
        )}

        {stage === 'loading' && (
          <div className="loading-spinner" />
        )}
      </div>
    </div>
  );
}
