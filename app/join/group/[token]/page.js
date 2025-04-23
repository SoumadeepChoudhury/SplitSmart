'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, get, set, update } from 'firebase/database';
import { db } from '@/firebase';
import { useUserContext } from '@/context/UserContext'; // assuming you use a context

export default function JoinGroupPage({ params }) {
    const { token } = use(params);
    const { user, myData } = useUserContext();
    const [s, setS] = useState();
    const router = useRouter();
    const [timeoutId, setTimeoutId] = useState(null);


    useEffect(() => {

        setS(`${user?.uid} => ${token}`);

        if (user && token && myData) {
            timeoutId && clearTimeout(timeoutId);
            //user is authenticated
            //check the token

            //Step 1: Get the group data from the token
            get(ref(db, `invites/${token}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val(); //{groupId: 'aff',createdBy: 'asfasf' }
                    //Step 2: Update the particular group and add in the members list
                    const membersRef = ref(db, `users/${data.createdBy}/groups/${data.groupId}/members`);

                    get(membersRef).then((snap) => {
                        let members = [];
                        if (snap.exists()) {
                            members = snap.val();
                            if (!Array.isArray(members)) members = []; // safeguard
                        }

                        // Avoid duplicates
                        if (!members.includes(user.uid)) {
                            members.push(user.uid);
                            set(membersRef, members); // replaces the array with the new one
                        }
                        else {
                            alert("You are already a member of this group");
                            router.push('/');
                            return;
                        }
                    });
                    //Step 3: Update the users and add the new groupid in the "Other groups"
                    const otherGrpRef = ref(db, `users/${user.uid}/otherGroups`);

                    get(otherGrpRef).then((snap) => {
                        let otherGroups = {}; // {grpId: userId}
                        if (snap.exists()) {
                            otherGroups = snap.val();
                            // safeguard
                            if (typeof otherGroups !== 'object') otherGroups = {};
                        }
                        // Avoid duplicates
                        if (!otherGroups[data.groupId]) {
                            otherGroups[data.groupId] = data.createdBy;
                            set(otherGrpRef, otherGroups).then(() => {
                                //update the recent activity
                                //get grp name
                                get(ref(db, `users/${data.createdBy}/groups/${data.groupId}/name`)).then((name) => {
                                    if (name.exists())
                                        update(ref(db, `users/${data.createdBy}/groups/${data.groupId}`), { recentActivity: `${myData?.name || 'New Member'} joined group: ${name.val()}` }).then(() => {
                                            router.push('/'); // redirect to home
                                        })
                                })

                            }).catch((error) => alert(error.message));
                        }
                    }
                    )

                } else {
                    alert("Invalid Token...");
                    return
                }
            })


        } else {
            const _id = setTimeout(() => {
                if (!user) {
                    alert("You must login to join a group");
                    router.push('/');
                }
            }, 5000);
            setTimeoutId(_id);
        }
    }, [token, user]);

    // setTimeout(() => router.push('/'), 10000);


    return <div>{s}</div>;
}
