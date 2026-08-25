import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { FaEyeSlash } from "react-icons/fa";  //<FaEyeSlash /> cloased eye
import { FaEye } from "react-icons/fa";  // <FaEye /> open eye
import { FcGoogle } from "react-icons/fc"; //google icon for signup with gopgle
import axios from 'axios';
import { serverUrl } from '../config.js';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app,auth } from '../../firebase.js';
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/UserSlice.js';

export default function Signup() {
   const primarycolor="#ff4f0f"
   const hovercolor="#e64323"
   const bgcolor="#e6ffff"
   const bordercolor="#ddd"

   const navigate = useNavigate();
    
   const [showPassword, setshowPassword]=useState(false);
   const [role,setRole]=useState('user')
   const [Fullname,setFullname]=useState('')  
   const [Email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [mobile,setMobile]=useState('')
    const [error,setError]=useState('')
    const [loading,setLoading]=useState(false)
    const dispatch=useDispatch() //hook provided by redux

   const getErrorMessage = (err) => {
     return err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Something went wrong';
   };
   
   const handleSignup = async (e) => {
     e.preventDefault();
     console.log('Signup payload:', { Fullname, Email, password, mobile, role });
     setLoading(true) //jb request gyi loading start
     try {
       const result = await axios.post(
         `${serverUrl}/api/auth/signup`,
         { Fullname, Email, password, mobile, role },
         { withCredentials: true }
       );
       console.log('Signup success:', result.data);
       dispatch(setUserData(result.data))
       navigate('/login');
       setLoading(false) //response aa gya loading stop
     } catch (err) {
       const message = getErrorMessage(err); //geterror msg function is defined above
       setError(message);
       console.log('Signup request failed:', message);
       console.log('Response data:', err.response?.data);
       console.log('Response status:', err.response?.status);
     }
   }

   const handleGoogleAuth=async ()=>{
    if(!mobile){
      return setError('Mobile NUmber is required');
    }

    const provider=new GoogleAuthProvider()
    const result=await signInWithPopup(auth,provider);
    console.log(result);
    try{
      
      //data ko hum as a object mai le rhe hai 
       const {data} = await axios.post(
         `${serverUrl}/api/auth/google-auth`,
         { Fullname:result.user.displayName, Email:result.user.email,mobile,role },
         { withCredentials: true }
       );  
       console.log(data);
         dispatch(setUserData(data))
       setError(' ')
    }catch(err){
       const message = getErrorMessage(err);
       setError(message);
       console.log('Signup request failed:', message);
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


     {/* FullName */}
      <div className="mb-4">
        <label htmlFor="Fullname" className='block text-gray-700 font-bold mb-2'>Full Name</label>
        <input type="text" value={Fullname} id="FullName" placeholder='Enter your full name' 
        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-20-orange-500' 
        onChange={(e)=>setFullname(e.target.value)}
        />
      </div>
    
      
      {/* Email */}
      <div className="mb-4">
        <label htmlFor="Email" className='block text-gray-700 font-bold mb-2'>Email</label>
        <input type="email" value={Email} id="Email" placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)}
        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' style={{border:`10px solid ${bordercolor} `}} />
      </div>
     

            <div className="mb-4">
        <label htmlFor="mobile" className='block text-gray-700 font-bold mb-2'>Mobile Number</label>
        <div className='relative'>
        <input type="number" value={mobile} onChange={(e)=>setMobile(e.target.value)} id="mobile" placeholder='Enter your Mobile Number' className='w-full px-3 py-2 border rounded-lg'  style={{border:`10px solid ${bordercolor} `}} />
         </div>
       
      </div>
      
      {/* password */}
      <div className="mb-4">
        <label htmlFor="password" className='block text-gray-700 font-bold mb-2'>Password</label>
        <div className='relative'>
        <input type={showPassword?'text' : 'password'} value={password} onChange={(e)=>setPassword(e.target.value)} id="password" placeholder='Enter your Password' className='w-full rounded-lg border border-gray-300 px-3 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500' />
       <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} className='absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-600 hover:bg-orange-50 hover:text-[#ff4d2d]' onClick={()=>setshowPassword((prev)=>!prev)}>{!showPassword?<FaEye/> : <FaEyeSlash/>} </button>
        </div>
       
      </div>

         {/* Role */}
       <div className="mb-4">
        <label htmlFor="Role" className='block text-gray-700 font-bold mb-2'>Role</label>
        <div className='relative flex gap-3'>
        {["user","owner","deliveryBoy"].map((r)=>(
          <button className= 'flex-1 cursor-pointer border-2 rounded-lg text-lg px-4 py-4 '
          onClick={()=>setRole(r)}
          style={
            //this 'role' is from usestate and 'r' is from map function
          role==r?{ backgroundColor: primarycolor,color:"white" ,border:"1px solid orange" }: {border:"1px solid black",color:"black"} }
          
          > 
             {r}</button>
        ))}
          </div>
       
      </div>
 

      <p className='text-red-500 text-center'>*{error}</p>
{/* w-40 mx-auto block */}
{/*signup btn*/}
{/* w-40 mx-auto block */}
    
      <button 
        className='text-2xl  w-full  mt-2 font-semibold text-white bg-orange-500 hover:bg-orange-700 py-2 px-4 rounded-lg'
       onClick={handleSignup} disabled={loading}
       >
        {loading?<ClipLoader size={20}/>:"SignUp" }
        Signup
      </button>
    
     

     {/* Sign Up with Google*/}
     <button className=' w-full flex items-center justify-center gap-2 mt-4 rounded-lg py-3 hover:bg-blue-300 bg-#00cccc-400 '
     onClick={handleGoogleAuth}>
      {/* we use span just to wrap the text so that in future 
      we can apply css only to text not to icon
      */}
      <FcGoogle size={24}/> <span>Signup with Google</span> </button>
     
     <p className='flex items-center justify-center gap-2 mt-4'>
       Already have an Account ? <span className='text-[#ff4f0f] cursor-pointer'> <Link to="/login">sign In</Link> </span>
     </p>

      </div>
     
     
      
    </div>
  )
}
