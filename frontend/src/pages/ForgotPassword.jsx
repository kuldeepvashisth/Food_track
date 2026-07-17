import React, { useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa";  //<FaEyeSlash /> cloased eye
import { FaEye } from "react-icons/fa";  // <FaEye /> open eye
import axios from 'axios';
import { serverUrl } from '../config.js';

function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [Email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
      
     const [showPassword, setshowPassword]=useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const primarycolor = "#ff4f0f";
    const bordercolor = '#ddd';
    const navigate = useNavigate();

    const getErrorMessage = (err) => {
        return err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Something went wrong';
    };
   
   const handleSendOtp = async (e) => {
    try{
           const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { Email }, { withCredentials: true });
           console.log('send otp result:', result.data);
           setStep(2)
    }catch(error){
          const message = getErrorMessage(error);
          setError(message);
          console.log('send otp request failed:', message);
          console.log('Response data:', error.response?.data);
          console.log('Response status:', error.response?.status);
    }
   }


   const handleverifyOtp = async (e) => {
    try{
           const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { Email, otp }, { withCredentials: true });
           console.log('verify otp result:', result.data);
           setStep(3)
    }catch(error){
          const message = getErrorMessage(error);
          setError(message);
          console.log('verify otp request failed:', message);
          console.log('Response data:', error.response?.data);
          console.log('Response status:', error.response?.status);
    }
   }


   const handleResetPassword = async (e) => {
    if(newPassword!==confirmNewPassword){
        setError('New password and confirm new password do not match');
        return;
    }
    try{
           const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { Email, newPassword }, { withCredentials: true });
           console.log('reset password result:', result.data);
           navigate('/login')
    }catch(error){
          const message = getErrorMessage(error);
          setError(message);
          console.log('reset password request failed:', message);
          console.log('Response data:', error.response?.data);
          console.log('Response status:', error.response?.status);
    }
   }
   
    return (
        <>

            <div className='min-h-screen w-full flex items-center justify-center p-4'>
                <div className='bg-beige-400 rounded-xl shadow-lg w-full max-w-md p-8' style={{ border: '2px solid #ddd' }}>
                   <div className='flex items-center justify-center gap-1 mb-4'>
                       <button onClick={() => navigate('/Login')} className="mr-2 cursor-pointer"><IoMdArrowBack size={30}/></button>
                    <h1 className='text-2xl font-bold mb-2 text-center' style={{ color: '#ff4f0f' }}>Forgot Password</h1>

                 </div>
                <p className='text-red-500 text-center mb-3'>*{error}</p>

                {/* step 1 enter email */}
                {
                    step==1 && <div>
                     <div className="mb-4">
        <label htmlFor="Email" className='block text-gray-700 font-bold mb-2'>Email</label>
        <input type="email" value={Email} id="Email" placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value.trim())}
        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' style={{border:`10px solid ${bordercolor} `}} />
      </div>
                   
                   <button 
        type="submit"
        className='text-2xl  w-full  font-semibold text-white bg-orange-500 hover:bg-orange-700 py-2 px-4 rounded-lg'
        onClick={handleSendOtp}>
          Send OTP
      </button>

                        </div>
                }
                {/* step 2 enter & verify OTP */}

                 {
                    step==2  && <div>
                     <div className="mb-4">
        <label htmlFor="otp" className='block text-gray-700 font-bold mb-2'>OTP</label>
        <input type="text" value={otp} id="otp" placeholder='Enter your OTP' onChange={(e)=>setOtp(e.target.value)}
        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' style={{border:`10px solid ${bordercolor} `}} />
      </div>
                   
                   <button 
        type="submit"
        className='text-2xl  w-full  font-semibold text-white bg-orange-500 hover:bg-orange-700 py-2 px-4 rounded-lg'
        onClick={handleverifyOtp}>
          Verify OTP
      </button>

                        </div>
                }

                       {
                    step==3  && <div>
                     <div className="relative mb-4">
        <label htmlFor="New Password" className='block text-gray-700 font-bold mb-2'>New Password</label>
        <input type={showPassword?'text' : 'password'}  value={newPassword} id="New Password" placeholder='Enter your new password' onChange={(e)=>setNewPassword(e.target.value)}
        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' style={{border:`10px solid ${bordercolor} `}} 
        />  <button className='absolute right-3 top-3 mt-9 py-2 px-1 cursor-pointer' onClick={()=>setshowPassword((prev)=>!prev)}>{!showPassword?<FaEye/> : <FaEyeSlash/>} </button>
      </div>

        <div className="mb-4">
        <label htmlFor=" Confirm New Password" className='block text-gray-700 font-bold mb-2'>Confirm New Password</label>
        <input type="password" value={confirmNewPassword} id="Confirm New Password" placeholder='Confirm your new password' onChange={(e)=>setConfirmNewPassword(e.target.value)}
        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' style={{border:`10px solid ${bordercolor} `}} />
      </div>
                   
                   <button 
        type="submit"
        className='text-2xl  w-full  font-semibold text-white bg-orange-500 hover:bg-orange-700 py-2 px-4 rounded-lg'
        onClick={handleResetPassword}>
          Reset Password
      </button>

                        </div>
                }

                </div>

            </div>

        </>
    )
}

export default ForgotPassword
