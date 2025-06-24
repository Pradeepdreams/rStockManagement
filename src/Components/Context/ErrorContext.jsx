import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const ErrorContext = createContext();

export const errorDialog = () => {
  return useContext(ErrorContext);
};

export const ErrorDialogProvider = ({ children }) => {
  const navigate = useNavigate();

  const checkAuthError = (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <ErrorContext.Provider value={{ checkAuthError }}>
      {children}
    </ErrorContext.Provider>
  );
};
