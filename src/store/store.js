import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./menuSlice";
import productsReducer from "./productsSlice";
import authReducer from "./authSlice";
import categoriesReducer from "./categoriesSlice";
import favoriteReducer from "./favoriteSlice";
import searchReducer from "./searchSlice";
import sidePanelReducer from "./sidePanelSlice";
import newsReducer from "./newsSlice";

const store = configureStore({
   reducer: {
      menu: menuReducer, //боковое menu
      products: productsReducer, // Редьюсер для продуктов
      auth: authReducer, // регистрация User
      categories: categoriesReducer,
      favorite: favoriteReducer, //избранное
      search: searchReducer, //поисковик
      sidePanel: sidePanelReducer, //бокавая панель
      news: newsReducer, // новосити
   },
});

export default store;
