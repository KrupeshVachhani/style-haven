import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/SuperAdminAuthSlice";
import loadingSlice from "./loading"
export const store = configureStore({
    reducer: {
        auth: authSlice,
        loading: loadingSlice
    }
});