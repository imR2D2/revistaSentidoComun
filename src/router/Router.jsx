import { useRoutes } from "react-router-dom";
// Pages
import App from "../App";
import NotFound from "@pages/auth/NotFound";

import TemplateAcademia from "@pages/academia/TemplateAcademia";
import LoginAcademia from "@pages/academia/LoginAcademia";
import Academia from "@pages/academia";

// Middlewares
import { Public, PublicWithDynamicTitle } from "@middlewares";

const Router = () => {
  const routes = useRoutes([
    { path: "/", element: <Public page={<App />} title="Código 27" /> },
    { path: "*", element: <Public page={<NotFound />} title="No Encontrado" /> },
    {
      path: "/academia/:titleURL",
      element: <PublicWithDynamicTitle page={<TemplateAcademia />} title="Post" />,
    },
    {
      path: "/academia/login",
      element: <Public page={<LoginAcademia />} title="Login Academia" />,
    },
    {
      path: "/academia",
      element: <Public page={<Academia />} title="Academia" />
    }
  ]);

  return routes;
};

export default Router;
