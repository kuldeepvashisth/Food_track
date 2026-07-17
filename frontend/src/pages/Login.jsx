import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEyeSlash } from "react-icons/fa";  //<FaEyeSlash /> cloased eye
import { FaEye } from "react-icons/fa";  // <FaEye /> open eye
import { FcGoogle } from "react-icons/fc"; //google icon for signup with gopgle
import axios from 'axios';
import { serverUrl } from '../config.js';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { ClipLoader } from 'react-spinners'

export default function Login() {
   const primarycolor="#ff4f0f"
   const hovercolor="#e64323"
   const bgcolor="#e6ffff"
   const bordercolor="#ddd"

    
   const [showPassword, setshowPassword]=useState(false); 
   const [Email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [error,setError]=useState('')
    const [loading,setLoading]=useState(false)

   const getErrorMessage = (err) => {
     return err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Something went wrong';
   };
  
   
   const handleLogin = async (e) => {
     e.preventDefault();
     setLoading(true); 
     setError('');
     console.log('LOgin payload:', { Email, password,});
     try {
       const result = await axios.post(
         `${serverUrl}/api/auth/login`,
         { Email, password  },
         { withCredentials: true }
       );
       console.log('Login success:', result.data);
     } catch (err) {
       const message = getErrorMessage(err);
       setError(message);
       console.log('Login request failed:', message);
       console.log('Response data:', err.response?.data);
       console.log('Response status:', err.response?.status);
     } finally {
       setLoading(false);
     }
   }

    const handleGoogleAuth=async ()=>{
 
       const provider=new GoogleAuthProvider()
       const result=await signInWithPopup(auth,provider);
       console.log(result);
       try{
         
          const {data} = await axios.post(
            `${serverUrl}/api/auth/google-auth`,
            { Email:result.user.email},
            { withCredentials: true }
          );  
          console.log(data);
       }catch(err){
          const message = getErrorMessage(err);
          setError(message);
          console.log('SignIn request failed:', message);
          console.log('Response data:', err.response?.data);
          console.log('Response status:', err.response?.status);
       }
      }
  
   return (
    // 1st div is for complete display 
    <div className='min-h-screen w-full flex items-center justify-center p-4' 
    style=
    {{
      backgroundColor: `${bgcolor}`
    }}>
      {/* 2nd div is for signup card */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 "  
      style={{
        border: `2px solid ${bordercolor}`
      }}>
      
      {/* text-center:wrt to its parents width */}
     <h1 className={`text-3xl font-bold mb-6 text-center`} style={{ color:primarycolor}}>  FoodTrack   </h1>
     <p className='text-black mb-8 text-center text-2xl'> Create your Account</p>

    
      
      {/* Email */}
      <div className="mb-4">
        <label htmlFor="Email" className='block text-gray-700 font-bold mb-2'>Email</label>
        <input type="email" value={Email} id="Email" placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)}
        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' style={{border:`10px solid ${bordercolor} `}} />
      </div>
     
      
      {/* password */}
      <div className="mb-4">
        <label htmlFor="password" className='block text-gray-700 font-bold mb-2'>Password</label>
        <div className='relative'>
        <input type={showPassword?'text' : 'password'} value={password} onChange={(e)=>setPassword(e.target.value)} id="password" placeholder='Enter your Password' className='w-full px-3 py-2 border rounded-lg'  style={{border:`10px solid ${bordercolor} `}} />
       <button className='absolute right-3 top-3 py-2 px-1 cursor-pointer' onClick={()=>setshowPassword((prev)=>!prev)}>{!showPassword?<FaEye/> : <FaEyeSlash/>} </button>
        </div>
       
      </div>


      
      {/*Forgot password */}
    <div className='flex items-center justify-end mb-4'>
      <Link to="/forgot-password" className='text-[#ff4f0f] cursor-pointer'>Forgot Password</Link>
    </div>

  
      <p className='text-red-500 text-center mb-3'>*{error}</p>

      {/* Login button */}
     
      <button 
        type="button"
        className='text-2xl w-full mt-2 font-semibold text-white bg-orange-500 hover:bg-orange-700 py-2 px-4 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed'
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? <div className='flex items-center justify-center'><ClipLoader size={20} color='white'/></div> : 'Login'}
      </button>
     
     <button className=' w-full flex items-center justify-center gap-2 mt-4 rounded-lg py-3 hover:bg-blue-300 bg-#00cccc-400 '
     onClick={handleGoogleAuth}
     >
      {/* we use span just to wrap the text so that in future 
      we can apply css only to text not to icon
      */}
      <FcGoogle size={24}/> <span>Login with Google</span> </button>
     
     <p className='flex items-center justify-center gap-2 mt-4'>
      Want to Create new Account ? <span className='text-[#ff4f0f] cursor-pointer'> <Link to="/signup">sign Up</Link> </span>
     </p>

      </div>
     
     
      
    </div>
  )
}





