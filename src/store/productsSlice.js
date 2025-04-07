import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../utils/firebase";
import {
   getDocs,
   collection,
   deleteDoc,
   doc,
   addDoc,
} from "firebase/firestore";

// Загружаем все товары
export const fetchProducts = createAsyncThunk(
   "products/fetchProducts",
   async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = [];
      querySnapshot.forEach((doc) => {
         productsList.push({ id: doc.id, ...doc.data() });
      });
      return productsList;
   }
);
// startAfter fetchProducts
// Удаляем товар
export const deleteProduct = createAsyncThunk(
   "products/deleteProduct",
   async (productId) => {
      await deleteDoc(doc(db, "products", productId));
      return productId;
   }
);

// Добавляем товар
export const addProduct = createAsyncThunk(
   "products/addProduct",
   async (productData) => {
      const docRef = await addDoc(collection(db, "products"), {
         ...productData,
         price: Number(productData.price),
      });
      return { id: docRef.id, ...productData };
   }
);

// Слайс
const productsSlice = createSlice({
   name: "products",
   initialState: {
      items: [],
      status: "idle",
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // Загрузка
         .addCase(fetchProducts.pending, (state) => {
            state.status = "loading";
         })
         .addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.items = action.payload;
         })
         .addCase(fetchProducts.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
         })
         // Удаление
         .addCase(deleteProduct.fulfilled, (state, action) => {
            state.items = state.items.filter(
               (product) => product.id !== action.payload
            );
         })
         // Добавление
         .addCase(addProduct.fulfilled, (state, action) => {
            state.items.push(action.payload);
         });
   },
});

// Только один экспорт
export default productsSlice.reducer;

// мой
// мой
// мой
