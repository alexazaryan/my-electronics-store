import { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { toggleOrderHistory } from "../../store/menuSlice";

import styles from "./OrderHistory.module.css";
import CustomButton from "../CustomButton/CustomButton";

const OrderHistory = forwardRef(({ isVisible }, ref) => {
   const dispatch = useDispatch();

   const handleClose = () => {
      dispatch(toggleOrderHistory(false)); // Закрываем через Redux
   };

   return (
      <div
         ref={ref}
         className={`${styles["order-history__section"]} ${
            isVisible ? styles["visible"] : ""
         }`}
      >
         <div>
            <CustomButton
               className={styles["order-history__custom-button-close"]}
               onClick={handleClose}
            >
               ✖ закрыть
            </CustomButton>
            <div className={styles["order-history__wrap"]}>
               <h3>Мои заказы:</h3>
               {/* анимация */}
               <div className={styles["order-history__animation-blok"]}>
                  <div
                     className={styles["order-history__wrap-loading-smile-img"]}
                  >
                     <img
                        className={styles["order-history__loading-smile-img"]}
                        // src="/loading-smile.png"
                        img
                        src={`${import.meta.env.BASE_URL}loading-smile.png`}
                        alt="смайлик с часами"
                     />
                  </div>

                  {/* часы */}
                  <div className={styles["order-history__wrap-hourglass-img"]}>
                     <img
                        className={styles["order-history__hourglass-img"]}
                        // src="/hourglass.png"

                        src={`${import.meta.env.BASE_URL}hourglass.png`}
                        alt="песочные часы"
                     />
                  </div>
               </div>
               {/* анимация end*/}
               <p>Заказов нет ... </p>
            </div>
         </div>
      </div>
   );
});

export default OrderHistory;
