import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, get, set, remove } from "firebase/database";
import { database } from "../utils/firebase";

// Загрузка всех избранных по userId
export const fetchFavorites = createAsyncThunk(
   "favorite/fetchFavorites",
   async (_, { getState }) => {
      const userId = getState().auth.user?.uid;
      if (!userId) return [];
      const favRef = ref(database, `favorites/${userId}`);
      const snapshot = await get(favRef);
      return snapshot.exists()
         ? Object.entries(snapshot.val()).map(([productId, data]) => ({
              productId,
              quantity: data.quantity,
           }))
         : [];
   }
);

// Добавление или удаление товара
export const toggleFavorite = createAsyncThunk(
   "favorite/toggleFavorite",
   async (productId, { getState, dispatch }) => {
      const userId = getState().auth.user?.uid;
      if (!userId) return { productId, action: "none" };

      const favRef = ref(database, `favorites/${userId}/${productId}`);
      const snapshot = await get(favRef);

      if (snapshot.exists()) {
         await remove(favRef); // удалить
      } else {
         await set(favRef, { quantity: 1 }); // добавить с количеством 1
      }

      await dispatch(fetchFavorites()); // обновим список
      return { productId }; // не нужен action, т.к. fetch всё перезапишет
   }
);

// Обновление количества товара
export const updateFavoriteQuantity = createAsyncThunk(
   "favorite/updateFavoriteQuantity",
   async ({ productId, quantity }, { getState, dispatch }) => {
      const userId = getState().auth.user?.uid;
      if (!userId) return;

      const favRef = ref(database, `favorites/${userId}/${productId}`);
      await set(favRef, { quantity }); // Обновляем количество в Firebase

      await dispatch(fetchFavorites()); // Обновляем список избранного
      return { productId, quantity }; // Возвращаем обновленное количество
   }
);

const favoriteSlice = createSlice({
   name: "favorite",
   initialState: {
      items: [], // Массив объектов { productId, quantity }
   },
   reducers: {
      clearFavorites: (state) => {
         state.items = [];
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchFavorites.fulfilled, (state, action) => {
            state.items = action.payload;
         })
         .addCase(toggleFavorite.fulfilled, () => {
            // ничего не делаем — fetchFavorites уже обновил state.items
         })
         .addCase(toggleFavorite.rejected, (state, action) => {
            console.error("🔥 Ошибка toggleFavorite:", action.error);
         });
   },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
