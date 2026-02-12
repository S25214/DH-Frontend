import { useEffect, useState } from 'react';

/**
 * Toast notification component
 */
export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = type === 'error' ? 'bg-danger' : 'bg-success';
    const borderColor = type === 'error' ? 'border-danger' : 'border-success';

    return (
        <div
            className={`fixed bottom-5 right-5 z-50 px-6 py-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'
                }`}
            style={{
                backgroundColor: 'var(--bg-panel)',
                borderColor: `var(--${type === 'error' ? 'danger' : 'success'})`,
                borderLeft: `4px solid var(--${type === 'error' ? 'danger' : 'success'})`,
            }}
        >
            <p className="text-text-main font-medium">{message}</p>
        </div>
    );
};

/**
 * Toast container to manage multiple toasts
 */
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const ToastContainer = () => (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );

    return { showToast, ToastContainer };
};

export default Toast;
