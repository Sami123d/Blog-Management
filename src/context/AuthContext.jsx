import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null
  );

  // Save tokens & user to localStorage
  const saveAuth = (user, accessToken, refreshToken) => {
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  // Logout
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // Auto Refresh Token (every 10 minutes)
// Auto Refresh Token (every 1 minute)
const autoRefresh = async () => {
  console.log("🔄 Auto-refresh triggered...");

  if (!refreshToken) {
    console.log("⛔ No refresh token found, skipping refresh.");
    return;
  }

  try {
    console.log("📡 Sending refresh request...");
    const res = await fetch("http://localhost:5000/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();
    console.log("📥 Refresh response:", data);

    if (data.accessToken) {
      console.log("✅ New access token received!");
      saveAuth(user, data.accessToken, data.refreshToken);
    } else {
      console.log("❌ Refresh token invalid. Logging out...");
      logout();
    }
  } catch (err) {
    console.log("🚨 Token Refresh Error", err);
    logout();
  }
};

// Auto refresh every 1 minute
useEffect(() => {
  console.log("⏳ Auto-refresh interval started...");
  

  const interval = setInterval(() => {
    console.log("Auto refresh running... refreshToken =", refreshToken);
    autoRefresh();
  }, 0.5 * 60 * 1000); // 30 seconds

  return () => clearInterval(interval);
}, [refreshToken]);


  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        saveAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
