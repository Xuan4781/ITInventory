import React, { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";


const Header = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state)=> state.auth);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(()=>{
    const updateDateTime = ()=>{
      const now = new Date();

      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes}:${ampm}`);
      
      const options = {month: "short", day: "numeric", year:"numeric"};
      setCurrentDate(now.toLocaleDateString("en-US", options))
    };
    updateDateTime();

    const intervalId = setInterval(updateDateTime, 1000);

    return ()=> clearInterval(intervalId);
  }, [])
  return <>
  <header
  className="bg-white shadow-md flex justify-between items-center px-6"
  style={{
    position: "fixed",
    top: 0,
    left: 256,                  // Push header right after sidebar
    width: "calc(100% - 256px)",// Fill remaining width
    height: 60,                 // fixed height to avoid overlap
    zIndex: 50,
  }}
  >
    {/*Left Side */}
    <div className="flex items-center gap-2">
      <img src={userIcon} alt="userIcon" className="w-8 h-8"/>
      <div className="flex flex-col">
        <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.name
            ? user.name
            : user?.email || "Unknown User"}
        </span>
        <span className="text-sm font-medium sm:text-lg sm:font-medium">{user?.role}</span>
      </div>



    </div>
    {/*Right Side*/}
    <div className="hidden md:flex items-center gap-2">
      <div className="flex flex-col text-sm lg:text-base items-end font-semibold">
        <span>{currentTime}</span>
        <span>{currentDate}</span>
      </div>
      <span className="bg-black h-14 w-[2px]"/>
    </div>

  </header>
  
  
  </>;
};

export default Header;
