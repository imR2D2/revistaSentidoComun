import { Fragment } from "react";

// Material UI
import { ListItem, ListItemButton, ListItemAvatar, Avatar, Icon, ListItemText, Divider } from "@mui/material";

const DefaultListItem = ({ item, index, selected, handleSelected }) => {
  return (
    <Fragment>
      <ListItem disablePadding>
        <ListItemButton selected={selected === index} onClick={() => handleSelected(item, index)}>
          <ListItemAvatar sx={{ display: { xs: "none", sm: "block" } }}>
            <Avatar>
              <Icon sx={{ fontSize: 40 }}>account_circle</Icon>
            </Avatar>
          </ListItemAvatar>

          <ListItemText primary={`${item.Nombre} ${item.Paterno}`} secondary={item.email} />
        </ListItemButton>
      </ListItem>

      <Divider variant="inset" component="li" />
    </Fragment>
  );
};

export default DefaultListItem;
