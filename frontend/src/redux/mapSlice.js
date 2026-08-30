import { createSlice, current } from "@reduxjs/toolkit";


const mapSlice = createSlice({
    name:"user",
  initialState:{
    location:{
      latitude:null,
      longitude:null
    },
    address:null
  },
  reducers: {
    setLocation:(state,action)=>{
      const {latitude,longitude}=action.payload
      state.location.latitude=latitude
      state.location.longitude=longitude
    },
    setAddress:(state,action)=>{
      state.address=action.payload
    }

  }
});

export const {setAddress,setLocation} = mapSlice.actions;

  export const mapReducer = mapSlice.reducer;