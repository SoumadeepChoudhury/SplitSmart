'use client';

import { useEffect, useState } from 'react';
import styles from './loading.module.css';

export default function LoadingScreen({ isLogout = false }) {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState(isLogout ? 'Logging Out...' : 'Initializing...');
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + Math.random() * 10;

                if (newProgress < 30) {
                    setLoadingText(isLogout ? "Logging Out..." : 'Initializing...');
                } else if (newProgress < 70) {
                    setLoadingText('Loading resources...');
                } else {
                    setLoadingText('Almost there...');
                }

                if (newProgress >= 100) {
                    clearInterval(interval);
                    setLoadingText('Ready!');
                    setTimeout(() => setIsVisible(false), 800);
                    return 100;
                }
                return newProgress;
            });
        }, 300);

        const timeout = setTimeout(() => {
            if (progress < 100) {
                clearInterval(interval);
                setProgress(100);
                setLoadingText('Ready!');
                setTimeout(() => setIsVisible(false), 800);
            }
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`${styles.loadingScreen} ${!isVisible ? styles.fadeOut : ''}`}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>{loadingText}</p>
            <div className={styles.progressContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}