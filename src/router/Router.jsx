import { useRoutes } from "react-router-dom";
import { Routes } from "@router/routes";

// Pages
import App from "../App";
import NotFound from "@pages/auth/NotFound";

// Middlewares
import { Public } from "@middlewares";

const Router = () => {
  const routes = useRoutes([
    { path: "/", element: <Public page={<App />} title="Código 27" /> },
    { path: "*", element: <Public page={<NotFound />} title="No Encontrado" /> },
    ...Routes,
  ]);

  return routes;
};

export default Router;
