import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import {
    getProfile,
    updateProfile,
    uploadProfileImage,
    changePassword,
} from "../../services/userService";

import "./Profile.css";

function Profile() {

    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({

        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        birth_date: "",
        gender: "",
        profile_image: ""

    });

    const [passwordData, setPasswordData] = useState({

        currentPassword: "",
        newPassword: "",
        confirmPassword: ""

    });

    const { refreshUser } = useUser();

    useEffect(() => {

        loadProfile();

    }, []);

    async function loadProfile() {

        try {

            const profile = await getProfile();

            setUser(profile);

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to load profile"

            );

        }

        finally {

            setLoading(false);

        }

    }

    function handleInputChange(event) {

        const { name, value } = event.target;

        setUser({

            ...user,

            [name]: value

        });

    }

    function handlePasswordChange(event) {

        const { name, value } = event.target;

        setPasswordData({

            ...passwordData,

            [name]: value

        });

    }

   async function handleImageSelect(event) {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {

            const response = await uploadProfileImage(file);

            await refreshUser();
            const profile = await getProfile();
            setUser(profile);

            toast.success("Profile image updated");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Upload failed"
            );

        }

    }

    async function handleSaveProfile() {

        try {

            const response = await updateProfile(user);

            await refreshUser();
            const profile = await getProfile();
            setUser(profile);

            toast.success(

                "Profile updated successfully"

            );

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Update failed"

            );

        }

    }

    async function handleChangePassword() {

        if (

            passwordData.newPassword !==

            passwordData.confirmPassword

        ) {

            toast.error(

                "Passwords do not match"

            );

            return;

        }

        try {

            await changePassword({

                currentPassword:

                    passwordData.currentPassword,

                newPassword:

                    passwordData.newPassword

            });

            toast.success(

                "Password updated successfully"

            );

            setPasswordData({

                currentPassword: "",

                newPassword: "",

                confirmPassword: ""

            });

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to update password"

            );

        }

    }

    if (loading) {

        return (

            <div className="profile-loading">

                Loading...

            </div>

        );

    }
    return (

    <div className="profile-page">

        <div className="profile-card">

            <div className="profile-top">

                <div className="profile-form">

                    <Input
                        label="First Name"
                        name="first_name"
                        value={user.first_name}
                        onChange={handleInputChange}
                    />

                    <Input
                        label="Last Name"
                        name="last_name"
                        value={user.last_name}
                        onChange={handleInputChange}
                    />

                    <Input
                        label="Email"
                        value={user.email}
                        disabled
                    />

                    <Input
                        label="Phone"
                        name="phone"
                        value={user.phone || ""}
                        onChange={handleInputChange}
                    />

                    <Input
                        label="Birth Date"
                        type="date"
                        name="birth_date"
                        value={
                            user.birth_date
                                ? user.birth_date.substring(0, 10)
                                : ""
                        }
                        onChange={handleInputChange}
                    />

                    <div className="gender-field">

                        <label>

                            Gender

                        </label>

                        <select
                            name="gender"
                            value={user.gender || ""}
                            onChange={handleInputChange}
                            className="gender-select"
                        >

                            <option value="">
                                Select Gender
                            </option>

                            <option value="Male">
                                Male
                            </option>

                            <option value="Female">
                                Female
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>

                </div>

                <div className="profile-image-section">

                    <img
                        className="profile-avatar"
                        src={
                            user.profile_image
                                ? `http://localhost:3000${user.profile_image}`
                                : "https://ui-avatars.com/api/?name=User"
                        }
                        alt="Profile"
                    />

                    <label className="upload-button">

                        Change Photo

                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                        />

                    </label>

                </div>

            </div>

            <div className="save-profile">

                <Button
                    onClick={handleSaveProfile}
                >
                    Save Changes

                </Button>

            </div>

            <div className="divider"></div>

            <div className="password-section">

                <h2>

                    Change Password

                </h2>

                <div className="password-grid">

                    <Input
                        label="Current Password"
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                    />

                    <Input
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                    />

                </div>

                <div className="save-password">

                    <Button
                        variant="purple"
                        onClick={handleChangePassword}
                    >

                        Update Password

                    </Button>

                </div>

            </div>

        </div>

    </div>

);

}

export default Profile;