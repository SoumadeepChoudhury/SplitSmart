'use client';
import { useEffect, useState } from 'react';
import './dashboard.css';
import { useUserContext } from '@/context/UserContext';

export default function Dashboard() {
    const { myData, setSelectedGroup, setCurrentTab, setIsCreateGroupClicked } = useUserContext();
    const [upcomingTrip, setUpcomingTrip] = useState('Loading...');
    const [totalGrps, setTotalGrps] = useState();
    const [totalTrips, setTotalTrips] = useState();
    const [recentActivities, setRecentActivities] = useState([]);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        setTotalGrps(getTotalGrps());
        setTotalTrips(getTotalTrips());
        setUpcomingTrip(findUpcomingTrip());
        setRecentActivities(getRecentActivities());
    }, [myData]);


    function findUpcomingTrip() {
        let trip_name = 'Loading...';
        try {
            myData.groups.forEach(group => {
                Object.entries(group.trips).forEach(([tripId, tripDetails]) => {
                    //compare the end date with current date.. The end date is in format 20 April 2025
                    const endDate = new Date(tripDetails.endDate);
                    const today = new Date();

                    if (today <= endDate) {
                        trip_name = `${tripDetails.name} (${group.name})`;
                    }
                    else {
                        trip_name = 'No Ongoing Trip';
                    }
                });
            });
        } catch (error) {
            trip_name = 'Loading...';
        }
        return trip_name;
    }

    function getTotalGrps() {
        let t_grps = 0;
        try {
            t_grps = myData.groups.length;
        } catch (error) {
            t_grps = 0;
        }
        return t_grps;
    }

    function getTotalTrips() {
        let t_trips = 0;
        try {
            myData.groups.forEach(group => {
                t_trips = Object.keys(group.trips).length;
            });
        } catch (error) {
            t_trips = 0;
        }
        return t_trips;
    }

    function getRecentActivities() {
        let _recentActivities = [];
        try {
            myData.groups.forEach(group => {
                if (group.recentActivity)
                    _recentActivities.push(group.recentActivity);
            });
        } catch (error) {
            console.log("Error in fetching recent activities...");
        }
        return _recentActivities;
    }

    async function getLink(token) {
        let fullUrl = typeof window !== 'undefined' ? window.location.href : '';
        fullUrl = fullUrl + "join/group/" + token;
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'clipboard-write' });

            if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
                await navigator.clipboard.writeText(fullUrl);
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 3000);
            } else {
                alert('Clipboard access denied.');
            }
        } catch (err) {
            console.error('Clipboard error:', err);
        }

    }

    function createGrp() {
        setIsCreateGroupClicked(true);
        setCurrentTab('groups');
    }

    return (
        <div className="dashboard-app">
            <div className="dashboard-container">
                {/* Header Section */}
                <div className="header-section">
                    <h1 className="greeting">Hi <span className="user-name">{myData.name || 'User'}</span>!</h1>
                    <div className="user-avatar">
                        {!myData.photoURL ? (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                        </svg>) : <img src={myData.photoURL} alt="User Avatar" referrerPolicy='no-referrer' style={{ borderRadius: '50%', width: '48px', height: '48px', objectFit: 'fill' }} />}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="stat-card negative">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF7E6B">
                                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V18c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-1.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05.02.01.03.03.04.04 1.14.83 1.93 1.94 1.93 3.41V18c0 .35-.07.69-.2 1H22c.55 0 1-.45 1-1v-1.5c0-2.33-4.67-3.5-7-3.5z" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total groups</p>
                            <p className="stat-value">{totalGrps}</p>
                        </div>
                    </div>

                    <div className="stat-card positive">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4db6ac">
                                <path d="M17.34 1.13c-2.94-.55-5.63.75-7.12 2.92.01-.01.01-.02.02-.03C9.84 4 9.42 4 9 4c-4.42 0-8 .5-8 4v10c0 .88.39 1.67 1 2.22V22c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22v-3.08c3.72-.54 6.5-3.98 5.92-7.97-.42-2.9-2.7-5.29-5.58-5.82zM4.5 19c-.83 0-1.5-.67-1.5-1.5S3.67 16 4.5 16s1.5.67 1.5 1.5S5.33 19 4.5 19zM3 13V8h6c0 1.96.81 3.73 2.11 5H3zm10.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm2.5-6c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm.5-9H15v5l3.62 2.16.75-1.23-2.87-1.68V4z" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Trips</p>
                            <p className="stat-value">{totalTrips}</p>
                        </div>
                    </div>

                    <div className="stat-card upcoming">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">On Going Trip</p>
                            <p className="stat-value">{upcomingTrip}</p>
                        </div>
                    </div>
                </div>

                {/* Your Groups */}
                <section className="your-groups">
                    <div className="section-header">
                        <h2>Your Groups</h2>
                        <div>
                            <button className="view-all" onClick={createGrp}>
                                Create Group
                            </button>
                            {myData.groups.length > 0 ? <button className="view-all" onClick={() => setCurrentTab('groups')}>View All</button> : null}
                        </div>
                    </div>

                    {myData.groups.length > 0 ? <div className="groups-scroll-container">
                        {myData.groups.map((group, index) => (
                            <div className="group-card">
                                <div key={index} onClick={() => { setSelectedGroup(group); setCurrentTab('groups') }}>
                                    <div className="group-icon" style={{ backgroundColor: group.color }}>
                                        {group.initial}
                                    </div>
                                    <h3 className="group-name">{group.name}</h3>
                                    <p className="group-members">{group.memberCount} Member{group.memberCount > 1 ? 's' : ''}</p>
                                </div>
                                <button className="view-all" style={{ marginTop: '1rem' }} onClick={() => getLink(group.token)}>
                                    {isCopied ? "Link Copied" : "Invite Member"}
                                </button>
                            </div>
                        ))}
                    </div> : (<div className="no-groups-message">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="url(#groupsGradient)" viewBox="0 0 24 24" className="groups-icon">
                            <defs>
                                <linearGradient id="groupsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#8A63FF" />
                                    <stop offset="100%" stopColor="#4F6AF5" />
                                </linearGradient>
                            </defs>
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 2.01 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>

                        <style jsx>{`
                            @keyframes bob {
                                0%, 100% {
                                transform: translateY(0);
                                }
                                50% {
                                transform: translateY(-3px);
                                }
                            }

                            .groups-icon {
                                animation: bob 1.5s ease-in-out infinite;
                            }
                            `}</style>

                        <p>No Groups found...</p>
                    </div>)}

                </section>

                {/* Recent Activity */}
                <section className="recent-activity">
                    <div className="section-header">
                        <h2>Recent Activity</h2>
                    </div>
                    {
                        recentActivities?.length > 0 ? (<ul className="activity-list">
                            {recentActivities.map((recentActivity, index) => (
                                <li className="activity-item" key={index}>
                                    <div className="activity-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                                        </svg>
                                    </div>
                                    <div className="activity-content">
                                        <p><span className="actor">{recentActivity}</span></p>
                                        <span className="timestamp">Recently</span>
                                    </div>
                                </li>
                            ))}

                        </ul>) : (<div className="no-groups-message">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#waveGradient)" className="wave-icon">
                                <defs>
                                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#8A63FF" />
                                        <stop offset="100%" stopColor="#4F6AF5" />
                                    </linearGradient>
                                </defs>
                                <path d="M3 15a1 1 0 0 1 1-1h16a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1zm2-4a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1zm3-4a1 1 0 0 1 1-1h6a1 1 0 0 1 0 2H9a1 1 0 0 1-1-1z" />
                            </svg>

                            <style jsx>{`
                                @keyframes bob {
                                    0%, 100% {
                                    transform: translateY(0);
                                    }
                                    50% {
                                    transform: translateY(-3px);
                                    }
                                }

                                .wave-icon {
                                    animation: bob 1.5s ease-in-out infinite;
                                }
                                `}</style>

                            <p>No Recent Activity...</p>
                        </div>)
                    }

                </section>


            </div>
        </div>
    )
}