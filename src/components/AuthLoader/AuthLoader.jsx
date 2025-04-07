import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChangedListener } from "../../utils/firebase";
import { setUser, clearUser } from "../../store/authSlice";
import { db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthLoader = ({ children }) => {
   const dispatch = useDispatch();

   useEffect(() => {
      const unsubscribe = onAuthStateChangedListener(async (user) => {
         if (user) {
            try {
               const userRef = doc(db, "users", user.uid);
               const userSnap = await getDoc(userRef);
               const userData = userSnap.exists() ? userSnap.data() : {};

               dispatch(
                  setUser({
                     user: { email: user.email, uid: user.uid },
                     role: userData.role || "user", // fallback на user
                  })
               );
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
