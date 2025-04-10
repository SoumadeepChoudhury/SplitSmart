'use client';
import './dashboard.css';

export default function Dashboard() {
    return (
        <div className="dashboard-app">
            <div className="dashboard-container">
                {/* Header Section */}
                <div className="header-section">
                    <h1 className="greeting">Hi <span className="user-name">Soumadeep</span>!</h1>
                    <div className="user-avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="stat-card negative">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-.53 14.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V8.25a.75.75 0 00-1.5 0v5.69l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">You Owe</p>
                            <p className="stat-value">₹1,250.00</p>
                        </div>
                    </div>

                    <div className="stat-card positive">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.53 5.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v5.69a.75.75 0 001.5 0v-5.69l1.72 1.72a.75.75 0 101.06-1.06l-3-3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">You are Owed</p>
                            <p className="stat-value">₹800.00</p>
                        </div>
                    </div>

                    <div className="stat-card upcoming">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Upcoming</p>
                            <p className="stat-value">Goa Trip (3 days)</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <section className="recent-activity">
                    <div className="section-header">
                        <h2>Recent Activity</h2>
                        <button className="view-all">View All</button>
                    </div>

                    <ul className="activity-list">
                        <li className="activity-item">
                            <div className="activity-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                                </svg>
                            </div>
                            <div className="activity-content">
                                <p><span className="actor">Priya Sharma</span> paid <span className="amount negative">₹500</span> for <span className="context">Goa 2024 Dinner</span></p>
                                <span className="timestamp">2 hours ago</span>
                            </div>
                        </li>

                        <li className="activity-item">
                            <div className="activity-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="activity-content">
                                <p>You added an expense <span className="amount negative">₹1200</span> for <span className="context">Weekend Getaway Travel</span></p>
                                <span className="timestamp">Yesterday</span>
                            </div>
                        </li>

                        <li className="activity-item">
                            <div className="activity-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="activity-content">
                                <p><span className="actor">Amit Singh</span> settled up in <span className="context">Office Lunch Group</span></p>
                                <span className="timestamp">3 days ago</span>
                            </div>
                        </li>
                    </ul>
                </section>

                {/* Your Groups */}
                <section className="your-groups">
                    <div className="section-header">
                        <h2>Your Groups</h2>
                        <button className="view-all">View All</button>
                    </div>

                    <div className="groups-scroll-container">
                        {[
                            { name: 'Goa 2024', members: 5, color: '#FF9E9E', initial: 'G' },
                            { name: 'Weekend Getaway', members: 3, color: '#9EC5FF', initial: 'W' },
                            { name: 'Office Lunch', members: 12, color: '#FFD6A5', initial: 'O' },
                            { name: 'Flatmates', members: 4, color: '#CAFFBF', initial: 'F' },
                            { name: 'College Reunion', members: 8, color: '#BDB2FF', initial: 'C' }
                        ].map((group, index) => (
                            <div key={index} className="group-card">
                                <div className="group-icon" style={{ backgroundColor: group.color }}>
                                    {group.initial}
                                </div>
                                <h3 className="group-name">{group.name}</h3>
                                <p className="group-members">{group.members} Members</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}