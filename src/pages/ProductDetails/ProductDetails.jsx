import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../..//utils/firebase"; // Импорт Firebase
import Spinner from "../../components/Spinner/Spinner";

import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
   const { id } = useParams();
   const [product, setProduct] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            const productRef = doc(db, "products", id);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
               setProduct(productSnap.data());
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

   return (
      <div className={styles["product-details"]}>
         {loading && <Spinner />}
         {error && <p className={styles["error-message"]}>{error}</p>}
         {product && (
            <div className={styles["product-content"]}>
               <div className={styles["image-container"]}>
                  <img
                     src={product.imageUrl.split(",")[0]}
                     alt={product.name}
                     className={styles["product-image"]}
                  />
               </div>
               <div className={styles["product-info"]}>
                  <h2 className={styles["product-name"]}>{product.name}</h2>
                  <p className={styles["product-description"]}>
                     {product.description}
                  </p>
                  <p className={styles["product-price"]}>
                     Цена: ${product.price}
                  </p>
               </div>
            </div>
         )}
      </div>
   );
};

export default ProductDetails;
