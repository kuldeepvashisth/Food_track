import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { GiForkKnifeSpoon } from 'react-icons/gi';
import { FiMapPin, FiRefreshCw, FiStar } from 'react-icons/fi';

import { categories } from '../Category.js';
import CategoryCard from './CategoryCard.jsx';
import UseGetShopbyCity from '../hooks/UseGetShopbyCity.jsx';
import FoodCard from './FoodCard.jsx';

function UserDashboard() {
  const { userData, currentCity, shopsInMyCity, itemsInMyCity } = useSelector((state) => state.user);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const nearbyShops = shopsInMyCity || [];
  const nearbyItems = itemsInMyCity || [];

  const visibleItems = nearbyShops.flatMap((shop) =>
    (shop.items || [])
      .filter((item) => selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase())
      .map((item) => ({ ...item, shopName: shop.name }))
  );

  return (
    <main className='min-h-screen w-full min-w-0 overflow-x-hidden bg-[#fff9f6] px-4 pb-14 pt-24 sm:px-6'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-8'>
        <section className='relative overflow-hidden rounded-[2rem] bg-[#261b18] px-6 py-9 text-white shadow-xl shadow-orange-100 sm:px-10'>
          <div className='relative z-10 max-w-2xl'>
            <p className='mb-3 flex items-center gap-2 text-sm font-semibold text-orange-200'><FiMapPin /> Delivering near {currentCity || 'you'}</p>
            <h1 className='text-3xl font-black tracking-tight sm:text-5xl'>
              Good food, <span className='text-[#ff7658]'>close to home.</span></h1>
            <p className='mt-4 max-w-lg text-sm leading-6 text-orange-100'>Explore fresh menus from local shops around {currentCity || 'your location'}.</p>
          </div>
          <GiForkKnifeSpoon className='absolute -bottom-7 right-6 h-44 w-44 rotate-12 text-[#ff4d2d]/20 sm:right-16 sm:h-56 sm:w-56' />
        </section>

        <section>
          <div className='mb-4 flex items-end justify-between gap-3'>
            <div><p className='text-sm font-semibold text-[#ff4d2d]'>Start with a craving</p><h2 className='text-2xl font-bold text-slate-800'>Inspiration for your first order</h2></div>
          </div>
          <div className='flex gap-4 overflow-x-auto pb-3'>
            {categories.map((item, index) => <CategoryCard name={item.category} image={item.image} key={index}
              active={selectedCategory === item.category} onClick={() => setSelectedCategory(item.category)} />)}
          </div>
        </section>

        {/* <section>
          <div className='mb-4 flex items-center justify-between gap-3'>
            <div><p className='text-sm font-semibold text-[#ff4d2d]'>Local favourites</p><h2 className='text-2xl font-bold text-slate-800'>Popular near you</h2></div>
            <button type='button' onClick={() => window.location.reload()} className='flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-[#ff4d2d] hover:bg-orange-50'><FiRefreshCw /> Refresh</button>
          </div>
        </section> */}

        <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
          <h1 className='text-gray-800 text-2xl sm:text-3xl'>Best Shop in {currentCity}</h1>
          <section>
            <div className='mb-4 flex items-end justify-between gap-3'>
              <div><p className='text-sm font-semibold text-[#ff4d2d]'>Start with a craving</p><h2 className='text-2xl font-bold text-slate-800'>Inspiration for your first order</h2></div>
            </div>

            {/* nearby shopa ka card show krne ke lie */}
            {nearbyShops.length > 0 ? (
              <div className='flex gap-4 overflow-x-auto pb-3'>
                {nearbyShops.map((shop) => (
                  <CategoryCard
                    key={shop._id}
                    name={shop.name}
                    image={shop.image}
                  />
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-500'>
                No shops found in {currentCity || 'your city'}.
              </p>
            )}
          </section>

        </div>
        <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
          <h1 className='text-gray-800 text-2xl sm:text-3xl'>
            suggested Food Items
          </h1>
          <div className='w-full h-auto max-w-6xl flex flex-col flex-wrap gap-5 items-start p-[10px] justify-center'>

            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              {nearbyItems
                .filter((item) => selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase())
                .map((item) => <FoodCard key={item._id} data={item} />)}
                </div>
              
              
            </div>
          </div>

        </div>
    </main>
  )
}

export default UserDashboard

/*
 const { userData, currentCity } = useSelector((state) => state.user);
    return <main className='w-full min-h-screen bg-[#fff9f6] px-4 pb-12 pt-28'>
      <section className='mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-[#ff4d2d] to-[#ff754d] px-6 py-9 text-white shadow-xl shadow-orange-200 sm:px-9'>
        <div className='flex items-center gap-4'>
        <span className='flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20'>
        <GiForkKnifeSpoon className='h-8 w-8' /></span>
        <div>
        <p className='text-sm font-medium text-white/80'>Food delivery made simple</p>
        <h1 className='text-2xl font-bold sm:text-3xl'>
        Hello, {userData?.Name || 'Foodie'}!</h1>
        </div>
        </div>
        <p className='mt-5 max-w-xl text-sm leading-6 text-white/90'>
        Discover delicious food from restaurants{currentCity ? ` near ${currentCity}` : ' near you'}.
        </p>
      </section>
      <section className='mx-auto mt-7 max-w-6xl rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-lg shadow-orange-100/60'>
        <GiForkKnifeSpoon className='mx-auto h-11 w-11 text-[#ff4d2d]' /><h2 className='mt-3 text-xl font-bold text-slate-800'>Find your next favourite meal</h2>
        <p className='mt-2 text-sm text-slate-500'>Use the search bar above to explore food available in your city.</p>
      </section>
    </main>
*/


/*
 {isLoading && <div className='rounded-2xl border border-orange-100 bg-white p-8 text-center text-slate-500'>Finding shops near you...</div>}
          {!isLoading && !nearbyShops.length && <div className='rounded-2xl border border-orange-100 bg-white p-8 text-center'><GiForkKnifeSpoon className='mx-auto mb-3 h-10 w-10 text-[#ff4d2d]' /><p className='font-semibold text-slate-800'>No shops found in {currentCity || 'your city'} yet.</p><p className='mt-1 text-sm text-slate-500'>Try again after local restaurants add their menus.</p></div>}
          {!isLoading && nearbyShops.length > 0 && !visibleItems.length && <div className='rounded-2xl border border-orange-100 bg-white p-8 text-center text-slate-500'>No {selectedCategory.toLowerCase()} items are available nearby.</div>}
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {visibleItems.map((item) => <article key={item._id} className='overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg'>
              {item.image ? <img src={item.image} alt={item.Name} className='h-48 w-full object-cover' /> : <div className='flex h-48 items-center justify-center bg-orange-50'><GiForkKnifeSpoon className='h-12 w-12 text-orange-200' /></div>}
              <div className='p-4'><div className='flex items-start justify-between gap-3'><div><h3 className='font-bold text-slate-800'>{item.Name}</h3><p className='mt-1 text-xs text-slate-500'>{item.shopName}</p></div><span className='flex items-center gap-1 text-xs font-semibold text-amber-500'><FiStar /> 4.8</span></div><div className='mt-4 flex items-center justify-between'><span className='font-bold text-slate-800'>₹{item.price}</span><span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.Foodtype === 'veg' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{item.Foodtype}</span></div></div>
            </article>)}
          </div>
*/