import React from 'react';
import Progress from '../atoms/Progress';
import './LoadingOverlay.css';

const LoadingOverlay = ({ progress, message, stage }) => {
    // 只在真正需要時顯示載入畫面
    if (progress >= 100) return null;
    
    return (
        <div className="loading-overlay">
            <div className="loading-card">
                <div className="loading-brand">
                    <div className="pulse-logo">FRM</div>
                    <h2>Python Risk Lab</h2>
                </div>

                <Progress
                    value={progress}
                    label={stage === 'loading' ? '系統初始化' : '資料載入中'}
                    message={message}
                />

                <div className="loading-footer">
                    正在準備 Book 2 技術模組...
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
