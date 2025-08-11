import React, { useEffect, useState } from "react";
import logo_with_title from "../assets/socotec_img.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/pip.svg";
import bookIcon from "../assets/laptop.svg";
import catalogIcon from "../assets/catalog.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";
import { useNavigate } from "react-router-dom";
import { Laptop } from "lucide-react";
import { useMsal } from "@azure/msal-react";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { instance } = useMsal();

  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  const { addNewAdminPopup, settingPopup } = useSelector((state) => state.popup);
  const { error, message, user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
  dispatch(logout()); // sets loggedOut: true + clears localStorage
  toast.info("Logged out successfully");

  instance.logoutRedirect({
    postLogoutRedirectUri: "/login",
  });
};



  useEffect(() => {
    if (error) toast.error(error);
    if (message) toast.success(message);
  }, [dispatch, error, message]);

  return (
    <>
      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-gray-200 text-white flex-col h-full`}
        style={{ position: "fixed", top: 0, left: 0, height: "100vh" }}
      >
        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="logo" />
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                className={`w-full py-2 font-medium bg-transparent rounded-md flex items-center space-x-2 ${
                  selectedComponent === "Dashboard" ? "bg-gray-300 text-black" : "text-black"
                }`}
                onClick={() => {
                  setSelectedComponent("Dashboard");
                  navigate("/dashboard");
                }}
              >
                <img src={dashboardIcon} alt="dashboard-icon" />
                <span>Dashboard</span>
              </button>

              <button
                className={`w-full py-2 font-medium bg-transparent rounded-md flex items-center space-x-2 ${
                  selectedComponent === "Devices" ? "bg-gray-300 text-black" : "text-black"
                }`}
                onClick={() => {
                  setSelectedComponent("Devices");
                  navigate("/devices");
                }}
              >
                <img src={bookIcon} alt="device-icon" />
                <span>Devices</span>
              </button>

              <button
                className={`w-full py-2 font-medium bg-transparent rounded-md flex items-center space-x-2 ${
                  selectedComponent === "Catalog" ? "bg-gray-300 text-black" : "text-black"
                }`}
                onClick={() => {
                  setSelectedComponent("Catalog");
                  navigate("/catalog");
                }}
              >
                <img src={catalogIcon} alt="catalog-icon" />
                <span>Catalog</span>
              </button>

              <button
                className={`w-full py-2 font-medium bg-transparent rounded-md flex items-center space-x-2 ${
                  selectedComponent === "Users" ? "bg-gray-300 text-black" : "text-black"
                }`}
                onClick={() => {
                  setSelectedComponent("Users");
                  navigate("/users");
                }}
              >
                <img src={usersIcon} alt="users-icon" />
                <span>Users</span>
              </button>

              <button
                className="w-full py-2 font-medium bg-transparent rounded-md flex items-center space-x-2 text-black"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="w-6 h-6" />
                <span>Add New Admin</span>
              </button>

              <button
                className="w-full py-2 font-medium bg-transparent rounded-md flex items-center space-x-2 text-black"
                onClick={() => navigate("/borrowed-peripherals")}
              >
                <span>Borrowed Peripherals</span>
              </button>

              <button
                className="w-full py-2 font-medium bg-transparent rounded-md flex items-center space-x-2 text-black"
                onClick={() => navigate("/manage-requests")}
              >
                <span>Manage Requests</span>
              </button>
            </>
          )}

          {isAuthenticated && user?.role === "User" && (
            <>
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md flex items-center space-x-2 text-black"
                onClick={() => navigate("/my-requests")}
              >
                <span>My Requests</span>
              </button>

              <button
                className="w-full py-2 font-medium bg-transparent rounded-md flex items-center space-x-2 text-black"
                onClick={() => {
                  setIsSideBarOpen(false);
                  navigate("/request-peripheral");
                }}
              >
                <span>Request Peripheral</span>
              </button>
            </>
          )}
        </nav>

        <div className="px-6 py-4">
          <button
            className="py-2 font-medium bg-transparent rounded-md flex items-center justify-center space-x-5 mx-auto w-fit text-black"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="logout-icon" />
            <span>Log Out</span>
          </button>
        </div>

        <img
          src={closeIcon}
          alt="close-sidebar"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="absolute top-0 right-4 mt-4 block md:hidden cursor-pointer"
        />
      </aside>

      {addNewAdminPopup && <AddNewAdmin />}
    </>
  );
};

export default SideBar;
