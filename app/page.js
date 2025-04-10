'use client';
import Auth from "@/components/auth/auth";
import styles from "./page.module.css";
import BottomNavBar from "@/components/bottomnavbar/bottomnavbar";
import Dashboard from "@/components/dashboard/dashboard";
import Groups from "@/components/groups/groups";
import GroupDetails from "@/components/groupDetails/groupDetails";
import Trip from '@/components/trip/trip';
import Profile from '@/components/profile/profile';

export default function Home() {
  return (
    <div className={styles.page}>
      <Dashboard />
      <BottomNavBar />
    </div>
  )
}
