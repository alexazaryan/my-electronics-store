import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./ProductCircleSlider.module.css";

const ProductCircleSlider = () => {
   const navigate = useNavigate();
   const products = useSelector((state) => state.products.items);
   const user = useSelector((state) => state.auth.user);
   const [displayProducts, setDisplayProducts] = useState([]);
   const wrapperRef = useRef(null); // ref на внешний div
   const containerRef = useRef(null);
   const contentRef = useRef(null);
   const animationRef = useRef(null);
   const [position, setPosition] = useState(0);
   const directionRef = useRef(1);
   const [isHovered, setIsHovered] = useState(false);
   const touchStartX = useRef(null);
   const [isVisible, setIsVisible] = useState(true);

   // Наблюдение за областью видимости
   useEffect(() => {
      const observer = new IntersectionObserver(
         ([entry]) => {
            setIsVisible(entry.isIntersecting);
         },
         { threshold: 0.1 }
      );

      const el = wrapperRef.current;
      if (el) observer.observe(el);

      return () => {
         if (el) observer.unobserve(el);
      };
   }, []);

   // Получение товаров
   useEffect(() => {
      const getDisplayProducts = () => {
         const userId = user?.id || "anonymous";
         const key = `viewedProducts_${userId}`;
         const viewedItems = JSON.parse(localStorage.getItem(key)) || [];

         const viewed = viewedItems
            .map((id) => products.find((p) => p.id === id))
            .filter(Boolean)
            .slice(0, 15);

         if (viewed.length < 15) {
            const remaining = 15 - viewed.length;
            const available = products.filter(
               (p) => !viewedItems.includes(p.id)
            );
            const random = [...available]
               .sort(() => 0.5 - Math.random())
               .slice(0, remaining);
            return [...viewed, ...random];
         }

         return viewed;
      };

      setDisplayProducts(getDisplayProducts());
   }, [products, user]);

   // Анимация
   useEffect(() => {
      if (
         !containerRef.current ||
         !contentRef.current ||
         displayProducts.length === 0
      )
         return;

      const container = containerRef.current;
      const content = contentRef.current;
      const containerWidth = container.offsetWidth;
      const contentWidth = content.scrollWidth;

      const animate = () => {
         if (isHovered || !isVisible) {
            animationRef.current = requestAnimationFrame(animate);
            return;
         }

         setPosition((prev) => {
            const newPos = prev + directionRef.current * 0.3;
            if (newPos >= 0) {
               directionRef.current = -1;
               return prev + directionRef.current * 0.3;
            }
            if (newPos <= -(contentWidth - containerWidth)) {
               directionRef.current = 1;
               return prev + directionRef.current * 0.3;
            }
            return newPos;
         });

         animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationRef.current);
   }, [displayProducts, isHovered, isVisible]);

   // Обновление transform
   useEffect(() => {
      if (contentRef.current) {
         contentRef.current.style.transform = `translateX(${position}px)`;
      }
   }, [position]);

   // Touch
   const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
   };

   const handleTouchMove = (e) => {
      if (touchStartX.current === null) return;
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - touchStartX.current;

      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;

      setPosition((prev) => {
         const next = prev + deltaX;
         const maxLeft = 0;
         const maxRight = -(contentWidth - containerWidth);
         return Math.max(Math.min(next, maxLeft), maxRight);
      });

      touchStartX.current = currentX;
   };

   const handleTouchEnd = () => {
      touchStartX.current = null;
   };

   return (
      <div ref={wrapperRef}>
         <div className={styles.sliderContainer}>
            <h3 className={styles.sliderTitle}>
               {displayProducts.some((p) => p?.viewed)
                  ? "Вы часто смотрите"
                  : "Рекомендуемые"}
            </h3>

            <div
               ref={containerRef}
               className={styles.sliderContainerInner}
               onMouseEnter={() => setIsHovered(true)}
               onMouseLeave={() => setIsHovered(false)}
            >
               <div
                  ref={contentRef}
                  className={styles.sliderContent}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
               >
                  {displayProducts.map((product) => (
                     <div
                        key={product.id}
                        className={styles.productCircle}
                        onClick={() => navigate(`/product/${product.id}`)}
                     >
                        <img
                           src={
                              product.images?.[0] ||
                              product.imageUrl?.split(",")[0] ||
                              "/logo.png"
                           }
                           alt={product.name}
                           className={styles.productImage}
                           loading="lazy"
                        />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default ProductCircleSlider;
