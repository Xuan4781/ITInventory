import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/socotec_img.png";
import {useDispatch, useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import {register, resetAuthSlice} from "../store/slices/authSlice"
import {toast} from "react-toastify";
import {Link, Navigate} from "react-router-dom"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()

  const {
    loading,
    error,
    message,
    isAuthenticated
  } = useSelector(state => state.auth)

  const navigateTo = useNavigate();
  const handleRegister = (e) =>{
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("email",email);
    data.append("password", password);
    dispatch(register(data));
  }

  useEffect(()=>{
    if(message){
      navigateTo(`/otp-verification/${email}`)
    }
    if(error){
      toast.error(error);
      dispatch(resetAuthSlice())
    }
  }, [dispatch, isAuthenticated, error, loading])

  if(isAuthenticated){
    return <Navigate to={"/"} />;
  }

  return <>
  
  <div className="flex flex-col justify-center md:flex-row h-screen">
    {/*Left Side*/}
    <div className="hidden w-full md:w-1/2 bg-gray-200 text-black md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
      <div>
        <div>
          <img src ={logo_with_title} alt="logo"/>
        </div>
        <p>Already Have Account? Sign in now.</p>
        <Link to={"/login"}>SIGN IN</Link>
      </div>
    </div>
    {/*Right Side */}

  </div>
  
  </>
};

export default Register;
