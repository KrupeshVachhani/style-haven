import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";

const initialState = {
  user: null, // Authenticated user data
  isAuthenticated: false, // Authentication status
  isSuperAdmin: false, // Super Admin status
  isAdmin: false, // Admin status
  loading: false, // Loading status
  error: null, // Error messages
};

// Async thunk to check if the user is a Super Admin
export const checkSuperAdmin = createAsyncThunk(
  "auth/checkSuperAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const superAdminRef = collection(db, "Super Admin");
      const q = query(
        superAdminRef,
        where("email", "==", credentials.email),
        where("password", "==", credentials.password),
        where("phone", "==", credentials.phone)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Invalid credentials or not a Super Admin");
      }

      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to check if the user is an Admin
export const checkAdmin = createAsyncThunk(
  "auth/checkAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const adminRef = collection(db, "Admin");
      const q = query(
        adminRef,
        where("email", "==", credentials.email),
        where("password", "==", credentials.password),
        where("phone", "==", credentials.phone)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Invalid credentials or not an Admin");
      }

      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Combined thunk to check user role (Super Admin or Admin)
export const checkUserRole = createAsyncThunk(
  "auth/checkUserRole",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      // Try authenticating as Super Admin
      const superAdminData = await dispatch(
        checkSuperAdmin(credentials)
      ).unwrap();
      return { ...superAdminData, role: "superadmin" };
    } catch {
      // If not Super Admin, try Admin authentication
      try {
        const adminData = await dispatch(checkAdmin(credentials)).unwrap();
        return { ...adminData, role: "admin" };
      } catch (error) {
        // If neither role is valid
        return rejectWithValue(
          "Invalid credentials for both Admin and Super Admin"
        );
      }
    }
  }
);

// Authentication slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isSuperAdmin = false;
      state.isAdmin = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Super Admin authentication
      .addCase(checkSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isSuperAdmin = true;
        state.isAdmin = false;
      })
      .addCase(checkSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error authenticating Super Admin";
      })
      // Handle Admin authentication
      .addCase(checkAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAdmin = true;
        state.isSuperAdmin = false;
      })
      .addCase(checkAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error authenticating Admin";
      })
      // Handle combined user role authentication
      .addCase(checkUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isSuperAdmin = action.payload.role === "superadmin";
        state.isAdmin = action.payload.role === "admin";
      })
      .addCase(checkUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error authenticating user role";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
