import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getCurrentUser,
    getToken,
    logout,
} from "../services/authService";

const AuthContext = createContext(null);

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = getToken();

        if (token) {

            setUser(getCurrentUser());

        }

        setLoading(false);

    }, []);

    function signOut() {

        logout();

        setUser(null);

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                signOut,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

function useAuth() {

    return useContext(AuthContext);

}

export {
    AuthProvider,
    useAuth,
};