import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCategory } from "../../store/categoriesSlice";
import { BsChevronRight } from "react-icons/bs";

import ProductCircleSlider from "../../components/ProductCircleSlider/ProductCircleSlider";
import ProductList from "../../components/ProductList/ProductList";
import TrustSlider from "../../components/TrustSlider/TrustSlider";
import CustomButton from "../../components/CustomButton/CustomButton";

import styles from "./Home.module.css";

export default function Home() {
   const dispatch = useDispatch();
   const { status } = useSelector((state) => state.products);

   const { categories, selectedCategory } = useSelector(
      (state) => state.categories
   );

   useEffect(() => {
      let isMounted = true; // флаг для избежания утечек памяти

      return () => {
         isMounted = false;
      };
   }, [categories]);

   return (
      <div>
         {status === "succeeded" && (
            <div>
               <div className={styles["box-categories-slider-entry"]}>
                  <ul className={styles["box-entry-block__categories"]}>
                     {categories.slice(0, 7).map((cat, index) => (
                        <li
                           key={categories[index]}
                           className={`${styles["category-item"]} ${
                              selectedCategory === categories[index]
                                 ? styles["active"]
                                 : ""
                           }`}
                           onClick={() =>
                              dispatch(setSelectedCategory(categories[index]))
                           }
                        >
                           <span className={styles["category-name"]}>
                              {cat}
                           </span>
                           <BsChevronRight
                              className={styles["category-icon"]}
                           />
                        </li>
                     ))}
                  </ul>

                  <div className={styles["box-entry-block__slider"]}>
                     <TrustSlider />
                  </div>

                  <div className={styles["box-entry-block__sign"]}>
                     <h3>Хотите продавать вместе с нами?</h3>
                     <CustomButton className={styles["sign"]}>
                        Скоро запуск
                        <span style={{ color: "yellow", marginLeft: "10px" }}>
                           тестируем
                        </span>
                     </CustomButton>
                  </div>
               </div>

               <ProductCircleSlider />
            </div>
         )}

         <ProductList />
      </div>
   );
}
