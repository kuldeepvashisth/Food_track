import {configureStore} from "@reduxjs/toolkit"
import { userReducer } from "./UserSlice.js"
import { ownerReducer } from "./ownerSlice.js"

export const store=configureStore({
          reducer:{
            user:userReducer,
            owner:ownerReducer
          }      
})