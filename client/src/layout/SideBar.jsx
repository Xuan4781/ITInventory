import React, { useEffect } from "react";
import logo_with_title from "../assets/socotec_img.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/pip.svg";
import bookIcon from "../assets/laptop.svg";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/gear-fill.svg";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector} from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import {toast} from "react-toastify";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";


const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const { addNewAdminPopup } = useSelector(state => state.popup);
  const { loading, error, message, user, isAuthenticated} = useSelector(state => state.auth);

  const handleLogout = ()=> {
    dispatch(logout());
  };

  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if(message){
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  },[dispatch, isAuthenticated, error, loading, message]);


  return (<>
    <aside className= {`${isSideBarOpen ? "left-0" : "-left-full"} z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-gray-200 text-white flex-col h-full`}
    style={{position:"fixed"}}
    >
      <div className="px-6 py-4 my-8">
        <img src={logo_with_title} alt="logo"/>
      </div>
      <nav className="flex-1 px-6 space-y-2">
        <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2" onClick={()=> setSelectedComponent("Dashboard")}>
          <img src={dashboardIcon} alt="dashboard-icon"/>
          <span className="text-black">Dashboard</span>
        </button>
        <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2" onClick={()=> setSelectedComponent("Devices")}>
          <img src={bookIcon} alt="device-icon"/>
          <span className="text-black">Devices</span>
        </button>
        {
          //isAuthenticated && user?.role === "Admin" && (
          <>
            <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2" onClick={()=> setSelectedComponent("Catalog")}>
              <img src={catalogIcon} alt="device-icon"/>
              <span className="text-black">Catalog</span>
            </button>
            <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2" onClick={()=> setSelectedComponent("Users")}>
              <img src={usersIcon} alt="device-icon"/>
              <span className="text-black">Users</span>
            </button>
            <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"  onClick={()=> dispatch(toggleAddNewAdminPopup())} >
              <RiAdminFill className="w-6 h-6"/> <span>Add New Admin</span>
            </button>
          </>
          //)
          }
          {isAuthenticated && user?.role === "User" && (
            <>
            <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2" onClick={()=> setSelectedComponent("My Borrowed Books")}>
              <img src={catalogIcon} alt="icon"/>
              <span className="text-black">My Borrowed Books</span>
            </button>
            </>
          )}
          <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2" onClick={()=> setSelectedComponent("My Borrowed Books")}>
              <img src={settingIcon} alt="icon"/>
              <span className="text-black">Update Credentials </span>
            </button>
      </nav>
      <div className="px-6 py-4">
        <button className="py-2 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex items-center justify-center space-x-5 mx-auto w-fit" onClick={handleLogout}>
          <img src={logoutIcon} alt="icon"/>
        <span>Log Out</span>
      </button>
      </div>
      <img src={closeIcon} alt="icon" onClick={()=> 
        setIsSideBarOpen(!isSideBarOpen)} className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden"/>
    </aside>
    {addNewAdminPopup && <AddNewAdmin/>}
    </>
  );
};

export default SideBar;
