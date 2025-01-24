import { useEffect } from 'react';
import { Box } from "@mui/material";

const FacebookPagePlugin = () => {
  useEffect(() => {
    // Cargar el SDK de Facebook
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      ((d, s, id) => {
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        const js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v13.0";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    }

    // Ocultar el mensaje de "Búscanos en Facebook"
    const hideFacebookMessage = () => {
      const fbPlugin = document.querySelector('.fb-page');
      if (fbPlugin) {
        const message = fbPlugin.querySelector('span');
        if (message && message.textContent.includes('Búscanos en Facebook')) {
          message.style.display = 'none';
        }
      }
    };

    hideFacebookMessage(); // Esconder mensaje inmediatamente después de cargar

    // Verificar periódicamente para asegurar que el mensaje no aparezca
    const intervalId = setInterval(hideFacebookMessage, 1000);

    return () => clearInterval(intervalId); // Limpiar intervalo cuando el componente se desmonta
  }, []);

  return (
    <Box className="fb-page"
      data-href="https://www.facebook.com/Codigo27Mx"
      data-tabs="timeline"
      data-width="2000px"
      data-height=""
      data-small-header="false"
      data-adapt-container-width="true"
      data-hide-cover="false"
      data-show-facepile="true"
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e0e0e0",
        backgroundColor: "#f9f9f9",
        width: "500px"
      }}>
      <blockquote cite="https://www.facebook.com/Codigo27Mx" className="fb-xfbml-parse-ignore">
        <a href="https://www.facebook.com/Codigo27Mx">Código 27</a>
      </blockquote>
    </Box>
  );
}

export default FacebookPagePlugin;
