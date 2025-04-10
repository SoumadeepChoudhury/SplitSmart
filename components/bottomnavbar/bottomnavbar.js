import './bottomnavbar.css';
import icons from '@/utils/icons';

export default function BottomNavBar() {
    return (
        <div className="bottom-nav">
            <div className="nav-item active">
                <img src={icons.home.active} alt="Home" />
                <span>Home</span>
            </div>
            <div className="nav-item">
                <img src={icons.group.inactive} alt="Groups" />
                <span>Groups</span>
            </div>

            <div className="nav-item">
                <img src={icons.profile.inactive} alt="Profile" />
                <span>Profile</span>
            </div>
        </div>
    )
}