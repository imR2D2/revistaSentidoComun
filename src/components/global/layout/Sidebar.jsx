import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";

// Material UI
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Icon,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";

// Utilidades
import { getVars, setVars } from "@utils/global";

// Hooks
import useWindowDimensions from "@hooks/useWindowDimensions";

const Sidebar = ({ open, handleToggle }) => {
  const navigate = useNavigate();
  const menus = getVars("menus", []);
  const { width } = useWindowDimensions();

  const styleText = {
    margin: 0,
    maxWidth: "180px",
    marginLeft: open ? 2 : 0,
    textWrap: "nowrap",
    textOverflow: "ellipsis",
    width: open ? "auto" : 0,
    overflow: open ? "hidden" : "visible",
    opacity: open ? 1 : 0,
    transition: "all 0.5s",
  };

  const setBreadcrumbs = (name) => setVars("sideBar", name);

  const handleClickMenu = (item) => {
    navigate(item.route);
    setBreadcrumbs(item.menu);
    handleToggle(false);
  };

  useEffect(() => {
    const closeDrawerOnOutsideClick = (event) => {
      const sidebarButton = document.getElementById("sidebarButton");
      const sidebarDrawer = document.getElementById("sidebarDrawer");

      const buttonFlag = !sidebarButton.contains(event.target);
      const drawerFlag = sidebarDrawer.contains(event.target) || event.target === sidebarDrawer;

      if (open && buttonFlag && !drawerFlag) !handleToggle(false);
    };
    document.addEventListener("click", closeDrawerOnOutsideClick);

    return () => document.removeEventListener("click", closeDrawerOnOutsideClick);
    // eslint-disable-next-line
  }, [open]);

  return (
    <Drawer
      variant={width < 400 ? "persistent" : "permanent"}
      open={open}
      onMouseEnter={() => handleToggle(true)}
      onMouseLeave={() => handleToggle(false)}
      sx={{
        "& .MuiDrawer-paper": {
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: "6px" },
        },
      }}
    >
      <Box
        id="sidebarDrawer"
        onMouseEnter={() => handleToggle(true)}
        onMouseLeave={() => handleToggle(false)}
        sx={{ pt: "60px", height: "100%" }}
      >
        <List>
          {menus &&
            menus.map((item, index) => (
              <ListItem key={item.id || index} disablePadding sx={{ display: "block" }}>
                {item.visible === 1 &&
                  (item.submenus.length < 1 ? (
                    <Item item={item} styleText={styleText} handleClickMenu={handleClickMenu} />
                  ) : (
                    <ColapseItem
                      item={item}
                      styleText={styleText}
                      handleClickSubMenu={handleClickMenu}
                      handleToggle={handleToggle}
                    />
                  ))}
              </ListItem>
            ))}
        </List>
      </Box>
    </Drawer>
  );
};

const Item = (props) => {
  const { item, styleText, handleClickMenu } = props;

  return (
    <ListItemButton onClick={() => handleClickMenu(item)}>
      <ListItemIcon sx={{ minWidth: 0, width: 24, justifyContent: "center" }}>
        <Icon>{item.icon}</Icon>
      </ListItemIcon>
      <ListItemText
        disableTypography
        sx={styleText}
        primary={
          <Box sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>{item.menu}</Box>
        }
      />
    </ListItemButton>
  );
};

const ColapseItem = (props) => {
  const { item, styleText, handleClickSubMenu, handleToggle } = props;

  const [isOpenSubmenus, setIsOpenSubmenus] = useState(false);
  const handleSubmenus = () => setIsOpenSubmenus((prevOpen) => !prevOpen);

  const handleClickMenu = () => {
    handleSubmenus();
    handleToggle(true);
  };

  return (
    <Fragment key={item.id}>
      <ListItemButton onClick={handleClickMenu}>
        <ListItemIcon sx={{ minWidth: 0, width: 24, justifyContent: "center" }}>
          <Icon>{item.icon}</Icon>
        </ListItemIcon>
        <ListItemText
          disableTypography
          sx={styleText}
          primary={
            <Box sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
              <Box sx={{ flex: 1 }}>{item.menu}</Box>
              <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", marginLeft: 1 }}>
                {isOpenSubmenus ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
              </ListItemIcon>
            </Box>
          }
        />
      </ListItemButton>

      <Collapse in={isOpenSubmenus} timeout="auto" unmountOnExit>
        <List sx={{ pt: 0 }}>
          {item.submenus.map((subItem, index) => {
            return (
              subItem.visible === 1 && (
                <ListItemButton onClick={() => handleClickSubMenu(subItem)} key={subItem.id || index}>
                  <ListItemIcon sx={{ minWidth: 0, width: 24, justifyContent: "center" }}>
                    {subItem.icon ? <Icon sx={{ fontSize: 20 }}>{subItem.icon}</Icon> : subItem.acronym}
                  </ListItemIcon>

                  <ListItemText
                    disableTypography
                    sx={{ ...styleText, fontSize: "14px" }}
                    primary={<Box>{subItem.menu}</Box>}
                  />
                </ListItemButton>
              )
            );
          })}
        </List>
      </Collapse>
      {isOpenSubmenus && <Divider />}
    </Fragment>
  );
};

export default Sidebar;
