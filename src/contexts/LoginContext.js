import React, { useState, createContext } from "react";

import { initialFieldsData } from "../globals/data";

export const LoginContext = createContext();

export const LoginContextProvider = ({ children }) => {
  const [usersData, setUsersData] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignout, setIsSignout] = useState(false);
  const [fieldsData, setFieldsData] = useState(initialFieldsData);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [reportData, setReportData] = useState([]);
  const [reportDetails, setReportDetails] = useState([]);
  const [error, setError] = useState(false);
  const [errorBody, setErrorBody] = useState("");

  return (
    <LoginContext.Provider
      value={{
        usersData,
        setUsersData,
        token,
        setToken,
        isLoading,
        setIsLoading,
        isSignout,
        setIsSignout,
        fieldsData,
        setFieldsData,
        isSuccess,
        setIsSuccess,
        successMessage,
        setSuccessMessage,
        reportData,
        setReportData,
        reportDetails,
        setReportDetails,
        error,
        setError,
        errorBody,
        setErrorBody,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
