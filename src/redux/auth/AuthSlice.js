import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";

const initialState = {
  user: null,
  isAuthenticated: false,
  isSuperAdmin: false,
  loading: false,
  error: null,
};

export const checkSuperAdmin = createAsyncThunk(
  "auth/checkSuperAdmin",
  async ({ email, password, phone }, { rejectWithValue }) => {
    try {
      const superAdminRef = collection(db, "Super Admin");

      const q = query(
        superAdminRef,
        where("email", "==", email),
        where("password", "==", password),
        where("phone", "==", phone)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Invalid credentials or not a Super Admin");
      }

      const doc = querySnapshot.docs[0];
      const superAdminData = { id: doc.id, ...doc.data() };

      return superAdminData;
    } catch (error) {
      console.error("Error checking Super Admin:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isSuperAdmin = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isSuperAdmin = true;
      })
      .addCase(checkSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
        state.isAuthenticated = false;
        state.isSuperAdmin = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
