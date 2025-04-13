// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { onAuthStateChangedListener } from "../../utils/firebase";
// import { setUser, clearUser } from "../../store/authSlice";
// import { db } from "../../utils/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { fetchFavorites } from "../../store/favoriteSlice";
// import { fetchProducts } from "../../store/productsSlice";

// const AuthLoader = ({ children }) => {
//    const dispatch = useDispatch();

//    useEffect(() => {
//       const unsubscribe = onAuthStateChangedListener(async (user) => {
//          if (user) {
//             try {
//                const userRef = doc(db, "users", user.uid);
//                const userSnap = await getDoc(userRef);
//                const userData = userSnap.exists() ? userSnap.data() : {};

//                dispatch(
//                   setUser({
//                      user: { email: user.email, uid: user.uid },
//                      role: userData.role || "user", // fallback на user
//                   })
//                );

//                dispatch(fetchFavorites(user.uid)); // ✅ загружаем избранное
//                dispatch(fetchProducts()); // ✅ загружаем товары
//             } catch (error) {
//                console.error("Ошибка при получении роли из Firestore:", error);
//             }
//          } else {
//             dispatch(clearUser());
//          }
//       });

//       return () => unsubscribe();
//    }, [dispatch]);

//    return children;
// };

// export default AuthLoader;
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChangedListener, auth, db } from "../../utils/firebase"; // ✅ добавь auth
import { signOut } from "firebase/auth"; // ✅ импорт signOut
import { setUser, clearUser } from "../../store/authSlice";
import { doc, getDoc } from "firebase/firestore";
import { fetchFavorites } from "../../store/favoriteSlice";
import { fetchProducts } from "../../store/productsSlice";

const AuthLoader = ({ children }) => {
   const dispatch = useDispatch();

   useEffect(() => {
      // ✅ 1. Проверка параметра logout в URL
      const params = new URLSearchParams(window.location.search);
      if (params.get("logout") === "true") {
         signOut(auth); // ✅ Автоматический выход из аккаунта
      }

      // ✅ 2. Подписка на изменение авторизации
      const unsubscribe = onAuthStateChangedListener(async (user) => {
         if (user) {
            try {
               const userRef = doc(db, "users", user.uid);
               const userSnap = await getDoc(userRef);
               const userData = userSnap.exists() ? userSnap.data() : {};

               dispatch(
                  setUser({
                     user: { email: user.email, uid: user.uid },
                     role: userData.role || "user",
                  })
               );

               dispatch(fetchFavorites(user.uid));
               dispatch(fetchProducts());
            } catch (error) {
               console.error("Ошибка при получении роли из Firestore:", error);
            }
         } else {
            dispatch(clearUser());
         }
      });

      return () => unsubscribe();
   }, [dispatch]);

   return children;
};

export default AuthLoader;
