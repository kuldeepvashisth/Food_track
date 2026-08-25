import React from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setMyShopData } from '../redux/ownerSlice';
import { serverUrl } from '../config.js';

function OwnerItemCard({ item }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async (itemId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/delete/${itemId}`,
        {
          withCredentials: true,
        }
      );

      dispatch(setMyShopData(result.data));
    } catch (err) {
      console.log('Error in deleting item:', err);
    }
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white transition duration-300 hover:shadow-xl hover:shadow-orange-100 sm:flex-row">

      {item.image ? (
        <img
          src={item.image}
          alt={item.Name}
          className="h-40 w-full bg-orange-50 object-cover sm:h-auto sm:w-40"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-orange-50 text-sm text-orange-400 sm:w-40">
          No image
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-5">

        <div>
          <div className="flex flex-wrap items-center gap-3">

            <h3 className="text-lg font-bold text-slate-800">
              {item.Name || 'Food item'}
            </h3>

            <span className="font-bold text-[#ff4d2d]">
              ₹{item.price}
            </span>

          </div>

          <div className="mt-3 flex items-center gap-2 text-xs">

            <span className="rounded-full bg-orange-50 px-2.5 py-1 font-medium capitalize text-orange-700">
              {item.category}
            </span>

            <span
              className={
                item.Foodtype === 'veg'
                  ? 'font-semibold text-emerald-600'
                  : 'font-semibold text-rose-600'
              }
            >
              {item.Foodtype}
            </span>

          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">

          <button
            type="button"
            aria-label={`Edit ${item.Name}`}
            title="Edit item"
            onClick={() => navigate(`/edit-item/${item._id}`)}
            className="rounded-xl bg-orange-50 p-2.5 text-[#ff4d2d] transition hover:bg-[#ff4d2d] hover:text-white"
          >
            <FiEdit2 size={18} />
          </button>

          <button
            type="button"
            aria-label={`Delete ${item.Name}`}
            title="Delete item"
            onClick={() => handleDelete(item._id)}
            className="rounded-xl bg-red-50 p-2.5 text-red-500 transition hover:bg-red-500 hover:text-white"
          >
            <FiTrash2 size={18} />
          </button>

        </div>
      </div>
    </article>
  );
}

export default OwnerItemCard;