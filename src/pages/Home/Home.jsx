import { useSelector } from "react-redux";
import ProductCircleSlider from "../../components/ProductCircleSlider/ProductCircleSlider";
import ProductList from "../../components/ProductList/ProductList";

export default function Home() {
   const { status } = useSelector((state) => state.products);

   return (
      <div>
         {status === "succeeded" && (
            <div>
               <ProductCircleSlider />
               <h2>Лучшие предложения</h2>
            </div>
         )}
         <ProductList />
      </div>
   );
}
