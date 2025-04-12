import styles from "./StickyTopBanner.module.css";

const StickyTopBanner = () => {
   return (
      <div className={styles["banner"]}>
         <div  className={styles["banner__wrap-img"]}>
            <img
            className={styles["banner__img-car"]}
               src={`${import.meta.env.BASE_URL}delivery-truck.png`}
               alt="delivery truck"
            />
         </div>
         Быстрая отправка
      </div>
   );
};

export default StickyTopBanner;
