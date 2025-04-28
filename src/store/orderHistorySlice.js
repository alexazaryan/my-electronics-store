// слайс для истории заказов пользователя

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../utils/firebase"; // импорт Firestore

// асинхронная загрузка заказов пользователя
export const fetchUserOrders = createAsyncThunk(
   "orderHistory/fetchUserOrders",
   async (userId) => {
      const ordersRef = collection(db, "users", userId, "orders"); // путь к заказам пользователя
      const q = query(ordersRef, orderBy("createdAt", "desc")); // сортируем по дате
      const snapshot = await getDocs(q); // получаем документы
      return snapshot.docs.map((doc) => {
         const data = doc.data();

         return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt
               ? data.createdAt.toDate().toISOString()
               : null, // 🔥 фиксируем дату как строку
         };
      });
   }
);

const orderHistorySlice = createSlice({
   name: "orderHistory",
   initialState: {
      orders: [], // список заказов
      loading: false, // статус загрузки
   },
   reducers: {
      clearOrders: (state) => {
         state.orders = []; // очистка заказов
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchUserOrders.pending, (state) => {
            state.loading = true; // начало загрузки
         })
         .addCase(fetchUserOrders.fulfilled, (state, action) => {
            state.orders = action.payload; // загрузка успешна
            state.loading = false;
         })
         .addCase(fetchUserOrders.rejected, (state) => {
            state.loading = false; // ошибка загрузки
         });
   },
});

export const { clearOrders } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;
