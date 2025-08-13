import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMsal } from "@azure/msal-react";
import { ToastContainer } from "react-toastify";
import { getAccessToken } from "./utils/getAccessToken";

import { setUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";
import { fetchAllBorrowedBooks, fetchUserBorrowedBooks } from "./store/slices/borrowSlice";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RequestsPeripherals from "./components/PeripheralRequests";
import ManageRequests from "./components/ManageRequests";
import AddPeripheralRequest from './components/AddPeripheralRequest';
import Dashboard from "./components/AdminDashboard";
import BookManagement from "./components/BookManagement";
import Catalog from "./components/Catalog";
import BorrowedPeripherals from "./components/BorrowedPeripherals";

const App = () => {
  const { user, isAuthenticated, loggedOut } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { accounts } = useMsal();

  // Sync MSAL accounts with Redux and fetch fresh accessToken
  useEffect(() => {
    const syncUser = async () => {
      if (accounts.length === 0 || isAuthenticated || loggedOut) return;

      const email = accounts[0].username;
      const role = ["boss@socotec.us", "admin@socotec.us", "angelagao04@gmail.com"].includes(email)
        ? "Admin"
        : "User";

      try {
        const accessToken = await getAccessToken();
        if (!accessToken) return;

        localStorage.setItem("accessToken", accessToken);
        dispatch(setUser({ user: { email, role }, accessToken }));
      } catch (error) {
        console.error("Error acquiring token or syncing user:", error);
      }
    };

    syncUser();
  }, [accounts, isAuthenticated, loggedOut, dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />

        {/* Conditional routing for Manage Requests */}
        <Route
          path="/manage-requests"
          element={
            isAuthenticated
              ? user?.role === "Admin"
                ? <ManageRequests />
                : <RequestsPeripherals />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="/my-requests" element={isAuthenticated ? <RequestsPeripherals /> : <Navigate to="/login" replace />} />
        <Route path="/request-peripheral" element={isAuthenticated ? <AddPeripheralRequest /> : <Navigate to="/login" replace />} />
        <Route path="/devices" element={isAuthenticated ? <BookManagement /> : <Navigate to="/login" replace />} />
        <Route path="/catalog" element={isAuthenticated ? <Catalog /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/borrowed-peripherals" element={isAuthenticated ? <BorrowedPeripherals /> : <Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer theme="dark" />
    </Router>
  );
};

export default App;
