import { useState, useEffect, isValidElement } from "react";
import PropTypes from "prop-types";

// Material UI
import {
  TableContainer,
  Table,
  TablePagination,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableSortLabel,
  Box,
  CircularProgress,
  Card,
  Icon,
  Typography,
  Button,
  IconButton,
  Chip,
  Checkbox,
  Tooltip,
} from "@mui/material";

// Componentes
import ProgressPercent from "@global/progress/ProgressPercent";

// Utils
import { convertToNumber, convertToBoolean, numberWithCommas } from "@utils/format";
import { darkenHexColor, getColor } from "@utils/utilities";
import { isNullOrUndefined } from "@utils/validations";

const descendingComparator = (a, b) => {
  if (convertToNumber(b) < convertToNumber(a)) return -1;
  if (convertToNumber(b) > convertToNumber(a)) return 1;
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a[orderBy]?.value ?? a[orderBy], b[orderBy]?.value ?? b[orderBy])
    : (a, b) => -descendingComparator(a[orderBy]?.value ?? a[orderBy], b[orderBy]?.value ?? b[orderBy]);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const BasicTableHead = (props) => {
  const { order, orderBy, onRequestSort, columns, subColumns } = props;

  const createSortHandler = (property) => onRequestSort(property);

  const LabelComponent = ({
    label,
    tooltip,
    maxWidth,
    noWrapHead,
    disablePadding,
    disablePaddingHead,
    calc,
  }) => (
    <Tooltip title={tooltip ? label ?? "" : ""} placement="top" disableInteractive arrow>
      {isValidElement(label) ? (
        label
      ) : (
        <Typography
          fontSize={14}
          fontWeight={500}
          sx={{
            whiteSpace: maxWidth || noWrapHead ? "nowrap" : "wrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: maxWidth ? (disablePadding || disablePaddingHead ? maxWidth : calc) : "100%",
          }}
        >
          {label}
        </Typography>
      )}
    </Tooltip>
  );

  return (
    <TableHead sx={{ backgroundColor: "rgba(189, 189, 189)" }}>
      {subColumns && (
        <TableRow>
          {subColumns.map((subColumn, index) => {
            const { id, label, colspan, align, maxWidth, sx, disablePadding } = subColumn;
            return (
              <TableCell
                key={`${id} ${index}`}
                colSpan={colspan}
                align={align ?? "left"}
                padding={disablePadding ? "none" : "normal"}
                sx={{
                  ...sx,
                  borderRight: index + 1 < subColumns.length ? "1px solid white" : "none",
                  borderColor: "white",
                  maxWidth: maxWidth ?? "100%",
                }}
              >
                {label}
              </TableCell>
            );
          })}
        </TableRow>
      )}

      <TableRow>
        {columns.map((column) => {
          const {
            id,
            label,
            align,
            maxWidth,
            sort,
            disablePadding,
            disablePaddingHead,
            noWrapHead,
            tooltip,
          } = column;
          return (
            <TableCell
              key={id}
              align={align ?? "left"}
              padding={disablePadding || disablePaddingHead ? "none" : "normal"}
              sortDirection={orderBy === id ? order : false}
              sx={{ backgroundColor: "rgba(189, 189, 189)", maxWidth: maxWidth ?? "100%" }}
            >
              {sort === undefined || sort ? (
                <TableSortLabel
                  active={orderBy === id}
                  direction={orderBy === id ? order : "asc"}
                  onClick={() => createSortHandler(id)}
                >
                  <LabelComponent
                    label={label}
                    tooltip={tooltip}
                    maxWidth={maxWidth}
                    noWrapHead={noWrapHead}
                    disablePadding={disablePadding}
                    disablePaddingHead={disablePaddingHead}
                    calc={`calc(${maxWidth}px - 16px - 18px)`}
                  />
                </TableSortLabel>
              ) : (
                <LabelComponent
                  label={label}
                  tooltip={tooltip}
                  maxWidth={maxWidth}
                  noWrapHead={noWrapHead}
                  disablePadding={disablePadding}
                  disablePaddingHead={disablePaddingHead}
                  calc={`calc(${maxWidth}px - 16px)`}
                />
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

const BasicTable = (props) => {
  const {
    rows,
    columns,
    subColumns = null,
    summary = [],
    summarySettings = null,
    total = null,
    page = 0,
    pageSize = 5,
    showPagination = true,
    handlePagination = null,
    pagination = [5, 10, 25, 50, 100],
    handleSort = null,
    orderBy = "",
    stickyHeader = false,
    minWidth = 100,
    minHeight = 50,
    maxHeight,
    backgroundColor = null,
    disableCardType = false,
    disableHover = false,
    disableStriped = false,
    isLoading = false,
  } = props;

  const manualSort = handleSort ? true : false;
  const manualPagination = handlePagination ? true : false;

  const [localColumns, setLocalColumns] = useState(columns);
  const [localSubColumns, setLocalSubColumns] = useState(subColumns);

  const [order, setOrder] = useState("asc");
  const [localOrderBy, setLocalOrderBy] = useState("");
  const [localPage, setLocalPage] = useState(page);
  const [localPageSize, setLocalPageSize] = useState(pageSize);

  useEffect(() => {
    setLocalColumns(columns);
    setLocalSubColumns(subColumns);
  }, [columns, subColumns]);

  useEffect(() => {
    setLocalPage(page);
  }, [page]);

  useEffect(() => {
    setLocalPage(0);
    setLocalPageSize(pageSize);
  }, [pageSize]);

  useEffect(() => {
    setLocalOrderBy(orderBy);
  }, [orderBy]);

  const handleRequestSort = (property) => {
    const isAsc = localOrderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setLocalOrderBy(property);
    if (handleSort) handleSort({ orderBy: property, order: isAsc ? "desc" : "asc" });
  };

  const handleChangePage = (e, newPage) => {
    setLocalPage(newPage);
    if (manualPagination) handlePagination({ page: newPage, pageSize: localPageSize });
  };

  const handleChangePageSize = (e) => {
    const pageSize = parseInt(e.target.value, 10);
    setLocalPage(0);
    setLocalPageSize(pageSize);
    if (manualPagination) handlePagination({ page: 0, pageSize });
  };

  const getStripedStyle = (row, index) =>
    row.style ?? disableStriped
      ? backgroundColor
        ? { background: backgroundColor }
        : {}
      : {
          background: backgroundColor
            ? index % 2
              ? darkenHexColor(backgroundColor, 5)
              : backgroundColor
            : index % 2
            ? "#E4ECFA"
            : "white",
        };

  const getValue = (value) =>
    typeof value === "object" ? (isValidElement(value) ? value : value?.value) : value;

  const getComponent = (props) => {
    const {
      value,
      type = "circular",
      iconFlag = false,
      disableFontColor = false,
      fixed = 0,
      fontSize,
    } = props;

    // type="linear", "circular" o "chip"
    return (
      <ProgressPercent
        type={type === "chipPercent" ? "chip" : type}
        value={value}
        size={42}
        fixed={fixed}
        iconFlag={iconFlag}
        fontSize={fontSize >= 0 ? fontSize : type === "circular" ? 10 : 12}
        sizeChip="small"
        disableFontColor={disableFontColor}
      />
    );
  };

  const getButton = (props) => {
    const { value, type, variant = "outlined", color, click = () => {} } = props;

    let buttonColor = {};
    if (color) {
      switch (variant) {
        case "outlined":
          buttonColor = {
            color: color,
            border: `1px solid ${color}`,
            "&:hover": { border: `1px solid ${darkenHexColor(color, 10)}` },
          };
          break;
        case "contained":
          buttonColor = { backgroundColor: color, "&:hover": { backgroundColor: darkenHexColor(color, 10) } };
          break;
        default:
          buttonColor = { color: color };
          break;
      }
    }

    // type="button", "iconButton"
    return type === "button" ? (
      <Button
        fullWidth
        size="small"
        variant={variant ?? "outlined"}
        sx={{ minHeight: "100%", height: "100%", maxHeight: "100%", whiteSpace: "nowrap", ...buttonColor }}
        onClick={click}
      >
        {value}
      </Button>
    ) : (
      <IconButton onClick={click} sx={{ color: color }}>
        <Icon>{value}</Icon>
      </IconButton>
    );
  };

  const getChip = (props) => {
    const { value, iconFlag = false, disableFontColor = false, fontSize } = props;

    const { color, font, icon } = getColor(value);

    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Chip
          label={value}
          icon={
            iconFlag ? (
              <Icon
                sx={{
                  color: `${disableFontColor ? "#000" : font} !important`,
                  fontSize: `${fontSize + 4}px !important`,
                }}
              >
                {icon}
              </Icon>
            ) : (
              <></>
            )
          }
          sx={{
            backgroundColor: color,
            color: font,
            fontWeight: 500,
            fontSize: fontSize,
            lineHeight: 1,
            py: 0.5,
            height: "fit-content",
          }}
          size="small"
        />
      </Box>
    );
  };

  const getCheck = (props) => {
    const { value, click, color, fontSize } = props;

    const check = convertToBoolean(value);

    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Checkbox
          checked={check}
          onChange={click ?? (() => {})}
          sx={{
            color: color,
            "&.Mui-checked": {
              color: darkenHexColor(color, -10),
            },
            "& .MuiSvgIcon-root": { fontSize: fontSize },
          }}
        />
      </Box>
    );
  };

  const emptyRows =
    localPage > 0 ? localPageSize - rows.length !== 0 && rows.length === 0 : rows.length === 0;

  // Define la paginación y el ordenamiento
  let visibleRows = [];

  const slice1 = localPage * localPageSize;
  const slice2 = localPage * localPageSize + localPageSize;

  switch (manualSort) {
    case true:
      if (manualPagination) visibleRows = rows; // Ambos son remotos
      else visibleRows = rows.slice(slice1, slice2); // Ordenamiento remoto
      break;
    default: // Paginación remota
      if (manualPagination) visibleRows = stableSort(rows, getComparator(order, localOrderBy));
      else visibleRows = stableSort(rows, getComparator(order, localOrderBy)).slice(slice1, slice2); // Ambos son locales
      break;
  }

  return (
    <Box
      variant="outlined"
      component={!disableCardType ? Card : Box}
      className={!disableCardType ? "cardStyle2" : ""}
      sx={{ width: "100%", overflow: "auto", p: !disableCardType ? 2 : 0 }}
    >
      <Box component={!disableCardType ? Card : Box} boxShadow={0}>
        {
          <TableContainer sx={{ maxHeight: stickyHeader ? maxHeight : "" }}>
            <Table
              aria-label="tabla basica"
              stickyHeader={stickyHeader}
              size={"small"}
              sx={!stickyHeader ? { minWidth: minWidth, minHeight: minHeight } : {}}
            >
              <BasicTableHead
                order={order}
                orderBy={localOrderBy}
                columns={localColumns}
                subColumns={localSubColumns}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  visibleRows.map((row, rowIndex) => (
                    <TableRow
                      hover={!disableHover}
                      tabIndex={-1}
                      key={row.id + "_" + rowIndex}
                      sx={{
                        padding: "5px 20px",
                        height: 25,
                        ...getStripedStyle(row, rowIndex),
                        "&:hover":
                          backgroundColor && !disableHover
                            ? { backgroundColor: darkenHexColor(backgroundColor, 10) + "!important" }
                            : {},
                      }}
                    >
                      {columns.map((column, index) => {
                        const { id, type, fixed, fontSize, align, iconChip, disableFontColor } = column;
                        const { color, variant, onClick, disablePadding, disablePaddingBody } = column;

                        const value = getValue(row[id]);
                        const valueNumber = convertToNumber(value);

                        const properties = {
                          disableFontColor: disableFontColor,
                          fixed: fixed,
                          iconFlag: iconChip,
                          fontSize: fontSize,
                        };

                        const button = ["button", "iconButton", "check"].includes(type);

                        const click = onClick ? () => onClick(row[id], id, row) : () => {};

                        return !isNullOrUndefined(row[id]) ? (
                          <TableCell
                            key={index}
                            onClick={!button ? click : () => {}}
                            align={align ?? "left"}
                            sx={{
                              cursor: onClick && !button ? "pointer" : "auto",
                              padding: disablePadding || disablePaddingBody ? 0 : "auto",
                              fontSize: fontSize ?? "auto",
                              color: color,
                              height: "100%",
                            }}
                          >
                            {type === undefined || type === "text"
                              ? value
                              : type === "number"
                              ? numberWithCommas(
                                  typeof valueNumber === "number"
                                    ? valueNumber?.toFixed(fixed ?? 1)
                                    : valueNumber
                                )
                              : type === "percent"
                              ? typeof valueNumber === "number"
                                ? (valueNumber % 1 !== 0 ? valueNumber?.toFixed(fixed ?? 1) : valueNumber) +
                                  "%"
                                : valueNumber + "%"
                              : ["chipPercent", "circular", "linear"].includes(type)
                              ? getComponent({ type, value: valueNumber, ...properties })
                              : ["chip"].includes(type)
                              ? getChip({ value, ...properties })
                              : ["check"].includes(type)
                              ? getCheck({ click: click, color, value: valueNumber, ...properties })
                              : ["button", "iconButton"].includes(type)
                              ? getButton({ type, value, color, click: click, variant: variant })
                              : value}
                          </TableCell>
                        ) : (
                          <TableCell key={index}> </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}

                {emptyRows && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      <Icon fontSize={"large"}>info</Icon>
                      <Typography>Sin Registros</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              {!isLoading && rows.length > 1 && summary.length > 0 && (
                <TableBody sx={{ backgroundColor: "#0d47a1" }}>
                  <TableRow
                    sx={
                      stickyHeader
                        ? { backgroundColor: "#0d47a1", position: "sticky", bottom: 0, zIndex: 1 }
                        : {}
                    }
                  >
                    {summary.map((item, index) => {
                      const { align, disablePadding, disablePaddingBody } = item;
                      return (
                        <TableCell
                          key={index}
                          align={align ?? summarySettings?.align ?? "left"}
                          padding={disablePadding ? "none" : disablePaddingBody ? "none" : "normal"}
                        >
                          <Typography sx={{ color: "#fff", fontSize: summarySettings?.fontSize ?? "auto" }}>
                            {index === (summarySettings?.start ?? 0) && (summarySettings?.start ?? 0) >= 0
                              ? summarySettings?.title ?? "TOTAL: "
                              : numberWithCommas(convertToNumber(getValue(item)))}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        }
      </Box>
      {showPagination && (
        <TablePagination
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
          rowsPerPageOptions={pagination}
          component="div"
          count={isNullOrUndefined(total) ? rows.length : total}
          rowsPerPage={localPageSize}
          page={localPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangePageSize}
        />
      )}
    </Box>
  );
};

BasicTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  columns: PropTypes.array,
  subColumns: PropTypes.array,
};

BasicTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf([
        "number",
        "text",
        "percent",
        "check",
        "chip",
        "chipPercent",
        "circular",
        "linear",
        "button",
        "iconButton",
      ]),
      iconChip: PropTypes.bool, // Gestiona el icono en los type chip
      icon: PropTypes.string, // Gestiona el icono en los type button
      disableFontColor: PropTypes.bool, // Quita el color del texto en los type circular o linear
      sort: PropTypes.bool, // Gestiona el sort del head
      disablePadding: PropTypes.bool, // Quita el padding en head y body
      disablePaddingHead: PropTypes.bool, // Quita el padding en head
      disablePaddingBody: PropTypes.bool, // Quita el padding en body
      fixed: PropTypes.number, // Limita los decimales
      fontSize: PropTypes.number, // Tamaño de la letra
      color: PropTypes.string, // Color de la letra
      variant: PropTypes.oneOf(["text", "outlined", "contained"]), // variante del boton (BOTON normal)
      maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      noWrapHead: PropTypes.bool,
      tooltip: PropTypes.bool,
      align: PropTypes.oneOf(["left", "right", "center", "inherit", "justify"]),
      onClick: PropTypes.func,
    })
  ).isRequired,
  subColumns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      colspan: PropTypes.number,
      sx: PropTypes.object,
      disablePadding: PropTypes.bool, // Quita el padding
      maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      align: PropTypes.oneOf(["left", "right", "center", "inherit", "justify"]),
    })
  ),
  summary: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        disablePadding: PropTypes.bool,
        align: PropTypes.oneOf(["left", "right", "center", "inherit", "justify"]),
      }),
    ])
  ),
  summarySettings: PropTypes.shape({
    start: PropTypes.number,
    title: PropTypes.string,
    fontSize: PropTypes.number,
    align: PropTypes.oneOf(["left", "right", "center", "inherit", "justify"]),
  }),
  total: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  showPagination: PropTypes.bool,
  handlePagination: PropTypes.func,
  pagination: PropTypes.arrayOf(PropTypes.number),
  orderBy: PropTypes.string,
  handleSort: PropTypes.func,
  isLoading: PropTypes.bool,
  backgroundColor: PropTypes.string,
  disableCardType: PropTypes.bool,
  disableHover: PropTypes.bool,
  disableStriped: PropTypes.bool,
  stickyHeader: PropTypes.bool,
  minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default BasicTable;

/* Ejemplos de rows - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* 
Puede enviarse de 2 maneras, la normal o como un objeto 
El de tipo objeto esta mas pensado para cuando esa celda se puede dar click

const rows = [
  { row1: 12345, row2: "texto1", row3: 1, row4: 10, row5: 10, row6: 10, row7: 1, row8: "Boton 1", row9: "block" },
  { row1: 22.2222, row2: "texto2", row3: 2.76, row4: 30.43, row5: 30.43, row6: 30.43, row7: 2, row8: "Boton 2", row9: "done" },
  { row1: "2.3", row2: "texto3", row3: 3, row4: 50, row5: 50, row6: 50, row7: 3, row8: "Boton 3", row9: "edit" },
  { row1: "1,111", row2: "texto4", row3: 4, row4: 70.439, row5: 70.439, row6: 70.439, row7: 4, row8: "Boton 4", row9: "delete" },
  { row1: ".1", row2: "texto5", row3: "1234", row4: "90", row5: "90", row6: "90", row7: "1234", row8: "Boton 5", row9: "mood" },
  {
    row1: { value: "5111.2" },
    row2: { value: "texto6" },
    row3: { value: 6 },
    row4: { value: 100 },
    row5: { value: 100 },
    row6: { value: 100 },
    row7: { value: 6, click: "click" },
    row8: { value: "Boton 6", click: "click" },
    row9: { value: "block", click: "click" },
  },
];

*/

/* Ejemplos de columns - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* 

const columns = [
  { id: "row1", label: "Numeros", type: "number", sort: false, disablePaddingHead: true, fixed: 2 },
  { id: "row2", label: "Texto", type: "text", disablePaddingBody: true },
  { id: "row3", label: "Porcen", type: "percent", disablePadding: true },
  { id: "row4", label: "Chip", type: "chip", iconChip: true, fixed: 2 },
  { id: "row5", label: "Circular", type: "circular", disableFontColor: true, fixed: 1 },
  { id: "row6", label: "Linear", type: "linear", fixed: 2, fontSize: 14 },
  { id: "row7", label: "Click", type: "number", align: "center", onClick: (e) => console.log(e) },
  { id: "row8", label: "Normal", type: "button", sort: false, align: "center", color: "#F9912A", variant: "contained", onClick: (e) => console.log(e), },
  { id: "row9", label: "Icono", type: "iconButton", sort: false, align: "center", color: "#EF4624", onClick: (e) => console.log(e), },
];

*/

/* Ejemplos de subColumns - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* 

const subColumns = [
  { id: "subTitulo1", label: "Textos", colspan: 3, align: "right", disablePadding: true },
  { label: "Graficas", colspan: 3, align: "left" },
  { label: "Botones", colspan: 3, align: "center" },
];

*/

/* Ejemplos de summary - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* 
const summary = [{ value: 0, disablePadding: true, align: "center" }, { value: 1 }, 2, 3, 4, 5, 6, 7, 8];

const summarySettings = {{ start: 0, title: "Totales: ", align: "right", fontSize: 16 }}

start se puede controlar donde se quiere el titulo "Total: " dandole el index
title se puede cambiar el texto
align alinea los elementos que no tengan alineación (toma encuentra primero la alineacion de summary)

*/

/* Paginación y Ordenamiento - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*
handlePagination, si no se manda la función se hace un ordenamiento local

handleSort, si no se manda la función se hace un ordenamiento local
Se puede mandar un orderBy desde fuera, esto para poder resetear el valor (y no aparezca la flecha)

*/

/* Otras funciones - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* 
disableCardType, en false le quita la forma de card
stickyHeader en true y maxHeight, estos van juntos para poder funcionar

*/
