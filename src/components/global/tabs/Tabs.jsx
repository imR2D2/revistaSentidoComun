import PropTypes from "prop-types";

// Material UI
import { Tab, Icon } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

// Utils
import { convertToNumber } from "@utils/format";

const Tabs = (props) => {
  const {
    value,
    setValue = () => {},
    tabs = [],
    color = "primary",
    disableCentered = false,
    disableScroll = false,
    disableFullWidth = false,
    orientation = "horizontal",
    maxHeight = 228,
    useNumbers = false,
  } = props;

  const tabsStyle = {
    flex: disableFullWidth ? 0 : 1,
    minHeight: 0,
    minWidth: "fit-content",
    maxWidth: "unset",
    whiteSpace: "nowrap",
  };

  return (
    <TabContext value={"" + value}>
      <TabList
        onChange={(e, value) => setValue(useNumbers ? convertToNumber(value) : value)}
        aria-label="Tabs de control"
        variant={disableScroll ? "standard" : "scrollable"}
        centered={disableScroll ? !disableCentered : false}
        scrollButtons
        orientation={orientation}
        textColor={color}
        indicatorColor={color}
        sx={{ borderBottom: 1, borderColor: "divider", maxHeight: maxHeight }}
      >
        {tabs.map((item, index) => {
          const {
            icon,
            iconPosition = "start",
            label = "",
            value = "",
            disabled = false,
            sxTab = {},
            display = true,
          } = item;

          const iconProp = icon
            ? {
                icon: typeof icon === "string" ? <Icon>{icon}</Icon> : icon,
                iconPosition: iconPosition,
              }
            : {};

          if (!display) return null;

          return (
            <Tab
              key={index}
              label={label}
              value={"" + value}
              sx={{ ...tabsStyle, ...sxTab }}
              disabled={disabled}
              {...iconProp}
            />
          );
        })}
      </TabList>

      {tabs.map((item, index) => {
        const { value = "", sxContent = {}, display = true, component } = item;

        if (!display) return null;

        return (
          <TabPanel key={index} value={"" + value} sx={{ paddingX: 0, paddingBottom: 0, ...sxContent }}>
            {component}
          </TabPanel>
        );
      })}
    </TabContext>
  );
};

Tabs.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setValue: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      display: PropTypes.bool,
      component: PropTypes.node.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
      iconPosition: PropTypes.oneOf(["top", "bottom", "start", "end"]),
      disabled: PropTypes.bool,
      sxTab: PropTypes.object, // sx en los botones
      sxContent: PropTypes.object, // sx en el contenido
    })
  ).isRequired,
  color: PropTypes.oneOf(["primary", "secondary"]),
  disableCentered: PropTypes.bool,
  disableScroll: PropTypes.bool,
  disableFullWidth: PropTypes.bool,
  orientation: PropTypes.oneOf(["vertical", "horizontal"]),
  maxHeight: PropTypes.number,
  useNumbers: PropTypes.bool,
};

export default Tabs;

// Ejemplo de uso del componente
/* <Tabs
      value={tabValue}
      setValue={setTabValue}
      tabs={[
        {
          icon: <Icon>settings</Icon>,      // Con icono (componente)
          label: "Tab 1",
          value: "0",
          component: <>Component 1</>,
        },
        {
          icon: "people",                   // Con icono 
          iconPosition: "bottom",
          label: "Tab 2",
          value: "1",
          component: <>Component 2</>,
        },
        {
          label: "Tab 3",                   // Sin icono
          value: "2",
          component: <>Component 3</>,
        },
        {
          label: "Tab Hidden",
          value: "3",
          component: <>Hidden component</>,
          display: false                    // No mostrar en pantalla
        },
      ]}
      // color:"secondary"
      // disableCentered,
      // disableScroll,
      // disableFullWidth,
      // orientation: "vertical",
    /> 
*/
