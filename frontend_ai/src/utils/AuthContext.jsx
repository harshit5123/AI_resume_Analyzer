import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const login=localStorage.getItem("islogin");
  const userInfoData=localStorage.getItem("userInfo");

  const [isAuthenticated, setIsAuthenticated] = useState(login ? true : false);
  const [userinfo, setUserInfo] = useState(userInfoData ? JSON.parse(userInfoData) : null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userinfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;