import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../store/productsSlice";
import { uploadImageToImgBB } from "../../utils/uploadImage";
import CustomButton from "../../components/CustomButton/CustomButton";
import CsvUpload from "../../components/CsvUpload/CsvUpload";
import AdminNewsEditor from "../../components/AdminNewsEditor/AdminNewsEditor";

import styles from "./ProductForm.module.css";

const ProductForm = () => {
   const dispatch = useDispatch();
   const fileInputRef = useRef(null);

   // начальное сосояние полей
   const [productData, setProductData] = useState({
      category: "",
      name: "",
      description: "",
      code: "",
      price: "",
      images: [],
   });

   const [success, setSuccess] = useState(false);
   const [error, setError] = useState(null);

   const [formErrors, setFormErrors] = useState({
      category: false,
      name: false,
      description: false,
      price: false,
      images: false,
      code: false,
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProductData((prev) => ({
         ...prev,
         [name]: value.replace(/^\s+/, ""),
      }));
   };

   const handleMultiImageUpload = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length < 2 || files.length > 15) {
         setError("Загрузите от 2 до 15 изображений.");
         return;
      }

      try {
         const urls = await Promise.all(files.map(uploadImageToImgBB));
         setProductData((prev) => ({
            ...prev,
            images: urls,
         }));
         setError(null);
      } catch (err) {
         console.error(err);
         setError("Ошибка при загрузке изображений");
      }
   };

   // форма отправки на фаирбуйс данные
   const handleSubmit = async (e) => {
      e.preventDefault();

      // ошибки при заполнеии
      const errors = {
         category: !productData.category.trim(),
         name: !productData.name.trim(),
         description: !productData.description.trim(),
         price: isNaN(productData.price) || productData.price <= 0,
         images: productData.images.length < 2,
         code: !productData.code.trim(),
      };

      setFormErrors(errors);

      if (Object.values(errors).includes(true)) {
         setError("Пожалуйста, заполните все поля корректно.");
         return;
      }

      try {
         await dispatch(
            addProduct({
               ...productData,
               price: Number(productData.price),
            })
         );

         setSuccess(true);
         alert("Товар добавлен!");

         // очишаем форму
         setProductData({
            category: "",
            name: "",
            description: "",
            price: "",
            images: [],
            code: "",
         });

         if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
         console.error("Ошибка при добавлении товара:", err);
         setError("Ошибка при добавлении товара.");
      }
   };

   return (
      <>
         <h3 className={styles["product-form__title"]}>Admin room</h3>
         <div className={styles["product-form"]}>
            {/* индивидуальный товар  */}
            <form className={styles["form"]} onSubmit={handleSubmit}>
               <h4>
                  <u>Загрузка индивидуального товара</u>
               </h4>

               {/* Категория */}
               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>Категория:</label>
                  <select
                     className={`${styles["form__input"]} ${
                        formErrors.category ? styles["form__input--error"] : ""
                     }`}
                     name="category"
                     value={productData.category}
                     onChange={handleInputChange}
                  >
                     <option value="">Выберите категорию</option>
                     <option value="Машины">Машины</option>
                     <option value="Аксессуары">Аксессуары</option>
                     <option value="Смартфоны">Смартфоны</option>
                     <option value="Ноутбуки">Ноутбуки</option>
                     <option value="Носки">Носки</option>
                  </select>
               </div>

               {/* Название */}
               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>
                     Название товара:
                  </label>
                  <input
                     className={`${styles["form__input"]} ${
                        formErrors.name ? styles["form__input--error"] : ""
                     }`}
                     type="text"
                     name="name"
                     placeholder="Название товара"
                     value={productData.name}
                     onChange={handleInputChange}
                  />
               </div>

               {/* Описание */}
               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>Описание:</label>
                  <textarea
                     className={`${styles["form__input"]} ${
                        formErrors.description
                           ? styles["form__input--error"]
                           : ""
                     }`}
                     type="text"
                     name="description"
                     placeholder="Описание товара (не более 900 символов)"
                     value={productData.description}
                     onChange={handleInputChange}
                     maxLength={900}
                  />
               </div>

               {/* Код товара / Артикул */}
               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>
                     Код товара / Артикул:
                  </label>
                  <input
                     className={`${styles["form__input"]} ${
                        formErrors.code ? styles["form__input--error"] : ""
                     }`}
                     type="text"
                     name="code"
                     placeholder="Например: Арт. 1527-091"
                     value={productData.code}
                     onChange={handleInputChange}
                  />
               </div>

               {/* Цена */}
               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>Цена:</label>
                  <input
                     className={`${styles["form__input"]} ${
                        formErrors.price ? styles["form__input--error"] : ""
                     }`}
                     type="number"
                     name="price"
                     placeholder="Цена"
                     value={productData.price}
                     onChange={handleInputChange}
                  />
               </div>

               {/* Загрузка изображений */}
               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>
                     Загрузите от 2 до 15 изображений:
                  </label>
                  <input
                     ref={fileInputRef}
                     className={`${styles["form__fileInput"]} ${
                        formErrors.images
                           ? styles["form__fileInput--error"]
                           : ""
                     }`}
                     type="file"
                     accept="image/*"
                     multiple
                     onChange={handleMultiImageUpload}
                  />
               </div>

               {/* Превью изображений */}
               {productData.images.length > 0 && (
                  <div className={styles["form__image-preview-wrap"]}>
                     {productData.images.map((img, i) => (
                        <div key={i} className={styles["form__image-item"]}>
                           <img
                              src={img}
                              className={styles["form__image"]}
                              alt={`preview-${i}`}
                           />
                        </div>
                     ))}
                  </div>
               )}

               {/* Ошибки / Успех */}
               {error && <p className={styles["form__error"]}>{error}</p>}
               {success && (
                  <p className={styles["form__success"]}>
                     Товар успешно добавлен!
                  </p>
               )}

               <CustomButton
                  className={styles["form__add-product"]}
                  onClick={handleSubmit}
               >
                  Добавить товар
               </CustomButton>
            </form>

            <div className={styles["form__up-load-new"]}>
               {/* загрузка файлов */}
               <div className={styles["form__up-load"]}>
                  <h4>
                     <u>Загрузка файлов типов .CSV</u>
                  </h4>
                  <div className={styles["form__up-load--component"]}>
                     <CsvUpload />
                  </div>
               </div>

               {/* новости */}
               <div className={styles["form__new"]}>
                  <AdminNewsEditor />
               </div>
            </div>
         </div>
      </>
   );
};

export default ProductForm;
