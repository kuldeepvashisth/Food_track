import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState:{
    userData:null,
    currentCity:null,
    currentState:null,
    currentAddress:null,
    shopsInMyCity:[],
    itemsInMyCity:[],
    cartItems:[]
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setcurrentCity: (state, action) => { 
      state.currentCity = action.payload;
    },
    setcurrentState: (state, action) => { 
      state.currentState = action.payload;
    },
    setcurrentAddress: (state, action) => { 
      state.currentAddress = action.payload;
    },
    setShopInMyCity: (state, action) => { 
      state.shopsInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => { 
      state.itemsInMyCity = action.payload;
    },
    addToCart: (state, action) => {
        const cartItem = action.payload;
        const existingItem = state.cartItems.find(item => item.id === cartItem.id);
      if(existingItem){
       existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      console.log(state.cartItems);
      
      }
  }
});

export const { setUserData,setcurrentCity,setcurrentState,
  setcurrentAddress,setShopInMyCity,setItemsInMyCity,addToCart} = userSlice.actions;
export const userReducer = userSlice.reducer;