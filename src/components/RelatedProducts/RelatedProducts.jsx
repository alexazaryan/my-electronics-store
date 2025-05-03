import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProductCardMini from "../ProductCardMini/ProductCardMini";
import CustomButton from "../CustomButton/CustomButton";
import styles from "./RelatedProducts.module.css";

const RelatedProducts = ({ currentId, category }) => {
   const products = useSelector((state) => state.products.items);
   const [available, setAvailable] = useState([]); // доступные
   const [shown, setShown] = useState([]); // отображённые

   // Первый запуск: фильтруем и перемешиваем
   useEffect(() => {
      const filtered = products.filter((p) => p.id !== currentId);
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      setAvailable(shuffled);
      setShown(shuffled.slice(0, 15));
   }, [products, currentId]);

   // Кнопка "Показать ещё"
   const handleLoadMore = () => {
      const remaining = available.slice(shown.length);
      const nextBatch = remaining.slice(0, 15);
      setShown((prev) => [...prev, ...nextBatch]);
   };

   if (shown.length === 0) return null;

   return (
      <div>
         <div className={styles["related-products__grid"]}>
            {shown.map((item) => (
               <ProductCardMini key={item.id} item={item} />
            ))}
         </div>

         {shown.length < available.length && (
            <CustomButton
               onClick={handleLoadMore}
               className={styles.loadMoreButton}
            >
               Показать еще
            </CustomButton>
         )}
      </div>
   );
};

export default RelatedProducts;
