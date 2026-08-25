import React from 'react';
import { useSelector } from 'react-redux';
import { GiForkKnifeSpoon } from 'react-icons/gi';
import { FiEdit, FiMapPin, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from './OwnerItemCard';

function OwnerDashboard() {
  const { myshopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  const shopItems = Array.isArray(myshopData?.items) ? myshopData.items : [];

  

  if (!myshopData) {
    return (
      <main className='min-h-screen bg-[#fff9f6] px-4 pt-28'>
        <section className='mx-auto flex min-h-[65vh] max-w-lg items-center'>
          <div className='w-full rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-xl shadow-orange-100/60'>
            <span className='mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff4d2d]/10'><GiForkKnifeSpoon className='h-9 w-9 text-[#ff4d2d]' /></span>
            <h1 className='text-2xl font-bold text-slate-800'>Create your food shop</h1>
            <p className='mt-2 text-sm leading-6 text-slate-500'>Set up your shop profile first, then start building a menu customers will love.</p>
            <button onClick={() => navigate('/create-edit-shop')} className='mt-6 rounded-xl bg-[#ff4d2d] px-5 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-[#e83f23]'>Get started</button>
          </div>
        </section>
      </main>
    );
  } 

  return (
    <main className='min-h-screen bg-[#fff9f6] pb-12 pt-28'>
      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6'>
        <header className='mb-8 rounded-3xl bg-gradient-to-r from-[#ff4d2d] to-[#ff754d] px-6 py-8 text-white shadow-xl shadow-orange-200 sm:px-9'>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-white/80'>Owner dashboard</p>
          <div className='mt-3 flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20'><GiForkKnifeSpoon className='h-7 w-7' /></span>
              <div><h1 className='text-2xl font-bold sm:text-3xl'>Welcome, {myshopData.name}</h1><p className='mt-1 text-sm text-white/85'>Here’s your shop and menu at a glance.</p></div>
            </div>
            <button onClick={() => navigate('/add-item')} className='inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#f04a2d] transition hover:bg-orange-50'><FiPlus /> Add food item</button>
          </div>
        </header>

        <div className='space-y-7'>
          <section className='relative flex flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-lg shadow-orange-100/60 md:flex-row'>
            {myshopData.image ? <img src={myshopData.image} alt={myshopData.name} className='h-52 w-full bg-orange-50 object-cover md:h-64 md:w-2/5 lg:w-[38%]' /> : <div className='flex h-52 w-full items-center justify-center bg-orange-50 text-orange-400 md:h-64 md:w-2/5 lg:w-[38%]'>No shop image</div>}
            <button aria-label='Edit shop' onClick={() => navigate('/create-edit-shop')} className='absolute right-4 top-4 rounded-xl bg-white p-2.5 text-[#ff4d2d] shadow-md transition hover:bg-orange-50'><FiEdit size={18} /></button>
            <div className='flex flex-1 flex-col justify-center p-6 sm:p-8'><p className='text-xs font-bold uppercase tracking-[0.16em] text-[#ff4d2d]'>Your shop</p><h2 className='mt-2 text-2xl font-bold text-slate-800'>{myshopData.name}</h2><p className='mt-4 flex max-w-xl gap-2 text-sm leading-6 text-slate-500'><FiMapPin className='mt-1 shrink-0 text-[#ff4d2d]' /> <span>{myshopData.address}, {myshopData.city}, {myshopData.state}</span></p></div>
          </section>

          <section className='min-h-[420px] rounded-3xl border border-orange-100 bg-white p-5 shadow-lg shadow-orange-100/50 sm:p-6'>
            <div className='flex items-start justify-between gap-4'><div><p className='text-xs font-bold uppercase tracking-[0.16em] text-[#ff4d2d]'>Menu</p><h2 className='mt-1 text-2xl font-bold text-slate-800'>Your food items</h2><p className='mt-1 text-sm text-slate-500'>{shopItems.length} {shopItems.length === 1 ? 'item' : 'items'} on your menu</p></div><button onClick={() => navigate('/add-item')} className='rounded-xl bg-[#ff4d2d]/10 p-3 text-[#ff4d2d] transition hover:bg-[#ff4d2d] hover:text-white'><FiPlus size={20} /></button></div>
            {shopItems.length ? <div className='mt-6 space-y-4'>{shopItems.map((item) => <OwnerItemCard key={item._id} item={item} />)}</div> : <div className='mt-6 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-8 text-center'><GiForkKnifeSpoon className='mx-auto h-10 w-10 text-[#ff4d2d]' /><h3 className='mt-3 font-bold text-slate-800'>Your menu is empty</h3><p className='mt-1 text-sm text-slate-500'>Add your first delicious item to get started.</p><button onClick={() => navigate('/add-item')} className='mt-5 rounded-xl bg-[#ff4d2d] px-4 py-2.5 text-sm font-semibold text-white'>Add first item</button></div>}
          </section>
        </div>
      </div>
    </main>
  );
}

export default OwnerDashboard;
