import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status, text }) => {
    // status: 'loading' | 'ready' | 'error' | 'idle'

    const getIcon = () => {
        switch (status) {
            case 'loading': return '⚙️';
            case 'ready': return '⚡';
            case 'error': return '⚠️';
            default: return '❄️';
        }
    };

    return (
        <div className={`status-badge ${status}`} title={text}>
            <span className="status-icon">{getIcon()}</span>
            <span className="status-text">{text}</span>
        </div>
    );
};

export default React.memo(StatusBadge);
