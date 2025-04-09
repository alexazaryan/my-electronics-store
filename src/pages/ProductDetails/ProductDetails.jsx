import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import Spinner from "../../components/Spinner/Spinner";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
   const { id } = useParams();
   const [product, setProduct] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [images, setImages] = useState([]);
   const [imageIndex, setImageIndex] = useState(0);
   const [transition, setTransition] = useState(true);

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            const productRef = doc(db, "products", id);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
               const data = productSnap.data();
               // Ограничиваем количество изображений до 15
               const imageArray = data.imageUrl.split(",").slice(0, 15);
               setProduct(data);
               setImages(imageArray);
               setImageIndex(0);
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
            <div className={styles["wrap-slider"]}>
               <div className={styles["product-image-box"]}>
                  {images.length > 1 && (
                     <BiChevronLeft
                        className={styles["arrow-left"]}
                        onClick={() => changeImage("left")}
                     />
                  )}
                  <div className={styles["slider-container"]}>
                     <div
                        className={styles["image-slider"]}
                        style={{
                           transform: `translateX(-${imageIndex * 100}%)`,
                           transition: transition
                              ? "transform 0.5s ease-in-out"
                              : "none",
                        }}
                     >
                        {images.map((img, index) => (
                           <div key={index} className={styles["slide"]}>
                              <img
                                 src={img}
                                 alt={`${product.name} ${index + 1}`}
                                 className={styles["main-image"]}
                              />
                           </div>
                        ))}
                     </div>
                  </div>
                  {images.length > 1 && (
                     <BiChevronRight
                        className={styles["arrow-right"]}
                        onClick={() => changeImage("right")}
                     />
                  )}
               </div>
               {images.length > 1 && (
                  <div className={styles["image-dots"]}>
                     {images.map((_, index) => (
                        <span
                           key={index}
                           className={`${styles["dot"]} ${
                              index === imageIndex ? styles["active-dot"] : ""
                           }`}
                           onClick={() => handleDotClick(index)}
                        ></span>
                     ))}
                  </div>
               )}
            </div>

            {/* Инфо о товаре */}
            <div className={styles["product-info"]}>
               <h2 className={styles["product-name"]}>{product.name}</h2>
               <p className={styles["product-description"]}>
                  {product.description}
               </p>
               <p className={styles["product-price"]}>Цена: ${product.price}</p>
            </div>
         </div>
      </div>
   );
};

export default ProductDetails;
