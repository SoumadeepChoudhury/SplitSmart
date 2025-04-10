'use client';
import './groups.css'

import { useState } from 'react';

export default function Groups() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showShareLink, setShowShareLink] = useState(false);
    const [sortOption, setSortOption] = useState('recent');
    const [searchQuery, setSearchQuery] = useState('');

    const groups = [
        { id: 1, name: 'Goa 2024', members: 5, activeTrips: 1, initial: 'G', color: '#FF9E9E' },
        { id: 2, name: 'Weekend Getaway', members: 3, activeTrips: 0, initial: 'W', color: '#9EC5FF' },
        { id: 3, name: 'Office Lunch Group', members: 12, activeTrips: 2, initial: 'O', color: '#FFD6A5' },
        { id: 4, name: 'Flatmates', members: 4, activeTrips: 0, initial: 'F', color: '#CAFFBF' },
    ];

    const handleCreateGroup = (e) => {
        e.preventDefault();
        // Form submission logic here
        setShowShareLink(true);
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedGroups = [...filteredGroups].sort((a, b) => {
        if (sortOption === 'name_asc') return a.name.localeCompare(b.name);
        if (sortOption === 'name_desc') return b.name.localeCompare(a.name);
        return 0; // Default to recent activity (original order)
    });

    return (
        <div className="groups-app">
            <div className="groups-page-container">
                {/* Action Bar */}
                <div className="groups-actions">
                    <div className="search-container">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="search"
                            className="search-input"
                            placeholder="Search groups..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="sort-filter-options">
                        <div className="custom-select-wrapper">
                            <select
                                id="sort-groups"
                                className="sort-select"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="recent">Sort: Recent Activity</option>
                                <option value="name_asc">Sort: Name (A-Z)</option>
                                <option value="name_desc">Sort: Name (Z-A)</option>
                            </select>
                            <span className="select-arrow"><svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M6 9l6 6 6-6"
                                    stroke="#ccc"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg></span>
                        </div>
                    </div>

                    <button
                        className="create-group-btn"
                        onClick={() => {
                            setShowCreateForm(true);
                            setShowShareLink(false);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                        </svg>
                        Create Group
                    </button>
                </div>

                {/* Group List */}
                <section className="group-list" aria-label="List of your groups">
                    {sortedGroups.length > 0 ? (
                        sortedGroups.map((group) => (
                            <div
                                key={group.id}
                                className="group-list-item"
                                tabIndex={0}
                                role="button"
                                aria-label={`View Group ${group.name}`}
                            >
                                <div
                                    className="group-avatar"
                                    aria-hidden="true"
                                    style={{ backgroundColor: group.color }}
                                >
                                    {group.initial}
                                </div>
                                <div className="group-details">
                                    <h3 className="group-item-name">{group.name}</h3>
                                    <p className="group-item-members">{group.members} Members</p>
                                </div>
                                {group.activeTrips > 0 && (
                                    <span className="group-active-trips-badge">
                                        {group.activeTrips} Trip{group.activeTrips !== 1 ? 's' : ''} Active
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-groups-message">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M6.912 3a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0017.088 3H6.912zm13.823 9.75l-2.213-7.191A1.5 1.5 0 0017.088 4.5H6.912a1.5 1.5 0 00-1.434 1.059L3.265 12.75H6.11a3 3 0 012.684 1.658l.256.513a1.5 1.5 0 001.342.829h3.218a1.5 1.5 0 001.342-.83l.256-.512a3 3 0 012.684-1.658h2.844z" clipRule="evenodd" />
                            </svg>
                            <p>No groups found</p>
                        </div>
                    )}
                </section>

                {/* Create Group Form */}
                {showCreateForm && (
                    <section className="create-group-form-section" id="create-group-form">
                        <div className="form-header">
                            <h2>Create New Group</h2>
                            <button
                                className="close-form-btn"
                                onClick={() => setShowCreateForm(false)}
                                aria-label="Close form"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <form id="new-group-form" onSubmit={handleCreateGroup}>
                            <div className="form-group">
                                <label htmlFor="group-name">Group Name:</label>
                                <input
                                    type="text"
                                    id="group-name"
                                    name="groupName"
                                    required
                                    placeholder="Enter group name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="group-description">Description (Optional):</label>
                                <textarea
                                    id="group-description"
                                    name="groupDescription"
                                    rows={3}
                                    placeholder="Add a short description"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="group-currency">Default Currency:</label>
                                <select id="group-currency" name="groupCurrency" required>
                                    <option value="INR">INR (₹)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    Create Group
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>

                        {showShareLink && (
                            <div className="shareable-link-display" id="shareable-link-area">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                                    <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                                    <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
                                </svg>
                                <p>Group created! Share this link to invite members:</p>
                                <div className="link-container">
                                    <input type="text" id="generated-link" value="https://app.example.com/group/join/abc123" readOnly />
                                    <button id="copy-link-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
                                            <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6v10.125A3.375 3.375 0 009.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V7.875C3 6.839 3.84 6 4.875 6z" />
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    )
}