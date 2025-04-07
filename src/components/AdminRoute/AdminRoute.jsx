import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AdminRoute({ children }) {
   const user = useSelector((state) => state.auth.user);
   const isAdmin = useSelector((state) => state.auth.isAdmin);

   const navigate = useNavigate();

   useEffect(() => {
      if (!user || !isAdmin) {
         navigate("/");
      }
   }, [isAdmin, user]);

   return user && isAdmin ? children : null;
}
