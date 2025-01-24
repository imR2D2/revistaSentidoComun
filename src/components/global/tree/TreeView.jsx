import * as React from "react";
import PropTypes from "prop-types";

// Material UI
import { TreeView, TreeItem, treeItemClasses } from "@mui/x-tree-view";
import { Icon, CircularProgress, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Utils
import { isEmptyOrInvalidArray, isNullOrUndefined } from "@utils/validations";

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightRegular,
    "&.Mui-expanded": { fontWeight: theme.typography.fontWeightMedium },
    [`& .${treeItemClasses.label}`]: { fontWeight: "inherit", color: "inherit" },
  },
}));

const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
  const { statusColor, statusIcon, label, labelInfo, ...other } = props;
  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0, color: statusColor ?? "inherit" }}>
          {statusIcon && <Box component={statusIcon} color="inherit" sx={{ mr: 1 }} />}
          <Typography variant="body2" sx={{ fontWeight: "inherit", flexGrow: 1 }}>
            {label}
          </Typography>

          {labelInfo && (
            <Typography variant="caption" color="inherit">
              {labelInfo}
            </Typography>
          )}
        </Box>
      }
      {...other}
      ref={ref}
    />
  );
});

const Tree = (props) => {
  const {
    data = [],
    loading = false,
    handleClick = () => {},
    typeData = { value: "id", label: "label", S_label: "", T_label: "", customItem: null },
    isSameIds = false,
    sameId = "",
    itemComponent = null, // Manda esto a la funcion: { nodes, handleClick, typeData, isSameIds, sameId, renderTree, getStatusInfo }
  } = props;

  const getStatusInfo = (nodes, type) => {
    if (type.customItem) {
      const matchingItems = type.customItem.filter((item) => {
        const filter = item.filter ? item.filter.toUpperCase() : "=";
        const value = nodes[item.id];

        if (value) {
          switch (filter) {
            case "=":
              return value === item.value;
            case "<>":
              return value !== item.value;
            case ">":
              return value > item.value;
            case "<":
              return value < item.value;
            case ">=":
              return value >= item.value;
            case "<=":
              return value <= item.value;
            case "IN":
              if (Array.isArray(item.value)) return item.value.includes(value);
              return null;
            default:
              return value === item.value;
          }
        } else return null;
      });

      switch (matchingItems.length) {
        case 0:
          return null;
        // El elemento coincide con un criterio
        case 1:
          return {
            icon: matchingItems[0]?.icon || null,
            color: matchingItems[0]?.color || null,
          };
        // El elemento coincide con varios criterios
        default: {
          // Busca si un elemento tiene ambos (le da prioridad)
          const two = matchingItems.find((item) => item.icon && item.color);
          if (two)
            return {
              icon: two.icon !== "none" ? two.icon : null,
              color: two.color !== "none" ? two.color : null,
            };

          // En caso de no tener ambos, entonces cada uno tiene uno
          const icon = matchingItems.find((item) => item.icon);
          const color = matchingItems.find((item) => item.color);
          return { icon: icon?.icon || null, color: color?.color || null };
        }
      }
    }
    return null;
  };

  const renderTree = (nodes) => {
    if (itemComponent)
      return itemComponent({ nodes, handleClick, typeData, isSameIds, sameId, renderTree, getStatusInfo });

    const statusInfo = getStatusInfo(nodes, typeData);
    return (
      <StyledTreeItem
        key={nodes.id}
        nodeId={`${nodes[typeData.value]} ${
          isSameIds ? (!isNullOrUndefined(nodes[sameId]) ? "-" + nodes[sameId] : "") : ""
        } `}
        label={`${nodes[typeData.T_label] ? `${nodes[typeData.T_label]} -` : ""} ${nodes[typeData.label]} ${
          nodes[typeData.S_label] ?? ""
        }`}
        statusIcon={statusInfo ? statusInfo.icon : null}
        statusColor={statusInfo ? statusInfo.color : null}
        onClick={() => handleClick(nodes)}
      >
        {!isEmptyOrInvalidArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
      </StyledTreeItem>
    );
  };

  const TreeComponent = (
    <TreeView
      defaultCollapseIcon={<Icon>expand_more</Icon>}
      defaultExpandIcon={<Icon color="primary">chevron_right</Icon>}
      defaultEndIcon={<Icon sx={{ color: "lightgray" }}>chevron_right</Icon>}
    >
      {data.map((item) => renderTree(item))}
    </TreeView>
  );

  const loadingComponent = (
    <Box sx={{ display: "flex", justifyContent: "center", paddingY: 5 }}>
      <CircularProgress />
    </Box>
  );

  const noDataComponent = (
    <Box sx={{ display: "flex", justifyContent: "center", paddingY: 5 }}>Sin datos</Box>
  );

  return loading ? loadingComponent : data.length !== 0 ? TreeComponent : noDataComponent;
};

Tree.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  handleClick: PropTypes.func,
  typeData: PropTypes.object,
  isSameIds: PropTypes.bool,
  sameId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  itemComponent: PropTypes.func, // Manda esto a la funcion: { nodes, handleClick, typeData, isSameIds, sameId, renderTree, getStatusInfo }
};

export default Tree;

/* Ejemplos de customItem - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/* 
customItem: [
              { id: "idEstatus", value: 4, icon: Block, color: "#F67B7B" },           // icono y color
              { id: "idEstatus", value: 1, icon: Block, },                            // Solo icono
              { id: "idEstatus", value: 2, color: "#4BB543" },                        // Solo color
              { id: "idEstatus", filter: "IN", value: [1, 2], color: "#4BB543" },     // Con un operador distinto

                  Acepta estos operadores: "=", "<>", ">", "<", ">=", "<=", "IN" (este ultimo solo acepta arrays)
                  por defecto se usa "="
            ],

Se le da prioridad a los que tengan ambos elementos. por lo que
en caso de que otra condicion de un elemento se cumpla, no se va a sobreescribir.

// Evitar Sobreescritura
En caso de que quieras solo cambiar un elemento, pero no quieres que se sobreescriba, puedes usar "none" en el otro.
{ id: "idEstatus", value: 4, icon: "none", color: "#F67B7B" },

Es importante el orden que se le de (en caso de que dos elementos coincidan y cambien la misma cosa)
*/

/* Ejemplo de itemComponent - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*
  import { TreeItem } from "@mui/x-tree-view";
  import { isEmptyOrInvalidArray, isNullOrUndefined } from "@utils/validations";

  const component = (props) => {
    const { nodes, handleClick, typeData, isSameIds, sameId, renderTree } = props;
    return (
      <TreeItem
        key={nodes.id}
        nodeId={`${nodes[typeData.value]} ${isSameIds ? (!isNullOrUndefined(nodes[sameId]) ? "-" + nodes[sameId] : "") : ""} `}
        label={`${nodes[typeData.T_label] ? `${nodes[typeData.T_label]} -` : ""} ${nodes[typeData.label]} ${
          nodes[typeData.S_label] ? nodes[typeData.S_label] : ""
        }`}
        onClick={() => handleClick(nodes)}
      >
        {!isEmptyOrInvalidArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
      </TreeItem>
    );
  };

*/
