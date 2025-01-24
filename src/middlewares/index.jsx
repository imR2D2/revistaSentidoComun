import { useContext } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { GlobalContext } from "@context/GlobalContext";
import AnimatedTransition from "@router/AnimatedTransition";

// Paginas
import NotAuthorized from "@pages/auth/NotAuthorized";

// Componentes
import Navbar from "@global/layout/Navbar";
import Footer from "@global/layout/Footer";
import Sidebar from "@global/layout/Sidebar";

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
      <Navbar title="Inicio" />
      <AnimatedTransition>{page ?? <></>}</AnimatedTransition>
      <Footer />
    </>
  );
};

export const PublicWithDynamicTitle = ({ page, title}) => {
  const { id } = useParams();
  const location = useLocation();

  const dynamicTitle = location.state?.title ? `${title} - ${location.state.title}` : title;

  document.title = dynamicTitle;

  return (
    <>
      <Navbar title="Inicio" />
      <AnimatedTransition>{page ?? <></>}</AnimatedTransition>
      <Footer />
    </>
  );
};

export const ProtectedRoute = ({ page, title = "" }) => {
  const { isSidebarOpen, handleToggle } = useContext(GlobalContext);

  if (!getValidToken()) return <Navigate to={"/login"} />;

  document.title = title;
  return (
    <>
      <Navbar handleToggle={handleToggle} title="Inicio" />
      <Sidebar handleToggle={handleToggle} open={isSidebarOpen} />
      <AnimatedTransition sx={margins}>{page ?? <></>}</AnimatedTransition>
      <Footer />
    </>
  );
};

export const PrivilegedRoute = ({ page, title = "" }) => {
  const { isSidebarOpen, handleToggle } = useContext(GlobalContext);

  if (!getValidToken()) return <Navigate to={"/login"} />;
  if (!checkMenuAccess()) return <NotAuthorized />;

  document.title = title;
  return (
    <>
      <Navbar handleToggle={handleToggle} title="Inicio" />
      <Sidebar handleToggle={handleToggle} open={isSidebarOpen} />
      <AnimatedTransition sx={margins}>{page ?? <NotAuthorized />}</AnimatedTransition>
      <Footer />
    </>
  );
};
