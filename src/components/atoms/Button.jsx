import React from 'react';
import './Button.css';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    icon: Icon,
    className = ''
}) => {
    return (
        <button
            className={`atom-btn ${variant} ${size} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {Icon && <Icon size={size === 'sm' ? 14 : 18} className="btn-icon" />}
            <span className="btn-text">{children}</span>
        </button>
    );
};

export default React.memo(Button);
