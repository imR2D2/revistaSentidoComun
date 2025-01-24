import PropTypes from "prop-types";

// Material UI
import { Box, IconButton } from "@mui/material";
import { Email, Facebook, X, Instagram, YouTube, Telegram, LinkedIn, GitHub } from "@mui/icons-material";

// Utils
import { isNullOrUndefined } from "@utils/validations";

const SocialsButtons = ({
  disableEmail = false,
  disableFacebook = false,
  disableX = false,
  disableInstagram = false,
  disableYouTube = false,
  disableTelegram = false,
  disableLinkedIn = false,
  disableGitHub = false,
  links = {},
  color = "",
}) => {
  const socialLinks = [
    {
      disabled: disableEmail,
      href: links?.email
        ? `mailto:${links?.email}?subject=Contacto%20Codigo%2027`
        : "mailto:contacto@codigo27.mx?subject=Contacto%20Sitio%20Web",
      icon: <Email />,
      target: "_self",
      hoverColor: "rgba(0, 0, 0, 0.70)",
    },
    {
      disabled: disableFacebook,
      href: links?.facebook ?? "https://www.facebook.com/Codigo27Mx",
      icon: <Facebook />,
      hoverColor: "#3b5998",
    },
    {
      disabled: disableX,
      href: links?.x ?? "https://x.com/Codigo27_Mx",
      icon: <X />,
      hoverColor: "#1DA1F2",
    },
    {
      disabled: disableInstagram,
      href: links?.instagram ?? "https://www.instagram.com/codigo27mx/",
      icon: <Instagram />,
      hoverColor: "#C13584",
    },
    {
      disabled: disableYouTube,
      href: links?.youtube ?? "https://www.youtube.com/",
      icon: <YouTube />,
      hoverColor: "#FF0000",
    },
    {
      disabled: disableTelegram,
      href: links?.telegram ?? "https://web.telegram.org/",
      icon: <Telegram />,
      hoverColor: "#0088CC",
    },
    {
      disabled: disableLinkedIn,
      href: links?.linkedin ?? "https://www.linkedin.com/",
      icon: <LinkedIn />,
      hoverColor: "#0A66C2",
    },
    {
      disabled: disableGitHub,
      href: links?.github ?? "https://github.com/",
      icon: <GitHub />,
      hoverColor: "#000000",
    },
  ];

  return (
    <Box
      component="section"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, flexWrap: "wrap" }}
    >
      {socialLinks.map(
        (link, index) =>
          !link.disabled && (
            <IconButton
              key={index}
              href={link.href}
              target={!isNullOrUndefined(link.target) ? link.target : "_blank"}
              size="small"
              sx={{
                "&:hover": {
                  transform: "scale(1.2)",
                  color: link.hoverColor,
                  transition: "transform 200ms ease-in-out",
                },
                transition: "transform 200ms ease-in-out",
                transform: "scale(1)",
                "&:hover:not(:hover)": { transform: "scale(1)" },
                color: color,
              }}
            >
              {link.icon}
            </IconButton>
          )
      )}
    </Box>
  );
};

SocialsButtons.propTypes = {
  disableEmail: PropTypes.bool,
  disableFacebook: PropTypes.bool,
  disableX: PropTypes.bool,
  disableInstagram: PropTypes.bool,
  disableYouTube: PropTypes.bool,
  disableTelegram: PropTypes.bool,
  disableLinkedIn: PropTypes.bool,
  disableGitHub: PropTypes.bool,
  links: PropTypes.shape({
    email: PropTypes.string,
    facebook: PropTypes.string,
    x: PropTypes.string,
    instagram: PropTypes.string,
    youtube: PropTypes.string,
    telegram: PropTypes.string,
    linkedin: PropTypes.string,
    github: PropTypes.string,
  }),
  color: PropTypes.string,
};

export default SocialsButtons;
