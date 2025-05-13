import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "./index.css";

// добавим Google Analytics скрипт
const script = document.createElement("script");
script.src = "https://www.googletagmanager.com/gtag/js?id=G-SF6G1PRZ48";
script.async = true;
document.head.appendChild(script);

script.onload = () => {
   window.dataLayer = window.dataLayer || [];
   function gtag() {
      window.dataLayer.push(arguments);
   }
   gtag("js", new Date());
   gtag("config", "G-SF6G1PRZ48"); // твой ID
};

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <App />
   </StrictMode>
);
