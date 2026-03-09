import React from 'react';
import './Progress.css';

const Progress = ({ value, max = 100, label, message }) => {
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

    return (
        <div className="atom-progress">
            <div className="progress-header">
                {label && <span className="progress-label">{label}</span>}
                <span className="progress-value">{Math.round(percentage)}%</span>
            </div>
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {message && <p className="progress-message">{message}</p>}
        </div>
    );
};

export default React.memo(Progress);
