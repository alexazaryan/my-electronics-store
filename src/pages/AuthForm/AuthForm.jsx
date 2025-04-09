import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../utils/firebase";
import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { setUser, clearUser } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

import styles from "./AuthForm.module.css";
import { clearViewedNews } from "../../store/newsSlice";
import { clearFavorites, fetchFavorites } from "../../store/favoriteSlice";

const AuthForm = () => {
   const [isLogin, setIsLogin] = useState(true);
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      confirmPassword: "",
   });
   const [error, setError] = useState("");
   const [successMessage, setSuccessMessage] = useState("");
   const { user, isAdmin } = useSelector((state) => state.auth);
   const dispatch = useDispatch();

   const navigate = useNavigate();

   // Очистка формы и сообщений при переключении между входом и регистрацией
   useEffect(() => {
      setFormData({ email: "", password: "", confirmPassword: "" });
      setError("");
      setSuccessMessage("");
   }, [isLogin]);

   // Очистка формы и сообщений при выходе
   const handleLogout = async () => {
      try {
         await signOut(auth);

         dispatch(clearViewedNews()); // очищает просмотренные новости
         dispatch(clearFavorites()); // очищает избранное

         dispatch(clearUser());
         setFormData({ email: "", password: "", confirmPassword: "" });
         setSuccessMessage("");

         navigate("/"); // редирект на главную страницу
      } catch (error) {
         console.error("Ошибка при выходе:", error);
      }
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccessMessage("");

      if (!isLogin && formData.password !== formData.confirmPassword) {
         setError("Пароли не совпадают");
         return;
      }

      try {
         let userCredential;
         if (isLogin) {
            // Логин
            userCredential = await signInWithEmailAndPassword(
               auth,
               formData.email,
               formData.password
            );
         } else {
            // Регистрация
            userCredential = await createUserWithEmailAndPassword(
               auth,
               formData.email,
               formData.password
            );
            // Сохраняем пользователя в Firestore с ролью "user" по умолчанию
            await setDoc(doc(db, "users", userCredential.user.uid), {
               email: formData.email,
               role: "user", // По умолчанию роль "user"
            });
         }

         // Проверяем, является ли пользователь админом
         const adminDoc = await getDoc(doc(db, "myStores", "admin-1"));
         if (adminDoc.exists() && adminDoc.data().email === formData.email) {
            // Пользователь — админ
            dispatch(
               setUser({
                  user: { email: formData.email, uid: userCredential.user.uid },
                  role: "admin",
               })
            );
         } else {
            // Пользователь — обычный пользователь
            const userDoc = await getDoc(
               doc(db, "users", userCredential.user.uid)
            );
            if (!userDoc.exists()) {
               throw new Error("Данные пользователя не найдены в Firestore.");
            }

            const userRole = userDoc.data().role;

            dispatch(
               setUser({
                  user: { email: formData.email, uid: userCredential.user.uid },
                  role: userRole,
               })
            );
         }

         setSuccessMessage(
            isLogin
               ? `Вы вошли как ${formData.email}`
               : `Пользователь ${formData.email} успешно зарегистрирован`
         );

         setFormData({ email: "", password: "", confirmPassword: "" });
         // ошибки при регистрации или входе
      } catch (error) {
         console.error("Ошибка аутентификации:", error);
         switch (error.code) {
            case "auth/email-already-in-use":
               setError("Пользователь с таким email уже существует.");
               break;
            case "auth/invalid-email":
               setError("Некорректный email.");
               break;
            case "auth/weak-password":
               setError("Пароль должен содержать не менее 6 символов.");
               break;
            case "auth/user-not-found":
               setError("Пользователь с таким email не найден.");
               break;
            case "auth/wrong-password":
               setError("Неверный пароль.");
               break;
            default:
               setError("Неправельный email или password");
         }
      }
   };

   useEffect(() => {
      if (user) {
         dispatch(fetchFavorites()); // загружаем избранные для этого user
      }
   }, [user, dispatch]);

   if (user) {
      return (
         <div className={styles["auth-form-container"]}>
            <div className="auth-form-container__wrap-welcome-emoji-img">
               <img
                  className={styles["auth-form-container__welcome-emoji-img"]}
                  // src="/welcome-emoji.png"
                  src={`${import.meta.env.BASE_URL}welcome-emoji.png`}
                  alt="веселый смайлик"
               />
            </div>
            <h2 className={styles["auth-form-title"]}>Вы вошли в систему</h2>
            <p>
               <strong>Email:</strong>
               <span className={styles["auth-form-container__value"]}>
                  {user.email}
               </span>
            </p>
            <p>
               <strong>Пользователь:</strong>
               <span className={styles["auth-form-container__value"]}>
                  {isAdmin ? "admin" : "user"}
               </span>
            </p>
            <button
               onClick={handleLogout}
               className={styles["auth-form-button"]}
            >
               Выйти
            </button>
         </div>
      );
   }

   return (
      <div className={styles["auth-form-container"]}>
         <form onSubmit={handleSubmit} className={styles["auth-form"]}>
            <div className={styles["auth-form-container__wrap-emoji-pointer"]}>
               <img
                  // src="/emoji-pointer.png"
                  src={`${import.meta.env.BASE_URL}emoji-pointer.png`}
                  alt="смайлик регистрации или входа"
                  className={styles["auth-form-container__emoji-pointer"]}
               />
            </div>
            <h2 className={styles["auth-form-title"]}>
               {isLogin ? "Вход" : "Регистрация"}
            </h2>
            <p
               className={`${styles["auth-form-error"]} ${
                  error ? styles["visible"] : ""
               }`}
            >
               {error ? `${error}` : ""}
            </p>
            {successMessage && (
               <p className={styles["auth-form-success"]}>{successMessage}</p>
            )}
            <div className={styles["auth-form-group"]}>
               <label>Email:</label>
               <input
                  className={styles["auth-form-group__email"]}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
               />
            </div>
            <div className={styles["auth-form-group"]}>
               <label>Пароль:</label>
               <input
                  className={styles["auth-form-group__password"]}
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  value={formData.password}
                  onChange={handleChange}
                  required
               />
            </div>
            {!isLogin && (
               <div className={styles["auth-form-group"]}>
                  <label>Подтвердите пароль:</label>
                  <input
                     className={styles["auth-form-group__password"]}
                     type="password"
                     name="confirmPassword"
                     placeholder="Подтвердите пароль"
                     value={formData.confirmPassword}
                     onChange={handleChange}
                     required
                  />
               </div>
            )}
            <button type="submit" className={styles["auth-form-button"]}>
               {isLogin ? "Войти" : "Зарегистрироваться"}
            </button>
         </form>
         <div className={styles["auth-form-toggle"]}>
            {isLogin ? (
               <p>
                  Нет аккаунта?
                  <span
                     className={styles["auth-form-toggle-link"]}
                     onClick={() => setIsLogin(false)}
                  >
                     Зарегистрироваться
                  </span>
               </p>
            ) : (
               <p>
                  Уже есть аккаунт?
                  <span
                     className={styles["auth-form-toggle-link"]}
                     onClick={() => setIsLogin(true)}
                  >
                     Войти
                  </span>
               </p>
            )}
         </div>
      </div>
   );
};

export default AuthForm;
