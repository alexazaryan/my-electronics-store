import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AdminRoute({ children }) {
   const user = useSelector((state) => state.auth.user);
   const isAdmin = useSelector((state) => state.auth.isAdmin);
   const isLoading = useSelector((state) => state.auth.isLoading); // 🔄 ждём загрузки

   const navigate = useNavigate();

   useEffect(() => {
      if (!isLoading && (!user || !isAdmin)) {
         navigate("/");
      }
   }, [isAdmin, user, isLoading]);

   if (isLoading) return null; // ⏳ пока грузится
   return user && isAdmin ? children : null;
}
