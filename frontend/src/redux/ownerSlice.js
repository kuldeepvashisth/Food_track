import { createSlice } from "@reduxjs/toolkit";


const ownerSlice = createSlice({
  name: "owner",
  initialState:{
    myshopData:null,
    
  },
  reducers: {
    setMyShopData: (state, action) => {
      state.myshopData = action.payload;
    },
    setCity: (state, action) => {
      
      state.city = action.payload;
    }
  }
});

export const { setMyShopData } = ownerSlice.actions;
export const ownerReducer = ownerSlice.reducer;