import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// Material UI
import { Stack, Typography, Box, Button, Icon, Link } from "@mui/material";

const Header = (props) => {
  const { title = "", isCustom = false, button = null, link = null } = props;
  const navigate = useNavigate();

  const linkExtern = link?.extern ? { href: link?.url, target: "_blank" } : {};

  return (
    <Stack direction="row" marginBottom={4} justifyContent="end" alignItems="center" flexWrap="wrap" gap={1}>
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>

      {/* Separación */}
      <Box sx={{ flexGrow: 1 }} />

      {isCustom && <>{props.children}</>}

      {button && (
        <Button
          variant="contained"
          sx={{ width: { xs: "100%", sm: "auto" } }}
          size="small"
          startIcon={button?.icon ? <Icon>{button.icon}</Icon> : ""}
          onClick={button?.click ? button.click : () => {}}
        >
          {button?.title}
        </Button>
      )}

      {link && (
        <Button
          variant="outlined"
          sx={{ width: { xs: "100%", sm: "auto" } }}
          size="small"
          fontWeight={700}
          component={link.extern ? Link : Button}
          onClick={() => (link.extern ? {} : navigate(link?.url))}
          {...linkExtern}
        >
          {link?.title}
        </Button>
      )}
    </Stack>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  isCustom: PropTypes.bool,
  button: PropTypes.shape({
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    click: PropTypes.func.isRequired,
  }),
  link: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    extern: PropTypes.bool,
  }),
};

export default Header;
