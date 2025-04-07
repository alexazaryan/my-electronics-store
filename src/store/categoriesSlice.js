import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../utils/firebase";
import { getDocs, collection } from "firebase/firestore";

// Загружаем товары и извлекаем категории
export const fetchCategories = createAsyncThunk(
   "categories/fetchCategories",
   async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const categoriesSet = new Set();

      querySnapshot.forEach((doc) => {
         const productData = doc.data();
         if (productData.category) {
            categoriesSet.add(productData.category);
         }
      });

      return ["Все товары", ...Array.from(categoriesSet)];
   }
);

const categoriesSlice = createSlice({
   name: "categories",
   initialState: {
      selectedCategory: "Все товары",
      categories: [],
      status: "idle",
      error: null,
   },
   reducers: {
      setSelectedCategory: (state, action) => {
         state.selectedCategory = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchCategories.pending, (state) => {
            state.status = "loading";
         })
         .addCase(fetchCategories.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.categories = action.payload;
         })
         .addCase(fetchCategories.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
         });
   },
});

export const { setSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
