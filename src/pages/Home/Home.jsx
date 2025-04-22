import { useSelector } from "react-redux";
import ProductCircleSlider from "../../components/ProductCircleSlider/ProductCircleSlider";
import ProductList from "../../components/ProductList/ProductList";
import TrustSlider from "../../components/TrustSlider/TrustSlider";

export default function Home() {
   const { status } = useSelector((state) => state.products);

   return (
      <div>
         {status === "succeeded" && (
            <div>
               <TrustSlider />
               <ProductCircleSlider />
               <h2>Лучшие предложения</h2>
            </div>
         )}
         <ProductList />
      </div>
   );
}
