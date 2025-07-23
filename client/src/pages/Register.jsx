import React, { useEffect, useState } from "react";
import logo from "../assets/socotec_img.png";
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
      <div className="text-center h-[376px]">
        <div className="flex justify-center mb-12">
          <img src ={logo_with_title} alt="logo" className="mb-12 h-44 w-auto"/>
        </div>
        <p className="text-black-300 mb-12">Already Have Account? Sign in now.</p>
        <Link to={"/login"} className="border-2 rounded-lg font-semibold border-black py-2 px-8 hover:bg-black hover:text-white transition">SIGN IN</Link>
        
      </div>
    </div>
    {/*Right Side */}
    <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-12">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5">
            <h3 className="font-medium text-4xl overflow-hidden">Sign Up</h3>
            <img src={logo} alt="logo" className="h-auto w-24 object-cover"/>
          </div>
        </div>



          <p></p>




          
      </div>
    </div>

  </div>
  
  </>
};

export default Register;
