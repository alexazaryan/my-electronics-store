import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
   name: "menu",
   initialState: {
      isMenuVisible: false,
      isRegistrationVisible: false,
      isNewsSectionVisible: false,
      isCategoryListVisible: false,
      isSettingsVisible: false,
      isOrderHistoryVisible: false,
      isFavoritesVisible: false, // состояние видимости избранного
      selectedCategory: null, // выбор категорий
   },
   reducers: {
      toggleMenu: (state) => {
         state.isMenuVisible = !state.isMenuVisible;
      },
      closeMenu: (state) => {
         state.isMenuVisible = false;
      },
      toggleRegistration: (state, action) => {
         state.isRegistrationVisible =
            action.payload ?? !state.isRegistrationVisible;
      },
      toggleNewsSection: (state, action) => {
         state.isNewsSectionVisible =
            action.payload ?? !state.isNewsSectionVisible;
      },
      toggleCategoryList: (state, action) => {
         state.isCategoryListVisible =
            action.payload ?? !state.isCategoryListVisible;
      },
      toggleSettingsPanel: (state, action) => {
         state.isSettingsVisible = action.payload ?? !state.isSettingsVisible;
      },
      toggleOrderHistory: (state, action) => {
         state.isOrderHistoryVisible =
            action.payload ?? !state.isOrderHistoryVisible;
      },
      toggleFavorites: (state, action) => {
         state.isFavoritesVisible = action.payload ?? !state.isFavoritesVisible;
      },
   },
});

export const {
   toggleMenu,
   closeMenu,
   toggleFavorites,
   toggleRegistration,
   toggleNewsSection,
   toggleCategoryList,
   toggleSettingsPanel,
   toggleOrderHistory,
} = menuSlice.actions;
export default menuSlice.reducer;
