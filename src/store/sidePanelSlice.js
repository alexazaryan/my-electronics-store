import { createSlice } from "@reduxjs/toolkit";

const sidePanelSlice = createSlice({
   name: "sidePanel",
   initialState: {
      isOpen: false,
   },

   reducers: {
      togglePanel: (state) => {
         state.isOpen = !state.isOpen;
      },
   },
});

export const { togglePanel } = sidePanelSlice.actions;
export default sidePanelSlice.reducer;
