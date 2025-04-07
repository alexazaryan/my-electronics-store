import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
   name: "auth",
   initialState: {
      user: null,
      isAdmin: false, // флаг администратора
   },
   reducers: {
      setUser: (state, action) => {
         const { user, role } = action.payload;
         state.user = user; // Присваиваем user напрямую
         state.isAdmin = role === "admin";
      },
      clearUser: (state) => {
         state.user = null;
         state.isAdmin = false;
      },
   },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
