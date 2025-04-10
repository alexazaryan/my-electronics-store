import { useEffect } from "react";

const useBodyOverflow = (isVisible) => {
   useEffect(() => {
      const scrollbarWidth =
         window.innerWidth - document.documentElement.clientWidth;

      if (isVisible) {
         requestAnimationFrame(() => {
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.documentElement.style.setProperty(
               "--scrollbar-width",
               `${scrollbarWidth}px`
            );
         });
      } else {
         document.body.style.overflow = "auto";
         document.body.style.paddingRight = "0";
         document.documentElement.style.setProperty("--scrollbar-width", "0");
      }

      return () => {
         document.body.style.overflow = "auto";
         document.body.style.paddingRight = "0";
         document.documentElement.style.setProperty("--scrollbar-width", "0");
      };
   }, [isVisible]);
};

export default useBodyOverflow;
