import { useState, useEffect } from "react";
import {
   collection,
   getDocs,
   getDoc,
   updateDoc,
   doc,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useSelector } from "react-redux";
import styles from "./AdminMarkupSetter.module.css";
import ProductPrice from "../../components/FinalPrice/ProductPrice";

const AdminMarkupSetter = () => {
   const [markup, setMarkup] = useState(0); // процент наценки
   const [targetCategory, setTargetCategory] = useState(""); // категория
   const [targetProductId, setTargetProductId] = useState(""); // ID одного товара
   const [status, setStatus] = useState(null); // статус операции
   const [selectedProduct, setSelectedProduct] = useState(null); // товар по ID

   const { categories } = useSelector((state) => state.categories);
   const uniqueCategories = [...new Set(categories.filter(Boolean))];

   // получить товар по ID
   useEffect(() => {
      const fetchProduct = async () => {
         if (!targetProductId.trim()) return setSelectedProduct(null);
         try {
            const snap = await getDoc(
               doc(db, "products", targetProductId.trim())
            );
            if (snap.exists()) {
               setSelectedProduct({ id: snap.id, ...snap.data() });
            } else {
               setSelectedProduct(null);
            }
         } catch (err) {
            console.error("Ошибка при загрузке товара:", err);
            setSelectedProduct(null);
         }
      };
      fetchProduct();
   }, [targetProductId]);

   const applyMarkup = async () => {
      try {
         setStatus("loading");

         if (targetProductId.trim()) {
            await updateDoc(doc(db, "products", targetProductId.trim()), {
               markup: Number(markup),
            });
         } else {
            const snapshot = await getDocs(collection(db, "products"));

            const updateTasks = snapshot.docs.map((docSnap) => {
               const data = docSnap.data();
               const shouldUpdate =
                  !targetCategory || data.category === targetCategory;

               if (shouldUpdate) {
                  return updateDoc(doc(db, "products", docSnap.id), {
                     markup: Number(markup),
                  });
               } else {
                  return Promise.resolve();
               }
            });

            await Promise.all(updateTasks);
         }

         setStatus("success");
      } catch (err) {
         console.error("Ошибка при установке наценки:", err);
         setStatus("error");
      }
   };

   return (
      <div className={styles.container}>
         <h3>Установка наценки Администратор</h3>

         <div className={styles.row}>
            <label>Наценка (%):</label>
            <input
               type="number"
               min="0"
               max="200"
               value={markup}
               onChange={(e) => setMarkup(e.target.value)}
            />
         </div>

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
               <option value="">Все товары сразу</option>
               {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                     {cat}
                  </option>
               ))}
            </select>
         </div>

         <button onClick={applyMarkup} className={styles.button}>
            Применить
         </button>

         {status === "loading" && <p>Обновление наценки...</p>}
         {status === "success" && <p style={{ color: "green" }}>Готово ✅</p>}
         {status === "error" && <p style={{ color: "red" }}>Ошибка ❌</p>}

         {selectedProduct && (
            <div className={styles.preview}>
               <p>
                  <strong>Название:</strong> {selectedProduct.name}
               </p>
               <p>
                  <strong>Категория:</strong> {selectedProduct.category}
               </p>
               <p>
                  <strong>Текущий markup:</strong> {selectedProduct.markup ?? 0}{" "}
                  %
               </p>
               <div>
                  <strong>Цена:</strong>{" "}
                  <ProductPrice product={selectedProduct} />
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminMarkupSetter;
