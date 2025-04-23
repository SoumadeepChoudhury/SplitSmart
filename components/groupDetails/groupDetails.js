"use client";

import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import './groupDetails.css';
import { db } from '@/firebase';
import { get, ref, remove, update } from 'firebase/database';
import { useUserContext } from '@/context/UserContext';
import colors from '@/utils/colors';
import Spinner from '@/utils/spinner/spinner';

export default function GroupDetails({ group, goBack, onTripClick }) {
    const { user, myData } = useUserContext();
    const [activeTab, setActiveTab] = useState('trips');
    const [groupName, setGroupName] = useState(group?.name);
    const [editGroupName, setEditGroupName] = useState(groupName);
    const [isEditingName, setIsEditingName] = useState(false);
    const [membersInfo, setMembersInfo] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [copyText, setCopyText] = useState('Copy');
    const [_group, set_Group] = useState(group);

    let link = 'Loading...';

    const tripNameRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    //Handling date change so that the end date is always after the start date.
    useEffect(() => {
        const handleStartDateChange = () => {
            const startDate = startDateRef.current.value;
            if (endDateRef.current) {
                endDateRef.current.min = startDate;
            }
        };
        const startInput = startDateRef.current;
        if (startInput) {
            startInput.addEventListener('change', handleStartDateChange);
        }

        return () => {
            if (startInput) {
                startInput.removeEventListener('change', handleStartDateChange);
            }
        };
    }, [showCreateForm]);

    useEffect(() => {
        const fetchMembers = async () => {
            const tempGrpMembers = myData.groups.filter((grp) => grp.id === group.id)[0];
            group = tempGrpMembers;
            if (group === undefined) goBack();
            if (!group) return
            set_Group(group);
            setGroupName(group?.name);
            const memberDetails = [];

            for (const member of group?.members) {
                if (member === user.uid) {
                    memberDetails.push({
                        uid: user.uid,
                        name: myData.name,
                        email: myData.email,
                        photoURL: myData.photoURL,
                        isCurrentUser: true,
                        isAdmin: group?.createdBy === member,
                        color: colors[parseInt(Math.random() * 10)]
                    });
                } else {
                    try {
                        const snapshot = await get(ref(db, `users/${member}`));
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            memberDetails.push({
                                uid: member,
                                name: data.name,
                                email: data.email,
                                photoURL: data.photoURL,
                                isCurrentUser: false,
                                isAdmin: group?.createdBy === member,
                                color: colors[parseInt(Math.random() * 10)]
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching data for ${member}:`, error);
                    }
                }
            }

            setMembersInfo([...memberDetails]);
        };

        fetchMembers();
    }, [myData, group?.members, group?.createdBy, user.uid]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleEditNameSubmit = (e) => {
        e.preventDefault();
        if (group.members.includes(user.uid)) {
            update(ref(db, `users/${group.createdBy}/groups/${group.id}`), {
                name: editGroupName,
            }).then(() => {
                setGroupName(editGroupName);
            }).catch((error) => {
                console.error('Error updating group name:', error);
            });
        }
        setIsEditingName(false);
    };

    function getDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    function createTripId(tripName) {
        //user+grp+trip+time
        let _tripId = '';
        //user name
        const _unameArray = myData.name.split(' ');
        let _uname = '';
        for (let index = 0; index < _unameArray.length; index++) {
            const word = _unameArray[index];
            _uname += word.charAt(0).toLowerCase();
        }
        //group name
        const _grpNameArray = group.name.split(' ');
        let _grpName = '';
        for (let index = 0; index < _grpNameArray.length; index++) {
            const word = _grpNameArray[index];
            _grpName += word.charAt(0).toLowerCase();
        }
        //trip name
        const _tripNameArray = tripName.split(' ');
        let _tripName = '';
        for (let index = 0; index < _tripNameArray.length; index++) {
            const word = _tripNameArray[index];
            _tripName += word.charAt(0).toLowerCase();
        }

        _tripId = `${_uname}${_grpName}${_tripName}${Date.now()}`;
        return _tripId;
    }

    //handling create trip form
    const handleCreateTrip = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        // Validate dates
        const startDate = new Date(startDateRef.current.value);
        const endDate = new Date(endDateRef.current.value);


        if (!tripNameRef.current.value.trim()) {
            console.log('Trip name is required');
            return;
        }

        if (!startDateRef.current.value) {
            console.log('Start date is required');
            return;
        }

        if (!endDateRef.current.value) {
            console.log('End date is required');
            return;
        } else if (endDate < startDate) {
            console.log('End date must be after start date');
            return;
        }

        try {
            const tripId = createTripId(tripNameRef.current.value?.trim());
            const tripData = {
                name: tripNameRef.current.value?.trim(),
                startDate: getDate(new Date(startDateRef.current.value)),
                endDate: getDate(new Date(endDateRef.current.value)),
                createdBy: user.uid,
                createdAt: getDate(new Date()),
            };

            update(ref(db, `users/${group.createdBy}/groups/${group.id}/trips/${tripId}`), tripData).then(() => {
                console.log('Trip created successfully');
                setShowCreateForm(false);
                setIsLoading(false);
                update(ref(db, `users/${group.createdBy}/groups/${group.id}`), { recentActivity: `Trip: ${tripData.name} has been created in ${group.name} group.` })
            });

        } catch (error) {
            console.log('Error creating trip:', error);
        }
    };

    function handleDeleteGroup() {
        remove(ref(db, `invites/${group.token}`)).then(() => { console.log('Cleaned') })
        update(ref(db, `users/${group.createdBy}/groups/${group.id}`), { recentActivity: `Group: ${group.name} is deleted by ${myData.name}.` })
        remove(ref(db, `users/${group.createdBy}/groups/${group.id}`)).then(() => {
            group = null;
            goBack();
        })
    }

    const handleCopy = async () => {
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'clipboard-write' });

            if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
                await navigator.clipboard.writeText(link);
                setCopyText("Copied!");
            } else {
                alert('Clipboard access denied.');
            }
        } catch (err) {
            console.error('Clipboard error:', err);
        }
    };

    function getLink() {
        //Create a link with the unique id of the group, i.e., groupId
        const fullUrl = typeof window !== 'undefined' ? window.location.href : '';
        link = fullUrl + "join/group/" + group.token;

        return link !== 'Loading...' ? link : null;
    }

    return (
        <div className="group-details-app">
            <Head>
                <title>{groupName} | Group Details</title>
            </Head>

            {/* Add this back button */}
            <button
                className="elegant-back-button"
                onClick={goBack}
                aria-label="Go back"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
                </svg>
            </button>

            <div className="group-details-container">
                {/* Group Header */}
                <div className="group-header">
                    <div className="group-header-avatar" aria-hidden="true" style={{ backgroundColor: '#FF9E9E' }}>
                        {group?.initial}
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
                            <button className="btn btn-primary new-trip-btn" onClick={() => {
                                setShowCreateForm(true);
                                setTimeout(() => {
                                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                }, 100);
                            }
                            }>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                </svg>
                                New Trip
                            </button>
                        </div>

                        {/* Trip List */}
                        {Object.keys(_group.trips).length > 0 ? (<ul className="content-list trip-list"> {Object.entries(_group.trips).map(([tripId, tripDetailsObject]) => {

                            return (<li key={tripId} className="list-item trip-list-item" tabIndex={0} role="button" onClick={() => onTripClick([group, tripId, tripDetailsObject, membersInfo])} >
                                <div className="trip-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="trip-details">
                                    <span className="trip-name">{tripDetailsObject.name}</span>
                                    <span className="trip-date">{tripDetailsObject.startDate}</span>
                                </div>
                                <div className="trip-arrow">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </li>)

                        })}</ul>) : (
                            !showCreateForm ? <div className="no-groups-message">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M6.912 3a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0017.088 3H6.912zm13.823 9.75l-2.213-7.191A1.5 1.5 0 0017.088 4.5H6.912a1.5 1.5 0 00-1.434 1.059L3.265 12.75H6.11a3 3 0 012.684 1.658l.256.513a1.5 1.5 0 001.342.829h3.218a1.5 1.5 0 001.342-.83l.256-.512a3 3 0 012.684-1.658h2.844z" clipRule="evenodd" />
                                </svg>
                                <p>No Trips found</p>
                            </div> : null)}
                    </div>


                    {/* Create Trip Form */}
                    {showCreateForm ? <section className="create-trip-form-section" id="create-trip-form">
                        <div className="form-header">
                            <h2>Create New Trip</h2>
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

                        <form id="new-trip-form" onSubmit={handleCreateTrip}>
                            <div className="form-group">
                                <label htmlFor="trip-name">Trip Name:</label>
                                <input
                                    type="text"
                                    id="trip-name"
                                    name="tripName"
                                    required
                                    placeholder="Enter trip name"
                                    ref={tripNameRef}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="start-date">Start Date:</label>
                                    <input
                                        type="date"
                                        id="start-date"
                                        name="startDate"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        ref={startDateRef}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="end-date">End Date:</label>
                                    <input
                                        type="date"
                                        id="end-date"
                                        name="endDate"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        ref={endDateRef}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    Create Trip
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
                    </section> : null}

                    {/* Members Tab */}
                    <div
                        id="members-content"
                        className={`tab-pane ${activeTab === 'members' ? 'active' : ''}`}
                        role="tabpanel"
                        aria-labelledby="members-tab-button"
                    >
                        <div className="tab-pane-header">
                            <h2>Members</h2>
                            <button className="btn btn-secondary invite-members-btn" onClick={() => setShowOverlay(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                                </svg>
                                Invite / Share Link
                            </button>
                        </div>
                        {/* Get the members list and fetch the name and email of the members from the uid */}
                        <ul className="content-list member-list">
                            {
                                membersInfo.map((member) => (
                                    <li className="list-item member-list-item" key={member.uid}>
                                        {member.photoURL === '' ? (<div className="member-avatar" aria-hidden="true" style={{ backgroundColor: `${member.color}` }}>
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>) : (<img src={member.photoURL} alt="User Avatar" className="member-avatar" referrerPolicy='no-referrer' />)}
                                        <div className="member-details">
                                            <span className="member-name">{member.name} {member.isCurrentUser ? '(You)' : null}</span>
                                            <span className="member-email">{member.email}</span>
                                        </div>
                                        {member.isAdmin ? <span className="member-role admin">Admin</span> : null}
                                    </li>
                                ))
                            }
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
                        {group.createdBy === user.uid &&
                            <section className="setting-section delete-group-section">
                                <h3>Danger Zone</h3>
                                <p>Deleting the group will permanently remove all associated trips and expenses for all members.</p>
                                <button className="btn danger-btn delete-group-btn" onClick={handleDeleteGroup}>
                                    Delete Group
                                </button>
                                <small>(Only group admins can perform this action)</small>
                            </section>
                        }
                    </div>
                </div>
            </div>
            {isLoading && <Spinner size={40} />}
            {showOverlay && (
                <div className="overlay-backdrop">
                    <div className="overlay-content">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                            <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                            <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
                        </svg>
                        <p>Group created! Share this link to invite members:</p>
                        <div className="link-container">
                            <input type="text" value={getLink() || link} readOnly />
                            <button onClick={handleCopy}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
                                    <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6v10.125A3.375 3.375 0 009.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V7.875C3 6.839 3.84 6 4.875 6z" />
                                </svg>
                                {copyText}
                            </button>
                        </div>
                        <button className="close-btn" onClick={() => setShowOverlay(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};