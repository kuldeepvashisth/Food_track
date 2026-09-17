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
    cartItems:[],
    totalAmount:0,
    myOrders:[],
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

      state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0) //sum+i.price*i.quantity --> jo i th item ki quantity hai  
      console.log(state.cartItems);
      
      },
      
      updateQunatity: (state, action) => {
        const { id, quantity } = action.payload;
        const item = state.cartItems.find(item => item.id === id);

        if (item) {
          item.quantity = Math.max(0, item.quantity + quantity);
        }
         state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
      
      },

      removeCartItem: (state, action) => {
        state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
         state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
      
      },
        setMyOrders: (state, action) => {
        state.myOrders = action.payload;
      },
      addMyOrder: (state, action) => {
      //  unshift() method adds the new order to the beginning of the myOrders array
        state.myOrders.unshift(action.payload);
      },
     updatOrderStatus: (state, action) => {
  const { orderId, shopId, status } = action.payload;

  const order = state.myOrders.find(
    order => order._id === orderId
  );

  const shopOrder = order?.shopOrders?.find(
    shopOrder => shopOrder._id === shopId
  );

  if (shopOrder) {
    shopOrder.status = status;
  }
}
  }
});

export const { setUserData,setcurrentCity,setcurrentState,
  setcurrentAddress,setShopInMyCity,setItemsInMyCity,addToCart,updateQunatity,removeCartItem,setMyOrders,addMyOrder,updatOrderStatus} = userSlice.actions;
export const userReducer = userSlice.reducer;