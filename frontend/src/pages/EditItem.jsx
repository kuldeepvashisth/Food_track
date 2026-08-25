import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../config.js';
import { setMyShopData } from '../redux/ownerSlice.js';

const categories = [
  'snacks',
  'main course',
  'deserts',
  'Pizza',
  'Burgers',
  'South Indian',
  'North Indian',
  'chinese',
  'Fast food',
];

function EditItem() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentItem, setCurrentItem] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [foodType, setFoodType] = useState('veg');
  const [frontendImage, setFrontendImage] = useState('');
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getItemById = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/item/get-item/${itemId}`,
          { withCredentials: true }
        );
        const item = response.data;

        setCurrentItem(item);
        setName(item.Name || '');
        setPrice(item.price || '');
        setCategory(item.category || '');
        setFoodType(item.Foodtype || 'veg');
        setFrontendImage(item.image || '');
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not find this food item.');
      } finally {
        setLoading(false);
      }
    };

    getItemById();
  }, [itemId]);

  const handleImage = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setBackendImage(selectedFile);
    setFrontendImage(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('price', price);
      formData.append('category', category);
      formData.append('foodType', foodType);

      if (backendImage) {
        formData.append('image', backendImage);
      }

      const response = await axios.post(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMyShopData(response.data));
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update this food item.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className='min-h-screen bg-[#fff9f6] p-8 pt-28 text-center text-[#ff4d2d]'>Loading item...</main>;
  }

  if (error) {
    return <main className='min-h-screen bg-[#fff9f6] p-8 pt-28 text-center'><p className='text-red-600'>{error}</p><button onClick={() => navigate('/')} className='mt-4 font-semibold text-[#ff4d2d]'>Go back</button></main>;
  }

  return (
    <main className='min-h-screen bg-[#fff9f6] p-6'>
      <section className='mx-auto mt-12 max-w-lg rounded-2xl border border-orange-100 bg-white p-8 shadow-xl'>
        <button onClick={() => navigate('/')} className='text-sm font-semibold text-[#ff4d2d]'>← Back to dashboard</button>
        <h1 className='mt-4 text-3xl font-bold text-slate-900'>Edit Food Item</h1>

        <form onSubmit={handleSubmit} className='mt-6 space-y-5'>
          <label className='block text-sm font-medium text-slate-700'>Name<input required value={name} onChange={(event) => setName(event.target.value)} className='mt-1 w-full rounded-lg border px-4 py-2' /></label>
          <label className='block text-sm font-medium text-slate-700'>Food image<input type='file' accept='image/*' onChange={handleImage} className='mt-1 w-full rounded-lg border px-3 py-2' /></label>
          {frontendImage && <img src={frontendImage} alt={name} className='h-48 w-full rounded-lg object-cover' />}
          <label className='block text-sm font-medium text-slate-700'>Category<select required value={category} onChange={(event) => setCategory(event.target.value)} className='mt-1 w-full rounded-lg border px-4 py-2'>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className='block text-sm font-medium text-slate-700'>Food type<select value={foodType} onChange={(event) => setFoodType(event.target.value)} className='mt-1 w-full rounded-lg border px-4 py-2'><option value='veg'>Veg</option><option value='Non-veg'>Non-Veg</option></select></label>
          <label className='block text-sm font-medium text-slate-700'>Price<input required min='1' type='number' value={price} onChange={(event) => setPrice(event.target.value)} className='mt-1 w-full rounded-lg border px-4 py-2' /></label>
          <button disabled={saving} className='w-full rounded-lg bg-[#ff4d2d] py-3 font-semibold text-white disabled:opacity-60'>{saving ? 'Updating...' : 'Update item'}</button>
        </form>
      </section>
    </main>
  );
}

export default EditItem;
