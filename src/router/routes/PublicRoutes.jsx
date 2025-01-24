import { Public, PublicWithDynamicTitle } from "@middlewares";

import TemplateAcademia from "@pages/academia/TemplateAcademia";
import LoginAcademia from "@pages/academia/LoginAcademia";
import Academia from "@pages/academia";

const Routes = [
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
];

export default Routes;
