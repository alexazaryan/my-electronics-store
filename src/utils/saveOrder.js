import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Функция для генерации кода заказа
const generateOrderCode = () => {
   const chars = "ABC0123456789";
   let code = "";
   for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return `ORD-${code}`;
};

export const saveOrder = async (userId, orderData) => {
   try {
      const userOrdersRef = collection(db, "users", userId, "orders");
      await addDoc(userOrdersRef, {
         ...orderData,
         code: generateOrderCode(), // ✅ Генерируем и сохраняем код заказа
         processed: false,
         createdAt: serverTimestamp(),
      });
   } catch (error) {
      console.error("Ошибка при сохранении заказа:", error);
      throw error;
   }
};
