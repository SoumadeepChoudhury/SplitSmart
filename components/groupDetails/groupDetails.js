"use client";

import { useState } from 'react';
import Head from 'next/head';
import './groupDetails.css';

export default function GroupDetails() {
    const [activeTab, setActiveTab] = useState('trips');
    const [groupName, setGroupName] = useState('Goa 2024');
    const [editGroupName, setEditGroupName] = useState(groupName);
    const [isEditingName, setIsEditingName] = useState(false);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleEditNameSubmit = (e) => {
        e.preventDefault();
        setGroupName(editGroupName);
        setIsEditingName(false);
    };

    return (
        <div className="group-details-app">
            <Head>
                <title>{groupName} | Group Details</title>
            </Head>

            <div className="group-details-container">
                {/* Group Header */}
                <div className="group-header">
                    <div className="group-header-avatar" aria-hidden="true" style={{ backgroundColor: '#FF9E9E' }}>
                        G
                    </div>
                    <h1 className="group-header-name">{groupName}</h1>
                </div>

                {/* Tab Navigation */}
                <nav className="group-tabs-nav" aria-label="Group Sections">
                    <button
                        className={`tab-button ${activeTab === 'trips' ? 'active' : ''}`}
                        onClick={() => handleTabChange('trips')}
                        role="tab"
                        aria-selected={activeTab === 'trips'}
                        aria-controls="trips-content"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                        </svg>
                        Trips
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
                        onClick={() => handleTabChange('members')}
                        role="tab"
                        aria-selected={activeTab === 'members'}
                        aria-controls="members-content"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                            <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                        </svg>
                        Members
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => handleTabChange('settings')}
                        role="tab"
                        aria-selected={activeTab === 'settings'}
                        aria-controls="settings-content"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                        </svg>
                        Settings
                    </button>
                </nav>

                {/* Tab Content */}
                <div className="group-tab-content-container">
                    {/* Trips Tab */}
                    <div
                        id="trips-content"
                        className={`tab-pane ${activeTab === 'trips' ? 'active' : ''}`}
                        role="tabpanel"
                        aria-labelledby="trips-tab-button"
                    >
                        <div className="tab-pane-header">
                            <h2>Trips</h2>
                            <button className="btn btn-primary new-trip-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                </svg>
                                New Trip
                            </button>
                        </div>
                        <ul className="content-list trip-list">
                            <li className="list-item trip-list-item" tabIndex={0} role="button">
                                <div className="trip-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="trip-details">
                                    <span className="trip-name">Goa 2024 Winter Trip</span>
                                    <span className="trip-date">Dec 15-20, 2024</span>
                                </div>
                                <div className="trip-arrow">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </li>
                            <li className="list-item trip-list-item" tabIndex={0} role="button">
                                <div className="trip-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="trip-details">
                                    <span className="trip-name">Manali 2025 Summer Expedition</span>
                                    <span className="trip-date">Jun 10-20, 2025</span>
                                </div>
                                <div className="trip-arrow">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </li>
                            <li className="list-item trip-list-item" tabIndex={0} role="button">
                                <div className="trip-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="trip-details">
                                    <span className="trip-name">Local Weekend Getaway</span>
                                    <span className="trip-date">Aug 5-7, 2024</span>
                                </div>
                                <div className="trip-arrow">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </li>
                        </ul>
                        <p className="empty-state" style={{ display: 'none' }}>
                            No trips added to this group yet.
                        </p>
                    </div>

                    {/* Members Tab */}
                    <div
                        id="members-content"
                        className={`tab-pane ${activeTab === 'members' ? 'active' : ''}`}
                        role="tabpanel"
                        aria-labelledby="members-tab-button"
                    >
                        <div className="tab-pane-header">
                            <h2>Members</h2>
                            <button className="btn btn-secondary invite-members-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                                </svg>
                                Invite / Share Link
                            </button>
                        </div>
                        <ul className="content-list member-list">
                            <li className="list-item member-list-item">
                                <div className="member-avatar" aria-hidden="true" style={{ backgroundColor: '#9EC5FF' }}>
                                    A
                                </div>
                                <div className="member-details">
                                    <span className="member-name">Amit Singh (You)</span>
                                    <span className="member-email">amit@example.com</span>
                                </div>
                                <span className="member-role admin">Admin</span>
                            </li>
                            <li className="list-item member-list-item">
                                <div className="member-avatar" aria-hidden="true" style={{ backgroundColor: '#FFD6A5' }}>
                                    P
                                </div>
                                <div className="member-details">
                                    <span className="member-name">Priya Sharma</span>
                                    <span className="member-email">priya@example.com</span>
                                </div>
                            </li>
                            <li className="list-item member-list-item">
                                <div className="member-avatar" aria-hidden="true" style={{ backgroundColor: '#CAFFBF' }}>
                                    R
                                </div>
                                <div className="member-details">
                                    <span className="member-name">Rahul Verma</span>
                                    <span className="member-email">rahul@example.com</span>
                                </div>
                            </li>
                            <li className="list-item member-list-item">
                                <div className="member-avatar" aria-hidden="true" style={{ backgroundColor: '#BDB2FF' }}>
                                    S
                                </div>
                                <div className="member-details">
                                    <span className="member-name">Sneha Patil</span>
                                    <span className="member-email">sneha@example.com</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Settings Tab */}
                    <div
                        id="settings-content"
                        className={`tab-pane ${activeTab === 'settings' ? 'active' : ''}`}
                        role="tabpanel"
                        aria-labelledby="settings-tab-button"
                    >
                        <h2>Settings</h2>

                        <section className="setting-section">
                            <h3>Group Name</h3>
                            {isEditingName ? (
                                <form className="edit-name-form" onSubmit={handleEditNameSubmit}>
                                    <input
                                        type="text"
                                        id="edit-group-name"
                                        value={editGroupName}
                                        onChange={(e) => setEditGroupName(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="btn btn-primary">
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setIsEditingName(false)}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <div className="name-display">
                                    <span>{groupName}</span>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setEditGroupName(groupName);
                                            setIsEditingName(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </section>

                        <section className="setting-section">
                            <h3>Group Photo</h3>
                            <div className="edit-photo-section">
                                <div className="current-photo-preview">
                                    <div className="group-header-avatar" aria-hidden="true" style={{ backgroundColor: '#FF9E9E' }}>
                                        G
                                    </div>
                                </div>
                                <div className="photo-actions">
                                    <label htmlFor="group-photo-upload" className="btn btn-secondary">
                                        Upload New Photo
                                    </label>
                                    <input type="file" id="group-photo-upload" accept="image/*" style={{ display: 'none' }} />
                                </div>
                            </div>
                        </section>

                        <section className="setting-section delete-group-section">
                            <h3>Danger Zone</h3>
                            <p>Deleting the group will permanently remove all associated trips and expenses for all members.</p>
                            <button className="btn danger-btn delete-group-btn">
                                Delete Group
                            </button>
                            <small>(Only group admins can perform this action)</small>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};