import { Navigate, useLocation } from "react-router-dom";
import AnimatedTransition from "@router/AnimatedTransition";

// Paginas
import NotAuthorized from "@pages/auth/NotAuthorized";

// Middlewares y utils
import { getValidToken, checkMenuAccess } from "@middlewares/middleware";
import { getVars } from "@utils/global";

const margins = { marginTop: "52px", marginLeft: { xs: 0, sm: "57px" } };

export const AlreadyLoggedIn = () => {
  if (getValidToken()) return <Navigate to={getVars("user", {}).defaultPage} />;
  return <Navigate to={"/login"} />;
};

export const Public = ({ page, title = "" }) => {
  document.title = title;
  return (
    <>
      <AnimatedTransition>{page ?? <></>}</AnimatedTransition>
    </>
  );
};

export const PublicWithDynamicTitle = ({ page, title}) => {
  const location = useLocation();

  const dynamicTitle = location.state?.title ? `${title} - ${location.state.title}` : title;

  document.title = dynamicTitle;

  return (
    <>
      <AnimatedTransition>{page ?? <></>}</AnimatedTransition>
    </>
  );
};

export const ProtectedRoute = ({ page, title = "" }) => {
  if (!getValidToken()) return <Navigate to={"/login"} />;

  document.title = title;
  return (
    <>
      <AnimatedTransition sx={margins}>{page ?? <></>}</AnimatedTransition>
    </>
  );
};

export const PrivilegedRoute = ({ page, title = "" }) => {
  if (!getValidToken()) return <Navigate to={"/login"} />;
  if (!checkMenuAccess()) return <NotAuthorized />;

  document.title = title;
  return (
    <>
      <AnimatedTransition sx={margins}>{page ?? <NotAuthorized />}</AnimatedTransition>
    </>
  );
};
