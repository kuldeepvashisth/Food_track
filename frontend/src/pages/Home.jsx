import React from "react";
import { useSelector } from 'react-redux';
import UserDashboard from '../components/UserDashboard';
import OwnerDashboard from '../components/OwnerDashboard';
import DeliveryBoy from '../components/DeliveryBoy';
import Nav from "../components/Nav";

const Home = () => {
  const userData = useSelector((state) => state.user?.userData);
  const role = userData?.role;

  return (
    
    <div className='min-h-screen w-full overflow-x-hidden bg-[#fff9f7]'>
      <Nav />
      {role === 'user' && <UserDashboard />}
      {role === 'owner' && <OwnerDashboard />}
      {role === 'deliveryBoy' && <DeliveryBoy />}
    </div>
    
  );
};

export default Home
