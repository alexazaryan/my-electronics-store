import { useDispatch, useSelector } from "react-redux";
import ProductCircleSlider from "../../components/ProductCircleSlider/ProductCircleSlider";
import ProductList from "../../components/ProductList/ProductList";
import TrustSlider from "../../components/TrustSlider/TrustSlider";
import CustomButton from "../../components/CustomButton/CustomButton";
import { setSelectedCategory } from "../../store/categoriesSlice";
import { BsChevronRight } from "react-icons/bs";

import styles from "./Home.module.css";

export default function Home() {
   const dispatch = useDispatch();
   const { status } = useSelector((state) => state.products);

   const { categories, selectedCategory } = useSelector(
      (state) => state.categories
   );

   return (
      <div>
         {status === "succeeded" && (
            <div>
               <div className={styles["box-categories-slider-entry"]}>
                  {/* категории выбора на главной странице */}
                  <ul className={styles["box-entry-block__categories"]}>
                     {categories.slice(0, 7).map((cat) => (
                        <li
                           key={cat}
                           className={`${styles["category-item"]} ${
                              selectedCategory === cat ? styles["active"] : ""
                           }`}
                           onClick={() => dispatch(setSelectedCategory(cat))}
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

                  {/* slider center */}
                  <div className={styles["box-entry-block__slider"]}>
                     <TrustSlider />
                  </div>

                  {/* в разработке */}
                  <div className={styles["box-entry-block__sign"]}>
                     <h3>Хотите продавать вместе с нами? </h3>
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
