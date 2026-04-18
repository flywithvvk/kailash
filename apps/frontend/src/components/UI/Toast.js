import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ type = 'info', message, onClose }) => {
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info
    };

    const Icon = icons[type];

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, type === 'error' ? 6000 : 4000);

        return () => clearTimeout(timer);
    }, [type, onClose]);

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-icon">
                <Icon size={20} strokeWidth={1.5} />
            </div>
            <div className="toast-content">
                <p className="toast-message">{message}</p>
            </div>
            <button className="toast-close" onClick={onClose}>
                <X size={16} strokeWidth={2} />
            </button>
        </div>
    );
};

export default Toast;
