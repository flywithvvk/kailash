import React from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'medium',
    icon: IconComponent,
    iconPosition = 'left',
    disabled = false,
    loading = false,
    onClick,
    className = '',
    ...props 
}) => {
    const btnClass = `btn btn-${variant} btn-${size} ${disabled || loading ? 'disabled' : ''} ${className}`;
    
    return (
        <button 
            className={btnClass}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <span className="btn-loading">
                    <Loader2 size={16} strokeWidth={2} className="spin" />
                </span>
            )}
            {!loading && IconComponent && iconPosition === 'left' && (
                <IconComponent size={16} strokeWidth={2} />
            )}
            <span>{children}</span>
            {!loading && IconComponent && iconPosition === 'right' && (
                <IconComponent size={16} strokeWidth={2} />
            )}
        </button>
    );
};

export default Button;
export { Button };
