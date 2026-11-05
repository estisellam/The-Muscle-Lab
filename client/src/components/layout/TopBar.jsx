import { profileImageUrl } from "../../services/config";
import "./TopBar.css";

function TopBar({
    name = "Member",
    role = "Member",
    image
}) {

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour >= 5 && hour < 12) {

        greeting = "Good Morning";

    } else if (hour >= 12 && hour < 18) {

        greeting = "Good Afternoon";

    }

    const profileImage = profileImageUrl(image);

    return (

        <header className="topbar">

            <div className="topbar-left">

                <h2>

                    {greeting}, {name} 👋

                </h2>

            </div>

            <div className="topbar-right">

                <div className="user-info">

                    <span className="user-name">

                        {name}

                    </span>

                    <span className="user-role">

                        {role}

                    </span>

                </div>

                <img
                    className="user-avatar"
                    src={profileImage}
                    alt={name}
                />

            </div>

        </header>

    );

}

export default TopBar;