'use client';
import { useState, useRef } from 'react';
import './auth.css';
import { auth, db } from '@/firebase';
import { useUserContext } from '@/context/UserContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import Spinner from '@/utils/spinner/spinner';
import { get, ref, set } from 'firebase/database';
// import USERDATA from '@/utils/userData';

export default function Auth() {
    const [isSignIn, setIsSignIn] = useState(false);
    const { setUser, setCurrentTab, loading, setLoading } = useUserContext();

    const [error, setError] = useState(null);

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    function toggleToSignIn_Up() {
        setIsSignIn(!isSignIn);
    }

    function handleSignInUp() {
        setLoading(true);
        const name = !isSignIn ? nameRef.current.value : null;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        isSignIn ? signInwithEmail(email, password) : signUpWithEmail(name, email, password);

    }

    const signUpWithEmail = (name, email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user);
                setCurrentTab('home');
                setLoading(false);

                //add to the database.
                get(ref(db, `users/${userCredential.user.uid}`)).then((snapshot) => {
                    if (!snapshot.exists()) {
                        set(ref(db, 'users/' + userCredential.user.uid), {
                            name: name,
                            email: email,
                            photoURL: '',
                            groups: [],
                        }).then(() => {
                            //adding to local data set.
                            // USERDATA.name = name;
                            // USERDATA.email = email;
                            // USERDATA.photoURL = '';
                            console.log("Data saved successfully");
                        }).catch((error) => {
                            console.error("Error saving data: ", error);
                        });
                    }
                });
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
                alert(error.message.replace("Firebase: ", ""));
            });
    }

    const continueWithGoogle = () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                setUser(result.user);
                setCurrentTab('home');
                setLoading(false);

                //add to database
                get(ref(db, `users/${result.user.uid}`)).then((snapshot) => {
                    if (!snapshot.exists()) {
                        set(ref(db, 'users/' + result.user.uid), {
                            name: result.user.displayName,
                            email: result.user.email,
                            photoURL: result.user.photoURL,
                            groups: [],
                        }).then(() => {
                            //adding to local dataset
                            // USERDATA.name = result.user.displayName;
                            // USERDATA.email = result.user.email;
                            // USERDATA.photoURL = result.user.photoURL;
                            console.log("Data saved successfully");
                        }).catch((error) => {
                            console.error("Error saving data: ", error);
                        });
                    }
                });

            }).catch((error) => {
                setError(error.message);
                alert(error.message.replace("Firebase: ", ""));
                setLoading(false);
            });
    }

    const signInwithEmail = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user);
                setLoading(false)
                setCurrentTab('home');
                //adding to local data
                // USERDATA.name = userCredential.user.displayName;
                // USERDATA.email = userCredential.user.email;
                // USERDATA.photoURL = userCredential.user.photoURL;
            })
            .catch((error) => {
                setError(error.message);
                alert(error.message.replace("Firebase: ", ""));
                setLoading(false);
            });
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <img src="/icon512_maskable.png" alt="App Logo" className="logo" />

                <h1 style={{ color: 'black' }}>Split your expenses smartly.</h1>
                <p>We suggest using the <strong>email address that you use at work</strong>.</p>

                {!isSignIn ? <input type="name" placeholder="Enter your full name..." className="email-input" ref={nameRef} /> : null}
                <input type="email" placeholder="Enter your email..." className={(error && error?.includes('email') ? "error " : "") + "email-input"} ref={emailRef} onChange={() => setError(null)} required />
                <input type="password" placeholder="Enter your password..." className={(error && error?.includes('password') ? "error " : "") + "email-input"} ref={passwordRef} required />

                <button className="continue-btn" onClick={handleSignInUp}>Sign {!isSignIn ? "Up" : "In"}</button>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button className="provider-btn" onClick={continueWithGoogle}>
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
            {loading ? <Spinner size={40} /> : null}
        </div>
    );
}
