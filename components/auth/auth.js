'use client';
import { useState } from 'react';
import './auth.css';

export default function Auth() {
    const [isSignIn, setIsSignIn] = useState(false);

    function toggleToSignIn_Up() {
        setIsSignIn(!isSignIn);
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <img src="/icon512_maskable.png" alt="App Logo" className="logo" />

                <h1 style={{ color: 'black' }}>Split your expenses smartly.</h1>
                <p>We suggest using the <strong>email address that you use at work</strong>.</p>

                {!isSignIn ? <input type="name" placeholder="Enter your full name..." className="email-input" /> : null}
                <input type="email" placeholder="Enter your email..." className="email-input" />
                <input type="password" placeholder="Enter your password..." className="email-input" />

                <button className="continue-btn">Sign {!isSignIn ? "Up" : "In"}</button>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button className="provider-btn">
                    <img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" alt="Google" />
                    Continue with Google
                </button>

                <p className="login-link">
                    {isSignIn ? "Don't have account?" : "Already using SplitSmart?"} <a onClick={() => toggleToSignIn_Up()} >Sign {isSignIn ? "up" : "in"}</a>
                </p>

                <footer className="footer-links">
                    <a>🧾Privacy & terms</a>
                    <a href="mailto:ahensinitiative@gmail.com">📞Contact us</a>
                    <a>🌍 Change region</a>
                </footer>
            </div>
        </div>
    );
}
