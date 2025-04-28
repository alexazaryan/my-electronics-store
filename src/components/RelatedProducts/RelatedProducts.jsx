// Компонент показывает 16 похожих + 8 случайных товаров при смене товара

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./RelatedProducts.module.css";

const RelatedProducts = ({ currentId, category }) => {
   const products = useSelector((state) => state.products.items); // список всех товаров
   const [combined, setCombined] = useState([]); // итоговые товары

   useEffect(() => {
      window.scrollTo({ top: 0, behavior: "auto" }); // скролл наверх при смене товара

      // 16 из той же категории, но не текущий товар
      const related = products
         .filter((p) => p.category === category && p.id !== currentId)
         .slice(0, 16);

      // 8 случайных, не входящих в related
      const extras = products.filter(
         (p) => p.id !== currentId && !related.some((r) => r.id === p.id)
      );
      const shuffledExtras = [...extras]
         .sort(() => 0.5 - Math.random())
         .slice(0, 8);

      // объединяем и перемешиваем
      const final = [...related, ...shuffledExtras].sort(
         () => 0.5 - Math.random()
      );

      setCombined(final); // сохраняем итог
   }, [currentId, category, products]); // обновлять при смене товара или категории

   if (combined.length === 0) return null; // если нечего показывать — ничего не рендерим

   return (
      <div className={styles["related-products__grid"]}>
         {combined.map((item) => (
            <Link
               key={item.id}
               to={`/product/${item.id}`}
               className={styles["related-products__card"]}
            >
               <div className={styles["related-products__img-wrap"]}>
                  <img
                     src={item.images?.[0] || item.imageUrl}
                     alt={item.name}
                     className={styles["related-products__img"]}
                  />
               </div>
               <p className={styles["related-products__name"]}>{item.name}</p>
               <ul>
                  <li></li>
               </ul>
               <p className={styles["related-products__price"]}>
                  {item.price.toLocaleString("uk-UA")} ₴
               </p>
            </Link>
         ))}
      </div>
   );
};

export default RelatedProducts;
