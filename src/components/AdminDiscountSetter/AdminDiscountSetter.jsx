import { useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useSelector } from "react-redux";

import styles from "./AdminDiscountSetter.module.css";

const AdminDiscountSetter = () => {
   const [discount, setDiscount] = useState(0); // фиксированная скидка
   const [useRandom, setUseRandom] = useState(false); // режим случайной скидки
   const [minRandom, setMinRandom] = useState(5); // минимальный %
   const [maxRandom, setMaxRandom] = useState(50); // максимальный %
   const [targetCategory, setTargetCategory] = useState(""); // категория
   const [targetProductId, setTargetProductId] = useState(""); // ID одного товара
   const [status, setStatus] = useState(null); // статус

   const { categories } = useSelector((state) => state.categories);
   const uniqueCategories = [...new Set(categories.filter(Boolean))]; // категории без дубликатов

   const getRandomDiscount = () => {
      const min = Math.min(minRandom, maxRandom);
      const max = Math.max(minRandom, maxRandom);
      return Math.floor(Math.random() * (max - min + 1)) + min;
   };

   const applyDiscount = async () => {
      try {
         setStatus("loading");

         if (targetProductId.trim()) {
            const value = useRandom ? getRandomDiscount() : Number(discount);

            await updateDoc(doc(db, "products", targetProductId.trim()), {
               discount: value,
            });
         } else {
            const querySnapshot = await getDocs(collection(db, "products"));

            const batchPromises = querySnapshot.docs.map((docSnap) => {
               const data = docSnap.data();
               const shouldUpdate =
                  !targetCategory || data.category === targetCategory;

               if (shouldUpdate) {
                  const value = useRandom
                     ? getRandomDiscount()
                     : Number(discount);

                  return updateDoc(doc(db, "products", docSnap.id), {
                     discount: value,
                  });
               } else {
                  return Promise.resolve();
               }
            });

            await Promise.all(batchPromises);
         }

         setStatus("success");
      } catch (err) {
         console.error("Ошибка при обновлении скидок:", err);
         setStatus("error");
      }
   };

   return (
      <div className={styles.container}>
         <h3>Установка скидок</h3>

         <div className={styles.row}>
            <label>
               <input
                  type="checkbox"
                  checked={useRandom}
                  onChange={() => setUseRandom((prev) => !prev)}
               />
               Случайные скидки
            </label>
         </div>

         {!useRandom && (
            <div className={styles.row}>
               <label>Скидка (%):</label>
               <input
                  type="number"
                  min="0"
                  max="90"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
               />
            </div>
         )}

         {useRandom && (
            <div className={styles.row}>
               <label>От (%):</label>
               <input
                  type="number"
                  min="0"
                  max="90"
                  value={minRandom}
                  onChange={(e) => setMinRandom(Number(e.target.value))}
               />
               <label>До (%):</label>
               <input
                  type="number"
                  min="0"
                  max="90"
                  value={maxRandom}
                  onChange={(e) => setMaxRandom(Number(e.target.value))}
               />
            </div>
         )}

         <div className={styles.row}>
            <label>Один товар (ID):</label>
            <input
               type="text"
               placeholder="Введите ID товара"
               value={targetProductId}
               onChange={(e) => setTargetProductId(e.target.value)}
            />
         </div>

         <div className={styles.row}>
            <label>Категория:</label>
            <select
               value={targetCategory}
               onChange={(e) => setTargetCategory(e.target.value)}
               disabled={!!targetProductId.trim()}
            >
               <option value="">Все товары</option>
               {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                     {cat}
                  </option>
               ))}
            </select>
         </div>

         <button onClick={applyDiscount} className={styles.button}>
            Применить
         </button>

         {status === "loading" && <p>Обновление скидок...</p>}
         {status === "success" && <p style={{ color: "green" }}>Готово ✅</p>}
         {status === "error" && <p style={{ color: "red" }}>Ошибка ❌</p>}
      </div>
   );
};

export default AdminDiscountSetter;
