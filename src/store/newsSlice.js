import { createSlice } from "@reduxjs/toolkit";

const newsSlice = createSlice({
   name: "news",

   initialState: {
      news: [], // список всех новостей
      viewedLoaded: false, // загружены ли просмотренные
      newNewsCount: 0, // кол-во непросмотренных
      viewedNewsIds: [], // id просмотренных новостей
   },

   reducers: {
      setNews: (state, action) => {
         state.news = action.payload;
      },
      setNewNewsCount: (state, action) => {
         state.newNewsCount = action.payload;
      },
      setViewedNewsIds: (state, action) => {
         state.viewedNewsIds = action.payload;
      },
      addViewedNewsId: (state, action) => {
         if (!state.viewedNewsIds.includes(action.payload)) {
            state.viewedNewsIds.push(action.payload);
         }
      },
      markAllNewsAsViewed: (state) => {
         const allIds = state.news.map((n) => n.id);
         state.viewedNewsIds = [
            ...new Set([...state.viewedNewsIds, ...allIds]),
         ];
         state.newNewsCount = 0;
      },
      clearViewedNews: (state) => {
         state.viewedNewsIds = [];
         state.newNewsCount = 0;
      },
   },
});

export const {
   setNews,
   setNewNewsCount,
   setViewedNewsIds,
   addViewedNewsId,
   markAllNewsAsViewed,
   clearViewedNews,
} = newsSlice.actions;

export default newsSlice.reducer;
