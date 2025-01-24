import { Link } from "react-router-dom";
import AnimatedTransition from "@router/AnimatedTransition";

// Utilidades
import { setVars } from "@utils/global";

// En caso de no tener acceso a ese menu, se redirigira aqui para mostrarlo.
const NotAuthorized = () => {
  document.title = "No Autorizado";
  return (
    <AnimatedTransition>
      <NotAuthorizedItem />
    </AnimatedTransition>
  );
};

const NotAuthorizedItem = () => {
  return (
    <section>
      <h1>401</h1>
      <h2>No Autorizado</h2>
      <Link to="/home" onClick={setVars("sideBar", "")}>
        <button>Volver al Inicio</button>
      </Link>
    </section>
  );
};

export default NotAuthorized;
