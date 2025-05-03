import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
   name: "auth",
   initialState: {
      user: null,
      isAdmin: false,
      isLoading: true, // загрузка по умолчанию
   },
   reducers: {
      setUser: (state, action) => {
         const { user, role } = action.payload;
         state.user = user;
         state.isAdmin = role === "admin";
         state.isLoading = false; // ← обязательно
      },
      clearUser: (state) => {
         state.user = null;
         state.isAdmin = false;
         state.isLoading = false; // ← обязательно
      },
   },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
