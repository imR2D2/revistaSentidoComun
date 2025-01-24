import { useNavigate } from "react-router-dom";

// Material UI
import { Card, CardHeader, CardContent, Button } from "@mui/material";

// Componentes
import DefaultLayout from "@global/layout/DefaultLayout";

// Utilidades
import { setVars } from "@utils/global";

// En caso de tener una ruta mal, o cualquier error, se redirigira aqui para mostrarlo.
const NotFound = () => {
  const navigate = useNavigate();

  setVars("sideBar", "");

  return (
    <DefaultLayout centerItems>
      <Card className="cardStyle" sx={{ width: 320, textAlign: "center", pt: 2, pb: 1 }}>
        <CardHeader title="PÁGINA NO ENCONTRADA" />
        <CardContent>
          <Button onClick={() => navigate("/")} sx={{ color: "inherit" }}>
            Ir al Inicio
          </Button>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default NotFound;
