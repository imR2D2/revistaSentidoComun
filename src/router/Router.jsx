import { useRoutes } from "react-router-dom";

// Pages
import NotFound from "@pages/auth/NotFound";
import TemplateAcademia from "@pages/academia/TemplateAcademia";
import LoginAcademia from "@pages/academia/LoginAcademia";
import Academia from "@pages/academia";

// Middlewares
import { Public, PublicWithDynamicTitle } from "@middlewares";

const Router = () => {
  const routes = useRoutes([
    { path: "*", element: <Public page={<NotFound />} title="No Encontrado" /> },
    {
      path: "/:titleURL",
      element: <PublicWithDynamicTitle page={<TemplateAcademia />} title="Revista" />,
    },
    {
      path: "/login",
      element: <Public page={<LoginAcademia />} title="Login Revistas" />,
    },
    {
      path: "/",
      element: <Public page={<Academia />} title="Revistas" />
    }
  ]);

  return routes;
};

export default Router;
