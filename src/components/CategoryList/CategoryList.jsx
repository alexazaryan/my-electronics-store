import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
   setSelectedCategory,
   fetchCategories,
} from "../../store/categoriesSlice";
import { toggleCategoryList } from "../../store/menuSlice";
import CustomButton from "../CustomButton/CustomButton";

import styles from "./CategoryList.module.css";

const CategoryList = React.forwardRef(({ isVisible }, ref) => {
   const dispatch = useDispatch();
   const { categories, selectedCategory, status } = useSelector(
      (state) => state.categories
   );

   const uniqueCategories = [...new Set(categories)];

   useEffect(() => {
      dispatch(fetchCategories()); // Загружаем категории при первом рендере
   }, [dispatch]);

   const handleClose = () => {
      dispatch(toggleCategoryList(false)); // Закрываем меню
   };

   const handleCategorySelect = (category) => {
      dispatch(setSelectedCategory(category)); // Устанавливаем выбранную категорию
   };

   return (
      <div
         ref={ref}
         className={`${styles["category-list__section"]} ${
            isVisible ? styles["visible"] : ""
         }`}
      >
         <CustomButton className={styles["close-button"]} onClick={handleClose}>
            ✖ закрыть
         </CustomButton>
         <div className={styles["category-list__container"]}>
            {status === "loading" ? (
               <p>Загрузка...</p>
            ) : status === "failed" ? (
               <p>Ошибка загрузки категорий</p>
            ) : (
               uniqueCategories.map((category) => (
                  <button
                     key={category}
                     className={`${styles["category-button"]} ${
                        selectedCategory === category ? styles["active"] : ""
                     }`}
                     onClick={() => handleCategorySelect(category)}
                  >
                     {category}
                  </button>
               ))
            )}
         </div>
      </div>
   );
});

export default CategoryList;
