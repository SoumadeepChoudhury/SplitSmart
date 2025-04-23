'use client';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { onValue, ref, remove, get } from "firebase/database";
import colors from "@/utils/colors";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [myData, setMyData] = useState({ name: '', email: '', photoURL: '', groups: [] });

    async function getName(id) {
        return (await get(ref(db, `users/${id}/name`))).val()
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                //adding to local data
                onValue(ref(db, "users/" + user.uid), async (snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        let myGroups = [];
                        console.log("Updating local data")

                        //Configuring my created groups
                        if (userData.groups) {
                            const _myGroupKeys = Object.keys(userData.groups);
                            for (let index = 0; index < _myGroupKeys.length; index++) {
                                const element = _myGroupKeys[index];
                                let isPresent = myGroups.some((group) => group.id === element);
                                if (!isPresent) {
                                    myGroups.push({
                                        id: element,
                                        name: userData.groups[element].name,
                                        desc: userData.groups[element].description,
                                        currency: userData.groups[element].currency,
                                        createdAt: userData.groups[element].createdAt,
                                        createdBy: userData.groups[element].createdBy,
                                        createrName: userData.groups[element].createdBy === user.uid ? 'You' : await getName(userData.groups[element].createdBy),
                                        members: userData.groups[element].members,
                                        token: userData.groups[element].token,
                                        trips: userData.groups[element].trips || {},
                                        recentActivity: userData.groups[element].recentActivity || null,
                                        memberCount: userData.groups[element].members.length,
                                        activeTripsCount: userData.groups[element].activeTrips || 0,
                                        initial: userData.groups[element].name.charAt(0).toUpperCase(),
                                        color: colors[parseInt(Math.random() * 10)],
                                    });
                                }
                            }
                        }

                        //Configuring the other groups
                        if (userData.otherGroups) {
                            const _otherGroupKeys = Object.keys(userData.otherGroups);
                            for (let index = 0; index < _otherGroupKeys.length; index++) {
                                const _otherGroupKey = _otherGroupKeys[index];
                                onValue(ref(db, `users/${userData.otherGroups[_otherGroupKey]}/groups/${_otherGroupKey}`), async (snap) => {
                                    let grp = {}
                                    if (snap.exists()) {
                                        const otherGrpData = snap.val();
                                        grp.id = _otherGroupKey;
                                        grp.name = otherGrpData.name;
                                        grp.desc = otherGrpData.description;
                                        grp.currency = otherGrpData.currency;
                                        grp.createdAt = otherGrpData.createdAt;
                                        grp.createdBy = otherGrpData.createdBy;
                                        grp.createrName = otherGrpData.createdBy === user.uid ? 'You' : await getName(otherGrpData.createdBy);
                                        grp.members = otherGrpData.members;
                                        grp.trips = otherGrpData.trips || {};
                                        grp.token = otherGrpData.token;
                                        grp.recentActivity = otherGrpData.recentActivity || null;
                                        grp.memberCount = otherGrpData.members.length;
                                        grp.activeTripsCount = otherGrpData.activeTrips || 2;
                                        grp.initial = otherGrpData.name.charAt(0).toUpperCase();
                                        grp.color = colors[parseInt(Math.random() * 10)];
                                    }
                                    else {
                                        //remove the group from other groups
                                        remove(ref(db, `users/${user.uid}/otherGroups/${_otherGroupKey}`)).then(() => {
                                            console.log("Cleaned!");
                                        })
                                    }
                                    let isPresent = myGroups.some((group) => group.id === _otherGroupKey);
                                    //remove the object is present in the array
                                    if (isPresent) {
                                        myGroups = myGroups.filter((group) => group.id !== _otherGroupKey);
                                    }
                                    //push the object to the array
                                    myGroups.push(grp);

                                    setMyData(prev => ({
                                        ...prev,
                                        name: userData.name,
                                        email: userData.email,
                                        photoURL: userData.photoURL,
                                        groups: [...myGroups],
                                    }));

                                })
                            }
                        }

                        setMyData(prev => ({
                            ...prev,
                            name: userData.name,
                            email: userData.email,
                            photoURL: userData.photoURL,
                            groups: myGroups,
                        }));
                    } else {
                        setUser(user);
                    }
                });
                setUser(user);
                setCurrentTab('home'); // Set default tab to 'home' when user is authenticated
            } else {
                setUser(null);
                setCurrentTab(null);
            }
            setLoading(false);
        });

        // Cleanup when component unmounts
        return () => unsubscribe();
    }, [user]);

    const values = {
        user,
        setUser,
        loading,
        setLoading,
        currentTab,
        setCurrentTab,
        myData,
        setMyData,
        selectedGroup,
        setSelectedGroup,
        selectedTrip,
        setSelectedTrip,
        selectedExpense,
        setSelectedExpense
    }

    return (<UserContext.Provider value={values}>
        {children}
    </UserContext.Provider>
    )
}

export const useUserContext = () => {
    return useContext(UserContext);
}