import { Routes, Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import ProductForm from "../pages/ProductForm/ProductForm";
import Home from "../pages/Home/Home";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import AdminRoute from "../components/AdminRoute/AdminRoute";
import AdminOrdersPage from "../pages/AdminOrdersPage/AdminOrdersPage";
import AdminProductsPage from "../pages/AdminProductsPage/AdminProductsPage";

const AppRoutes = () => {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route
               path="product-form"
               element={
                  <AdminRoute>
                     <ProductForm />
                  </AdminRoute>
               }
            />

            <Route
               path="admin-products"
               element={
                  <AdminRoute>
                     <AdminProductsPage />
                  </AdminRoute>
               }
            />

            <Route
               path="admin-orders"
               element={
                  <AdminRoute>
                     <AdminOrdersPage />
                  </AdminRoute>
               }
            />

            <Route path="/product/:id" element={<ProductDetails />} />
         </Route>
      </Routes>
   );
};

export default AppRoutes;
