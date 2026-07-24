import "./ProfileHeader.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

function ProfileHeader({ user }) {

    const fullName =
        `${user.first_name || user.firstName || ""} ${user.last_name || user.lastName || ""}`.trim();

    const image =
        user.profile_image ||
        user.profileImage ||
        user.image ||
        null;

    const imageUrl =
        image && !image.startsWith("http")
            ? `${API_URL}${image}`
            : image;

    return (
        <div className="profile-header">

            <div className="profile-header-left">

                {
                    imageUrl ? (

                        <img
                            src={imageUrl}
                            alt={fullName}
                            className="profile-avatar"
                        />

                    ) : (

                        <div className="profile-avatar-placeholder">

                            {fullName
                                ? fullName.charAt(0).toUpperCase()
                                : "U"}

                        </div>

                    )
                }

                <div className="profile-user-info">

                    <h1>{fullName}</h1>

                    <p>{user.email}</p>

                    <span className="profile-role">
                        {user.role || "Member"}
                    </span>

                </div>

            </div>

            <div className="profile-header-right">

                <div className="profile-badge">

                    <h3>The Muscle Lab</h3>

                    <p>
                        Manage your personal information
                        and keep your account up to date.
                    </p>

                </div>

            </div>

        </div>
    );

}

export default ProfileHeader;