import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import Spinner from "../../components/Spinner/Spinner";
import {
   BiChevronLeft,
   BiChevronRight,
   BiHeart,
   BiSolidHeart,
   BiChevronDown,
   BiChevronUp,
} from "react-icons/bi";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../store/favoriteSlice";
import { togglePanel } from "../../store/sidePanelSlice";
import RelatedProducts from "../../components/RelatedProducts/RelatedProducts";
import { BsCartDash } from "react-icons/bs";

import { setSelectedProduct } from "../../store/productsSlice"; //add prise

import styles from "./ProductDetails.module.css";
import { toggleFavorites } from "../../store/menuSlice";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";

const ProductDetails = () => {
   const { id } = useParams();
   const [product, setProduct] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [images, setImages] = useState([]);
   const [imageIndex, setImageIndex] = useState(0);
   const [transition, setTransition] = useState(true);

   const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); //open характеристики

   const dispatch = useDispatch();
   const favorites = useSelector((state) => state.favorite.items);
   const isRegistered = useSelector((state) => !!state.auth.user);
   const isFavorite = favorites.some((fav) => fav.productId === id);

   const touchStartX = useRef(null);
   const touchEndX = useRef(null);

   const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
   };

   const handleTouchMove = (e) => {
      touchEndX.current = e.touches[0].clientX;
   };

   const handleTouchEnd = () => {
      if (!touchStartX.current || !touchEndX.current) return;

      const distance = touchStartX.current - touchEndX.current;

      if (distance > 50) changeImage("right");
      if (distance < -50) changeImage("left");

      touchStartX.current = null;
      touchEndX.current = null;
   };

   // добавление товара
   useEffect(() => {
      const fetchProduct = async () => {
         try {
            const productRef = doc(db, "products", id);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
               const data = productSnap.data();

               const imageArray = Array.isArray(data.images)
                  ? data.images.slice(0, 15)
                  : (data.imageUrl?.split(",") || []).slice(0, 15);
               setProduct(data);
               setImages(imageArray);
               setImageIndex(0);

               dispatch(setSelectedProduct({ ...data, id })); // ✅ вот сюда
            } else {
               setError("Товар не найден");
            }
         } catch (err) {
            setError("Ошибка загрузки данных");
         } finally {
            setLoading(false);
         }
      };

      fetchProduct();
   }, [id]);

   const changeImage = (direction) => {
      setTransition(true);
      if (direction === "left") {
         setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else {
         setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
   };

   const handleDotClick = (index) => {
      setTransition(true);
      setImageIndex(index);
   };

   if (loading) return <Spinner />;
   if (error) return <p className={styles["error-message"]}>{error}</p>;

   return (
      <div className={styles["product-details"]}>
         <div className={styles["product-content"]}>
            {/* Блок изображения и стрелок */}
            <div className={styles["wrap-slider__slider-button"]}>
               <div className={styles["wrap-slider"]}>
                  {/* стрелки слайдера */}
                  <div className={styles["product-image-box"]}>
                     {images.length > 0 && (
                        <BiChevronLeft
                           className={styles["arrow-left"]}
                           onClick={() => changeImage("left")}
                        />
                     )}

                     {/* Иконка избранного */}
                     <div
                        className={styles["product-list__favorite-icon"]}
                        onClick={(e) => {
                           e.stopPropagation();
                           if (!isRegistered) {
                              dispatch(togglePanel());
                           } else {
                              dispatch(toggleFavorite(id));
                           }
                        }}
                     >
                        {isFavorite ? (
                           <BiSolidHeart
                              style={{
                                 fill: "red",
                                 stroke: "black",
                                 strokeWidth: "1px",
                              }}
                              size={20}
                           />
                        ) : (
                           <BiHeart size={20} />
                        )}
                     </div>

                     <div
                        className={styles["slider-container"]}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                     >
                        <div
                           className={styles["image-slider"]}
                           style={{
                              transform: `translateX(-${imageIndex * 100}%)`,
                              transition: transition
                                 ? "transform 0.2s ease-in-out"
                                 : "none",
                           }}
                        >
                           {/* фото */}
                           {images.map((img, index) => (
                              <div key={index} className={styles["slide"]}>
                                 <img
                                    src={img}
                                    alt={
                                       product?.name
                                          ? `${product.name} ${index + 1}`
                                          : `Product image ${index + 1}`
                                    }
                                    className={styles["main-image"]}
                                 />
                              </div>
                           ))}
                        </div>
                     </div>
                     {images.length > 0 && (
                        <BiChevronRight
                           className={styles["arrow-right"]}
                           onClick={() => changeImage("right")}
                        />
                     )}
                  </div>

                  {/* слайдер */}
                  {images.length > 0 && (
                     <div className={styles["image-dots"]}>
                        {images.map((_, index) => (
                           <span
                              key={index}
                              className={`${styles["dot"]} ${
                                 index === imageIndex
                                    ? styles["active-dot"]
                                    : ""
                              }`}
                              onClick={() => handleDotClick(index)}
                           ></span>
                        ))}
                     </div>
                  )}
               </div>

               {/* блок кнопок */}
               <div className={styles["product__tab-button-group"]}>
                  <div className={styles["description-container"]}>
                     <div
                        className={`${styles["product-description"]} ${
                           !isDescriptionExpanded
                              ? styles["description-collapsed"]
                              : ""
                        }`}
                        dangerouslySetInnerHTML={{
                           __html: product.description,
                        }}
                     />
                  </div>
                  <CustomButton
                     className={styles["product__tab-button"]}
                     onClick={() =>
                        setIsDescriptionExpanded(!isDescriptionExpanded)
                     }
                  >
                     {isDescriptionExpanded ? (
                        <>
                           Свернуть описание <BiChevronUp />
                        </>
                     ) : (
                        <>
                           Описание товара <BiChevronDown />
                        </>
                     )}
                  </CustomButton>
               </div>
            </div>

            {/* Инфо о товаре */}
            <div className={styles["product-info"]}>
               <h2 className={styles["product-name"]}>{product.name}</h2>

               <div className={styles["product-info-row"]}>
                  <p className={styles["availability"]}>
                     {true ? "В наличии" : "Нет в наличии"}
                  </p>

                  <p className={styles["product-code"]}>
                     <strong>Код товара:</strong>{" "}
                     <span className={styles["product-code__value"]}>
                        {product.code?.trim() || "---"}
                     </span>
                  </p>
               </div>

               <div>
                  <ul className={styles["product-price-box"]}>
                     <li className={styles["product-price"]}>
                        {product.price.toLocaleString("uk-UA")} ₴
                     </li>
                     <li className={styles["product-cart-icon"]}>
                        {/* добавить в корзину */}
                        <BsCartDash />
                     </li>
                  </ul>
                  <CustomButton
                     className={styles["product-price__buy"]}
                     onClick={() => {
                        if (!isRegistered) {
                           dispatch(togglePanel());
                        } else {
                           if (!favorites.some((fav) => fav.productId === id)) {
                              dispatch(toggleFavorite(id)); // ✅ добавить только если ещё нет
                           }
                           dispatch(toggleFavorites()); // открыть список
                        }
                     }}
                  >
                     Купить
                  </CustomButton>
               </div>
            </div>
         </div>
         <RelatedProducts currentId={id} category={product.category} />

         <ScrollToTopButton />
      </div>
   );
};

export default ProductDetails;
