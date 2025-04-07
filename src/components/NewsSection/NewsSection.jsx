import { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { toggleNewsSection } from "../../store/menuSlice";
import CustomButton from "../CustomButton/CustomButton";

import styles from "./NewsSection.module.css";
import NewsFeed from "../../pages/NewsFeed/NewsFeed";

const NewsSection = forwardRef(({ isVisible }, ref) => {
   const dispatch = useDispatch();

   const handleClose = () => {
      dispatch(toggleNewsSection(false)); // Закрываем через Redux
   };

   return (
      <div
         ref={ref}
         className={`${styles["news-section"]} ${
            isVisible ? styles["visible"] : ""
         }`}
      >
         <div>
            <CustomButton
               className={styles["news-section__custom-button-close"]}
               onClick={handleClose}
            >
               ✖ закрыть
            </CustomButton>
            <div className={styles["news-section__wrap"]}>
               <strong>Новости</strong>
               <NewsFeed />
            </div>
         </div>
      </div>
   );
});

export default NewsSection;
