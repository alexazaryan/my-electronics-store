import { useEffect, useRef, useState } from "react";
import styles from "./ScrollToTopButton.module.css";

const ScrollToTopButton = () => {
   const [visible, setVisible] = useState(false);
   const lastY = useRef(window.scrollY);
   const scrollUpDistance = useRef(0);

   useEffect(() => {
      const handleScroll = () => {
         const currentY = window.scrollY;
         const scrollingUp = currentY < lastY.current;

         // Всегда скрывать, если меньше 500px от верха
         if (currentY < 500) {
            setVisible(false);
            scrollUpDistance.current = 0;
            lastY.current = currentY;
            return;
         }

         // Логика для отображения только при скролле вверх
         if (scrollingUp) {
            scrollUpDistance.current += lastY.current - currentY;
            setVisible(scrollUpDistance.current >= 50);
         } else {
            // При скролле вниз сбрасываем
            scrollUpDistance.current = 0;
            setVisible(false);
         }

         lastY.current = currentY;
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   return (
      <button
         onClick={scrollToTop}
         className={`${styles["scroll-to-top__button"]} ${
            visible ? styles.visible : ""
         }`}
         aria-label="Scroll to top"
      >
         <div className={styles["scroll-to-top__arrow"]}></div>
      </button>
   );
};

export default ScrollToTopButton;
