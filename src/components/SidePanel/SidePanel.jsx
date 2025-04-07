import { useSelector, useDispatch } from "react-redux";
import { togglePanel } from "../../store/sidePanelSlice";
import { toggleRegistration } from "../../store/menuSlice";
import CustomButton from "../CustomButton/CustomButton";
import styles from "./SidePanel.module.css";

const SidePanel = () => {
   const isOpen = useSelector((state) => state.sidePanel.isOpen);
   const dispatch = useDispatch();

   return (
      <div className={styles["side-panel"]}>
         <div
            className={`${styles["overlay"]} ${
               isOpen ? styles["visible"] : ""
            }`}
            onClick={() => dispatch(togglePanel())} // Закрывает панель при клике вне
         ></div>

         {/* панель — блокируем всплытие, чтобы не закрывалась при кликах внутри */}
         <div
            className={`${styles["side-panel__wrap"]} ${
               isOpen ? styles["visible"] : ""
            }`}
            onClick={(e) => e.stopPropagation()}
         >
            <CustomButton
               className={styles["side-panel__close-button"]}
               onClick={() => dispatch(togglePanel())}
            >
               ✖ закрыть
            </CustomButton>

            <div className={styles["side-panel__container"]}>
               <div className={styles["side-panel__wrap-small"]}>
                  <img
                     className={styles["side-panel__small-img"]}
                     src="/happySmile.png"
                     alt="смайлик"
                  />
               </div>

               <h3>Хороший выбор! Сохраняем?</h3>
               <p>
                  Войди или зарегистрируйся, чтобы сохранять товары в Избранное
               </p>

               <CustomButton
                  onClick={() => {
                     dispatch(toggleRegistration());
                     dispatch(togglePanel());
                  }}
                  className={styles["side-panel__custom-button-enter"]}
               >
                  Войти
               </CustomButton>

               <CustomButton
                  onClick={() => {
                     dispatch(toggleRegistration());
                     dispatch(togglePanel());
                  }}
                  className={styles["side-panel__custom-button-registration"]}
               >
                  Зарегестрироваться
               </CustomButton>
            </div>
         </div>
      </div>
   );
};

export default SidePanel;
