import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header"

const Users = () => {
  const {users} = useSelector(state => state.user)

  const formatDate = (timeStamp)=>{
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear())}`;
    const formattedTime = `${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}:${String(date.getSeconds()).padStart(2,"0")}`;
    const result = `${formattedDate} ${formattedTime}`;
    return result
    
    
  }
  const result = formatDate("2025-02-11T12:49:11.961+00:00")
  
  return <>
  <main className="relative flex-1 p-6 pt-28">
    <Header/>
  </main>
  </>;
};

export default Users;
