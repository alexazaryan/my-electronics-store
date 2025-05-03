import ProductCardMini from "../../components/ProductCardMini/ProductCardMini";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, fetchProducts } from "../../store/productsSlice"; // ✅ добавь fetchProducts
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

import styles from "./AdminProductsPage.module.css";
import AdminDiscountSetter from "../../components/AdminDiscountSetter/AdminDiscountSetter";

export default function AdminProductsPage() {
   const dispatch = useDispatch();
   const products = useSelector((state) => state.products.items); // все товары

   // удалить товар
   const handleDelete = (product) => {
      if (window.confirm(`Удалить товар "${product.name}"?`)) {
         dispatch(deleteProduct(product.id));
      }
   };

   // обновить любые мета-данные (рейтинг, заказы, скидки вручную)
   const handleMetaChange = async (productId, changes) => {
      try {
         await updateDoc(doc(db, "products", productId), changes);
         dispatch(fetchProducts()); // 🔄 обновить после изменения
      } catch (err) {
         console.error("Ошибка при обновлении:", err);
      }
   };

   return (
      <div className={styles.adminPage}>
         <h2>Управление товарами (уровень АДМИН)</h2>

         <div className={styles.discountBlock}>
            <h2>Установка скидок</h2>
            <AdminDiscountSetter />
         </div>

         <ul className={styles.cardList}>
            {products.slice(0, 5).map((item) => (
               <ProductCardMini
                  key={item.id}
                  item={item}
                  showDelete={true}
                  onDelete={handleDelete}
                  showSku={true}
                  showDropPrice={true}
                  showEditableMeta={true}
                  onMetaChange={handleMetaChange} // ✅ обязательно
               />
            ))}
         </ul>
      </div>
   );
}
