import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  Register,
  Login,
  Dashboard,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
} from "./containers";
import jwt_decode from "jwt-decode";

const App = () => {
  const loggedIn = () => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwt_decode(token);
      if (user) return true;
    }

    return false;
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              loggedIn ? (
                <Navigate replace to="/dashboard" />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {loggedIn && <Route path="/dashboard" element={<Dashboard />} />}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
