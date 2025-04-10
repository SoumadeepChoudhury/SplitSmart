'use client';
import { useState } from 'react';
import Head from 'next/head';
import './profile.css';

export default function Profile() {
    const [darkMode, setDarkMode] = useState(true);
    const [currency, setCurrency] = useState('INR');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [userName, setUserName] = useState('Alex Johnson');
    const [tempName, setTempName] = useState(userName);
    const [userEmail] = useState('alex.johnson@example.com');

    const handleSaveProfile = () => {
        setUserName(tempName);
        setEditMode(false);
    };

    return (
        <div className="profile-app">
            <Head>
                <title>Profile Settings</title>
            </Head>

            <div className="profile-page-container">
                {/* Profile Info Section */}
                <section className="profile-section profile-info-section">
                    <div className="profile-avatar" aria-label="User Avatar" style={{ backgroundColor: '#6c5ce7' }}>
                        <span>A</span>
                        <button className="edit-avatar-btn" aria-label="Edit profile picture">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                            </svg>
                        </button>
                    </div>
                    <div className="profile-user-details">
                        {editMode ? (
                            <div className="edit-name-container">
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    className="name-input"
                                />
                                <button className="btn btn-primary save-btn" onClick={handleSaveProfile}>
                                    Save
                                </button>
                                <button className="btn btn-secondary cancel-btn" onClick={() => setEditMode(false)}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="profile-user-name">{userName}</h2>
                            </>
                        )}
                        <p className="profile-user-email">{userEmail}</p>

                        <button className="edit-name-btn" onClick={() => setEditMode(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                            </svg>
                            Edit
                        </button>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="profile-section profile-stats-section">
                    <div className="section-header">
                        <h3>Your Stats</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm14.25 6a.75.75 0 01-.75.75H7.5a.75.75 0 010-1.5h9a.75.75 0 01.75.75zm-3.75-3a.75.75 0 01-.75.75H7.5a.75.75 0 010-1.5h5.25a.75.75 0 01.75.75zm0 6a.75.75 0 01-.75.75H7.5a.75.75 0 010-1.5h5.25a.75.75 0 01.75.75z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Lifetime Spending</p>
                                <p className="stat-value">₹1,25,300.00</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                                    <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Most Frequent Groups</p>
                                <ul className="frequent-groups-list">
                                    <li>
                                        <span className="group-badge" style={{ backgroundColor: '#FF9E9E' }}>G</span>
                                        Goa 2024
                                    </li>
                                    <li>
                                        <span className="group-badge" style={{ backgroundColor: '#9EC5FF' }}>O</span>
                                        Office Lunch Group
                                    </li>
                                    <li>
                                        <span className="group-badge" style={{ backgroundColor: '#CAFFBF' }}>F</span>
                                        Flatmates
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Settings Section */}
                <section className="profile-section profile-settings-section">
                    <div className="section-header">
                        <h3>Settings</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <ul className="settings-list">
                        <li className="setting-option">
                            <div className="setting-info">
                                <div className="setting-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <label htmlFor="dark-mode-toggle" className="setting-label">Dark Mode</label>
                            </div>
                            <div className="setting-control">
                                <label className="toggle-switch" aria-label="Toggle Dark Mode">
                                    <input
                                        type="checkbox"
                                        id="dark-mode-toggle"
                                        className="toggle-checkbox"
                                        checked={darkMode}
                                        onChange={() => setDarkMode(!darkMode)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </li>

                        <li className="setting-option">
                            <div className="setting-info">
                                <div className="setting-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <label htmlFor="default-currency" className="setting-label">Default Currency</label>
                            </div>
                            <div className="setting-control">
                                <select
                                    id="default-currency"
                                    className="currency-select"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    <option value="INR">INR (₹)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                        </li>

                        <li className="setting-option">
                            <div className="setting-info">
                                <div className="setting-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <label htmlFor="notification-toggle" className="setting-label">Push Notifications</label>
                            </div>
                            <div className="setting-control">
                                <label className="toggle-switch" aria-label="Toggle Push Notifications">
                                    <input
                                        type="checkbox"
                                        id="notification-toggle"
                                        className="toggle-checkbox"
                                        checked={notificationsEnabled}
                                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </li>
                    </ul>
                </section>

                {/* Actions Section */}
                <section className="profile-section profile-actions-section">
                    <button className="btn danger-btn logout-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm3.97 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H1.5a.75.75 0 010-1.5h11.69l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                        Logout
                    </button>
                </section>
            </div>
        </div>
    );
};