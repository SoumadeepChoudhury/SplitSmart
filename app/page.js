'use client';
import Auth from "@/components/auth/auth";
import styles from "./page.module.css";
import BottomNavBar from "@/components/bottomnavbar/bottomnavbar";
import Dashboard from "@/components/dashboard/dashboard";
import Groups from "@/components/groups/groups";
import GroupDetails from "@/components/groupDetails/groupDetails";
import Trip from '@/components/trip/trip';
import Profile from '@/components/profile/profile';
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import Spinner from "@/utils/spinner/spinner";
import ExpenseDetail from "@/components/expense/expense";

export default function Home() {
  const { currentTab,selectedGroup, setSelectedGroup,selectedTrip,setSelectedTrip,selectedExpense,setSelectedExpense } = useUserContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return (<Spinner />)

  return (
    <div className={styles.page}>
      {(() => {

        if (selectedExpense) {
          return <ExpenseDetail expenseData={selectedExpense} goBack={() => setSelectedExpense(null)} />
        }

        if (selectedTrip) {
          return <Trip details={selectedTrip} goBack={() => setSelectedTrip(null)} onExpenseClick={(expense)=>setSelectedExpense(expense)} />;
        }

        if (selectedGroup) {
          return <GroupDetails group={selectedGroup} goBack={() => setSelectedGroup(null)} onTripClick={(trip) => setSelectedTrip(trip) } />;
        }

        switch (currentTab) {
          case 'home':
            return <Dashboard />;
          case 'groups':
            return <Groups onGroupClick={(group) => setSelectedGroup(group)} />;
          case 'profile':
            return <Profile />;
          default:
            return <Auth />;
        }
      })()}

      {currentTab ? <BottomNavBar /> : null}
    </div>
  )
}
