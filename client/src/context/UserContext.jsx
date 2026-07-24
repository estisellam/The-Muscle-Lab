import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../services/userService";

const UserContext = createContext();

export function UserProvider({ children }) {

    const [user, setUser] = useState(null);

    async function refreshUser() {

        try {

            const profile = await getProfile();

            setUser(profile);

        }

        catch (error) {

            console.error(error);

        }

    }

    useEffect(() => {

        refreshUser();

    }, []);

    return (

        <UserContext.Provider
            value={{
                user,
                setUser,
                refreshUser
            }}
        >

            {children}

        </UserContext.Provider>

    );

}

export function useUser() {

    return useContext(UserContext);

}