import { configureStore } from "@reduxjs/toolkit";
import  authSlice  from "./auth/SuperAdminAuthSlice";

export const store = configureStore({
    reducer:{
        auth:authSlice
    }
})