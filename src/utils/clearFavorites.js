import { database } from "./firebase";
import { ref, remove } from "firebase/database";

// Очистка всех избранных товаров пользователя в Realtime Database
export const clearFavoritesInRealtime = async (userId) => {
   try {
      const favRef = ref(database, `favorites/${userId}`);
      await remove(favRef); // удаляем всю ветку favorites/{userId}
      console.log("Избранное в Realtime Database очищено");
   } catch (error) {
      console.error(
         "Ошибка при очистке избранного в Realtime Database:",
         error
      );
   }
};
