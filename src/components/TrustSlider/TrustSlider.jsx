import { useState, useEffect, useRef } from "react";
import styles from "./TrustSlider.module.css";

const banners = [
   {
      id: 1,
      src: `${import.meta.env.BASE_URL}guarantee.png`,
      alt: "Гарантия возврата 14 дней",
   },
   {
      id: 2,
      src: `${import.meta.env.BASE_URL}delivery.png`,
      alt: "Быстрая доставка по Украине",
   },
   {
      id: 3,
      src: `${import.meta.env.BASE_URL}support.png`,
      alt: "Поддержка в Telegram 24/7",
   },
   {
      id: 4,
      src: `${import.meta.env.BASE_URL}clients.png`,
      alt: "1000+ довольных клиентов",
   },
];

const TrustSlider = () => {
   const [current, setCurrent] = useState(0);
   const [paused, setPaused] = useState(false);
   const timeoutRef = useRef(null);

   useEffect(() => {
      if (!paused) {
         timeoutRef.current = setTimeout(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
         }, 3000);
      }
      return () => clearTimeout(timeoutRef.current);
   }, [current, paused]);

   const goToSlide = (index) => setCurrent(index);

   return (
      <div
         className={styles.sliderWrap}
         onMouseEnter={() => setPaused(true)}
         onMouseLeave={() => setPaused(false)}
      >
         <div
            className={styles.slider}
            style={{ transform: `translateX(-${current * 100}%)` }}
         >
            {banners.map((banner) => (
               <img
                  key={banner.id}
                  src={banner.src}
                  alt={banner.alt}
                  className={styles.slide}
               />
            ))}
         </div>

         <div className={styles.dots}>
            {banners.map((_, index) => (
               <button
                  key={index}
                  className={`${styles.dot} ${
                     index === current ? styles.activeDot : ""
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Слайд ${index + 1}`}
               />
            ))}
         </div>
      </div>
   );
};

export default TrustSlider;
