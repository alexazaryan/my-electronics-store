import { useEffect } from "react";
import { db } from "../../utils/firebase";
import {
   collection,
   query,
   orderBy,
   onSnapshot,
   doc,
   deleteDoc,
   getDoc,
   setDoc,
} from "firebase/firestore";

import styles from "./NewsFeed.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
   setNews,
   setNewNewsCount,
   setViewedNewsIds,
} from "../../store/newsSlice";

const NewsFeed = () => {
   const dispatch = useDispatch();

   const isAdmin = useSelector((state) => state.auth.isAdmin);
   const userId = useSelector((state) => state.auth.userId);

   const news = useSelector((state) => state.news.news);
   const viewedNewsIds = useSelector((state) => state.news.viewedNewsIds);

   // 🔄 Загрузка новостей из Firestore с сериализацией даты
   useEffect(() => {
      const q = query(collection(db, "news"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
         const newsList = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
               id: doc.id,
               ...data,
               createdAt: data.createdAt?.toDate().getTime() || null,
            };
         });

         dispatch(setNews(newsList));
      });

      return () => unsubscribe();
   }, [dispatch]);

   // 📥 Загрузка просмотренных новостей пользователя
   useEffect(() => {
      if (!userId) return;

      const fetchViewed = async () => {
         try {
            const userRef = doc(db, "users", userId);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
               const data = docSnap.data();
               const viewed = Array.isArray(data.viewedNews)
                  ? data.viewedNews
                  : [];
               dispatch(setViewedNewsIds(viewed));
            } else {
               dispatch(setViewedNewsIds([]));
            }
         } catch (err) {
            console.error("Ошибка при загрузке viewedNews:", err);
            dispatch(setViewedNewsIds([]));
         }
      };

      fetchViewed();
   }, [userId, dispatch]);

   // 📊 Пересчёт непросмотренных новостей
   useEffect(() => {
      const unread = news.filter((n) => !viewedNewsIds.includes(n.id));
      dispatch(setNewNewsCount(unread.length));
   }, [news, viewedNewsIds, dispatch]);

   // 💾 Сохраняем просмотренные новости пользователя в Firebase
   useEffect(() => {
      if (!userId || viewedNewsIds.length === 0) return;

      const saveViewed = async () => {
         try {
            await setDoc(
               doc(db, "users", userId),
               { viewedNews: viewedNewsIds },
               { merge: true }
            );
         } catch (err) {
            console.error("Ошибка при сохранении viewedNews:", err);
         }
      };

      saveViewed();
   }, [userId, viewedNewsIds]);

   // 🗑 Удаление новости (только для админа)
   const handleDelete = async (id) => {
      const confirm = window.confirm("Удалить эту новость?");
      if (!confirm) return;

      try {
         await deleteDoc(doc(db, "news", id));
         alert("Удалено");
      } catch (err) {
         console.error("Ошибка при удалении:", err);
         alert("Ошибка при удалении");
      }
   };

   const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

   return (
      <div className={styles["news-feed"]}>
         {news.map((item) => (
            <div key={item.id} className={styles["news-item"]}>
               <h3 className={styles["news-title"]}>
                  {capitalizeFirst(
                     item.title.length > 30
                        ? item.title.slice(0, 35) + "..."
                        : item.title
                  )}
               </h3>

               <p className={styles["news-content"]}>
                  {capitalizeFirst(
                     item.content.length > 150
                        ? item.content.slice(0, 135) + "..."
                        : item.content
                  )}
               </p>

               <small className={styles["news-date"]}>
                  {item.createdAt
                     ? new Date(item.createdAt).toLocaleString()
                     : "Дата не указана"}
               </small>

               {isAdmin && (
                  <button
                     onClick={() => handleDelete(item.id)}
                     className={styles["delete-button"]}
                  >
                     Удалить
                  </button>
               )}
            </div>
         ))}
      </div>
   );
};

export default NewsFeed;
// мой
