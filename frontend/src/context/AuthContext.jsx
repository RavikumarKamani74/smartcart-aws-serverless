import React, { createContext, useContext, useEffect, useState } from "react";
import { Auth, Hub } from "aws-amplify";

// ✅ Named export so other files can import it directly
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Full Cognito user object
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      setUser(cognitoUser); // Keep the full user object
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    fetchUser(); // Check current session on load

    const listener = ({ payload: { event } }) => {
      switch (event) {
        case "signIn":
        case "tokenRefresh":
          fetchUser(); // Refresh user
          break;
        case "signOut":
          setUser(null);
          break;
        default:
          break;
      }
    };

    const unsubscribe = Hub.listen("auth", listener);
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use the AuthContext easily in components
export const useAuth = () => useContext(AuthContext);
