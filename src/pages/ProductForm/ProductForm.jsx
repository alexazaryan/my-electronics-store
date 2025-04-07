import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../store/productsSlice";
import { uploadImageToImgBB } from "../../utils/uploadImage";
import { MdAdd } from "react-icons/md";
import CustomButton from "../../components/CustomButton/CustomButton";
import CsvUpload from "../../components/CsvUpload/CsvUpload";

import styles from "./ProductForm.module.css"; // Ваши стили
import AdminNewsEditor from "../../components/AdminNewsEditor/AdminNewsEditor";

const ProductForm = () => {
   const dispatch = useDispatch();
   const [productData, setProductData] = useState({
      category: "Все товары",
      imageUrl: "",
      name: "",
      description: "",
      price: "",
   });

   const [success, setSuccess] = useState(false);
   const [error, setError] = useState(null);
   const [formErrors, setFormErrors] = useState({
      category: false,
      name: false,
      description: false,
      price: false,
      imageUrl: false,
   });

   const fileInputRef = useRef(null);

   const handleInputChange = (e) => {
      const { name, value } = e.target;

      setProductData({
         ...productData,
         [name]: value,
      });
   };

   const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (file) {
         try {
            const imageUrl = await uploadImageToImgBB(file);
            setProductData({ ...productData, imageUrl });
         } catch (error) {
            setError("Ошибка загрузки изображения");
         }
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      // Проверка данных
      let errors = {
         category: !productData.category,
         name: !productData.name,
         description: !productData.description,
         price: isNaN(productData.price) || productData.price <= 0,
         imageUrl: !productData.imageUrl,
      };

      setFormErrors(errors);

      // Если есть ошибки, не отправляем форму
      if (Object.values(errors).includes(true)) {
         setError("Пожалуйста, заполните все поля корректно.");
         return;
      }

      setError(null);

      try {
         await dispatch(
            addProduct({
               ...productData,
               price: Number(productData.price),
            })
         );
         setSuccess(true);
         alert("Товар добавлен!");

         // Очищаем форму
         setProductData({
            name: "",
            description: "",
            price: "",
            imageUrl: "",
            category: "",
         });

         // Очищаем input для изображения
         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }
      } catch (error) {
         console.error("Ошибка при добавлении товара:", error);
         setError("Ошибка при добавлении товара в базу.");
      }
   };

   return (
      <>
         <h3 className={styles["product-form__title"]}>Admin room</h3>
         <div className={styles["product-form"]}>
            <form className={styles["form"]} onSubmit={handleSubmit}>
               <h4>
                  <u>Загрузка индивидуального товара</u>
               </h4>

               {/* Выбор категории товара */}
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
                     <option value="Все товары">Все товары</option>
                     <option value="Машины">Машины</option>
                     <option value="Аксессуары">Аксессуары</option>
                     <option value="Смартфоны">Смартфоны</option>
                     <option value="Ноутбуки">Ноутбуки</option>
                     <option value="Носки">Носки</option>
                  </select>
               </div>
               {/* Название товара */}
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
               {/* Описание товара */}
               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>
                     Описание товара:
                  </label>
                  <input
                     className={`${styles["form__input"]} ${
                        formErrors.description
                           ? styles["form__input--error"]
                           : ""
                     }`}
                     type="text"
                     name="description"
                     placeholder="Описание товара"
                     value={productData.description}
                     onChange={handleInputChange}
                  />
               </div>
               {/* Цена товара */}
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
               {/* Изображение товара */}
               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>
                     Изображение товара:
                  </label>
                  <input
                     ref={fileInputRef}
                     className={`${styles["form__fileInput"]} ${
                        formErrors.imageUrl
                           ? styles["form__fileInput--error"]
                           : ""
                     }`}
                     type="file"
                     accept="image/*"
                     onChange={handleImageUpload}
                  />
                  <div className={styles["form-wrap__add-img"]}>
                     {productData.imageUrl ? (
                        <img
                           className={styles["form__image"]}
                           src={productData.imageUrl}
                           alt="Uploaded"
                        />
                     ) : (
                        <MdAdd />
                     )}
                  </div>
               </div>
               {error && <p className={styles["form__error"]}>{error}</p>}
               {success && (
                  <p className={styles["form__success"]}>
                     Товар успешно добавлен!
                  </p>
               )}
               <CustomButton onClick={handleSubmit}>
                  Добавить товар
               </CustomButton>
            </form>
            <div className={styles["form__up-load"]}>
               <h4>
                  <u>Загрузка файлов типов .CSV</u>
               </h4>
               <div className={styles["form__up-load--component"]}>
                  <CsvUpload />
               </div>
            </div>

            <div>
               <div>
                  <AdminNewsEditor />
               </div>
            </div>
         </div>
      </>
   );
};

export default ProductForm;
