import './bottomnavbar.css';
import icons from '@/utils/icons';
import { useUserContext } from '@/context/UserContext';

export default function BottomNavBar() {
    const { currentTab, setCurrentTab,setSelectedGroup, setSelectedTrip, setSelectedExpense } = useUserContext();
    const handleTabChange = (tab) => {
        setCurrentTab(tab);
        setSelectedGroup(null);
        setSelectedTrip(null);
        setSelectedExpense(null);
    };

    return (
        <div className="bottom-nav">
            <div className={(currentTab === 'home' ? "active " : "") + "nav-item"} onClick={() => handleTabChange('home')}>
                <img src={currentTab === "home" ? icons.home.active : icons.home.inactive} alt="Home" />
                <span>Home</span>
            </div>
            <div className={(currentTab === 'groups' ? "active " : "") + "nav-item"} onClick={() => handleTabChange('groups')}>
                <img src={currentTab === "groups" ? icons.group.active : icons.group.inactive} alt="Groups" />
                <span>Groups</span>
            </div>

            <div className={(currentTab === 'profile' ? "active " : "") + "nav-item"} onClick={() => handleTabChange('profile')}>
                <img src={currentTab === "profile" ? icons.profile.active : icons.profile.inactive} alt="Profile" />
                <span>Profile</span>
            </div>
        </div>
    )
}