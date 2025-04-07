// src/utils/uploadImage.js
import { IMGBB_API_KEY } from "./config"; // Импортируем API-ключ

export const uploadImageToImgBB = async (file) => {
   const formData = new FormData();
   formData.append("image", file);

   try {
      const response = await fetch(
         `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
         {
            method: "POST",
            body: formData,
         }
      );

      const data = await response.json();

      if (data.success) {
         return data.data.url; // Возвращаем URL изображения
      } else {
         throw new Error("Ошибка загрузки изображения");
      }
   } catch (error) {
      console.error(error);
      throw error; // Передаем ошибку выше
   }
};
