import { useEffect, useState } from "react";
import styles from "./StickyTopBanner.module.css";

// баннеры с текстами и изображениями
const banners = [
   { text: "Быстрая доставка по Украине", img: "delivery-truck.png" },
   { text: "Акции и скидки каждую неделю", img: "discount.png" },
   { text: "Более 10 000 довольных клиентов", img: "rating.png" },
   { text: "Поддержка 24/7", img: "support.png" },
   { text: "Оплата при получении", img: "cart.png" },
];

const StickyTopBanner = () => {
   const [currentIndex, setCurrentIndex] = useState(0); // текущий баннер
   const nextIndex = (currentIndex + 1) % banners.length; // следующий баннер
   const [animate, setAnimate] = useState(false);

   useEffect(() => {
      const interval = setInterval(() => {
         setAnimate(true);
         setTimeout(() => {
            setAnimate(false);
            setCurrentIndex(nextIndex);
         }, 300);
      }, 2000);

      return () => clearInterval(interval);
   }, [nextIndex]);

   return (
      <div className={styles.banner}>
         <div
            className={`${styles.bannerContent} ${
               animate ? styles.exit : styles.active
            }`}
         >
            <img
               className={styles.bannerImg}
               src={`${import.meta.env.BASE_URL}${banners[currentIndex].img}`}
               alt={banners[currentIndex].text}
            />
            <span className={styles.bannerText}>
               {banners[currentIndex].text}
            </span>
         </div>

         <div
            className={`${styles.bannerContent} ${
               animate ? styles.enter : styles.hidden
            }`}
         >
            <img
               className={styles.bannerImg}
               src={`${import.meta.env.BASE_URL}${banners[nextIndex].img}`}
               alt={banners[nextIndex].text}
            />
            <span className={styles.bannerText}>{banners[nextIndex].text}</span>
         </div>
      </div>
   );
};

export default StickyTopBanner;
