'use client';

import styles from './spinner.module.css';

export default function Spinner({
    size = 20,
    color = '#4f46e5',
    speed = '0.8s',
    className = ''
}) {
    const spinnerStyle = {
        width: `${size}px`,
        height: `${size}px`,
        borderColor: color,
        borderTopColor: 'transparent',
        animationDuration: speed
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(31, 50, 90, 0.59)',
            zIndex: 9999
        }}>
            <div className={`${styles.spinner} ${className}`} style={spinnerStyle} />
        </div>
    );
}