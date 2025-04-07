import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import AppRoutes from "./routes/routes";
import AuthLoader from "./components/AuthLoader/AuthLoader";

const App = () => {
   return (
      <Provider store={store}>
         <Router>
            <AuthLoader>
               <AppRoutes />
            </AuthLoader>
         </Router>
      </Provider>
   );
};

export default App;
