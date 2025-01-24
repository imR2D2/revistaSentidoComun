import { useState, useEffect, useCallback, Fragment } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from "prop-types";
import { Swal } from "@utils/alerts";

// Material UI
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Icon,
  Typography,
  Alert,
  Grid,
  TextField,
  IconButton,
  Button,
  List,
  LinearProgress,
  CircularProgress,
} from "@mui/material";

// Componentes
import DefaultListItem from "@components/Lists/DefaultListItem";

const BasicListDoble = (props) => {
  const {
    id = "timeline-container",
    API = () => ({ results: false, message: "Ingresa una API" }),
    APIKeys = [
      { id: "name", filter: "LIKE" },
      { id: "phone", filter: "LIKE" },
    ],
    APIFilter,
    APISort,
    pageSize = 20,
    label, //= "Encuentra al usuario",
    labelNote, //= "Nota: Debe ingresar un nombre",
    initialSearch = false,
    emptySearch = false,
    header = { icon: "list_alt", title: "Listado" }, // false
    config = { height: 400, endMessage: "No hay registros para mostrar" },
    finder = true, // { placeholder: "Buscar por nombre", placeholder2: "Buscar por celular" }
    doubleSearch = false,
    breaks = { sm: 12, md: 6 },
    buttonsBreaks = { sm: 12, md: 4 },
    lengthValidation = {},
    inputValidation = {},
    inputFormat = {},
    clearData = false,
    selectFirst = false,
    disableCardType = false,
    itemComponent = DefaultListItem,
    setLoading = () => {},
    setLoadingHasMore = () => {},
    handleClick = () => {},
    handleAction = () => {},
    handleClear = () => {},
    headerComponent = null,
  } = props;

  const [localLoading, setLocalLoading] = useState(false);
  const [localLoadingHasMore, setLocalLoadingHasMore] = useState(false);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [showedItems, setShowedItems] = useState(0);

  const [hasMore, setHasMore] = useState(false);
  const [params, setParams] = useState({ page: 0, pageSize });

  const [selected, setSelected] = useState("");
  const [searchInput1, setSearchInput1] = useState("");
  const [searchInput2, setSearchInput2] = useState("");

  useEffect(() => {
    if (initialSearch) fetchAPI(["", ""]);
    // eslint-disable-next-line
  }, [initialSearch]);

  const fetchAPI = async (params) => {
    try {
      setData([]);
      setHasMore(false);
      setLoading(true);
      setLocalLoading(true);
      const localParams = {
        page: 0,
        pageSize,
        filtered: [],
        sorted: [],
      };

      if (APIFilter && APIFilter?.start && APIFilter?.start?.length) {
        localParams.filtered.push(...APIFilter?.start);
      }
      if (APISort && APISort?.start && APISort?.start?.length) {
        localParams.sorted.push(...APISort?.start);
      }

      if (params[0]) {
        const filter = APIKeys[0]?.filter ?? "LIKE";
        localParams.filtered.push({
          id: APIKeys[0]?.id ?? "name",
          filter,
          value: filter === "LIKE" ? `%${params[0]}%` : params[0],
          inheritFilterType: APIKeys[0]?.inheritFilterType ?? null,
        });
      }

      if (APIFilter && APIFilter?.center && APIFilter?.center?.length) {
        localParams.filtered.push(...APIFilter?.center);
      }
      if (APISort && APISort?.center && APISort?.center?.length) {
        localParams.sorted.push(...APISort?.center);
      }

      // Busqueda del segundo item
      if (APIKeys[1]?.id && doubleSearch && params[1]) {
        const filter = APIKeys[1]?.filter ?? "LIKE";
        localParams.filtered.push({
          id: APIKeys[1]?.id ?? "name",
          filter,
          value: filter === "LIKE" ? `%${params[1]}%` : params[1],
          inheritFilterType: APIKeys[0]?.inheritFilterType ?? null,
        });
      }

      if (APIFilter && APIFilter?.end && APIFilter?.end?.length) {
        localParams.filtered.push(...APIFilter?.end);
      }
      if (APISort && APISort?.end && APISort?.end?.length) {
        localParams.sorted.push(...APISort?.end);
      }

      setParams(localParams);

      const res = await API(localParams);
      const { results, response, message } = res;

      if (results) {
        const data = response.data ?? [];
        const total = response.total;

        setData(data);
        setShowedItems(data?.length ?? 0);
        setTotal(total);

        if (selectFirst) handleSelected(data[0], 0);

        if (data?.length < total) setHasMore(true);
        else setHasMore(false);
      } else throw new Error(message);
    } catch (e) {
      setData([]);
      setShowedItems(0);
      setTotal(0);
      setHasMore(false);
      setParams({ page: 0, pageSize });
      Swal.fire({ title: e.message, icon: "warning" });
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  const fetchHasMore = useCallback(async () => {
    if (!localLoadingHasMore && data.length < total) {
      try {
        setLoadingHasMore(true);
        setLocalLoadingHasMore(true);

        const localParams = params;
        localParams.page = params.page + 1;

        setParams(localParams);

        const res = await API(localParams);
        const { results, response, message } = res;

        if (results) {
          const localData = data.concat(response.data ?? []);
          const total = response.total;

          setData(localData);
          setShowedItems(localData?.length ?? 0);
          setTotal(total);

          if (localData?.length < total) setHasMore(true);
          else setHasMore(false);
        } else throw new Error(message);
      } catch (e) {
        setData([]);
        setShowedItems(0);
        setTotal(0);
        setHasMore(false);
        setParams({ page: 0, pageSize });
        Swal.fire({ title: e.message, icon: "warning" });
      } finally {
        setLoadingHasMore(false);
        setLocalLoadingHasMore(false);
      }
    }
    // eslint-disable-next-line
  }, [localLoadingHasMore, data, total, params, setLoadingHasMore, API]);

  const handleSelected = (data, selected) => {
    setSelected(selected);
    handleClick(data);
  };

  const invalidLength = (value, validation) => {
    const localValue = validation?.value;
    const filter = validation?.filter ?? "=";

    if (localValue && value) {
      switch (filter) {
        case "=":
          if (!(value.length === localValue))
            return { result: true, message: `Debe tener una longitud igual a ${localValue}` };
          break;
        case ">":
          if (!(value.length > localValue))
            return { result: true, message: `Debe tener una longitud mayor a ${localValue}` };
          break;
        case "<":
          if (!(value.length < localValue))
            return { result: true, message: `Debe tener una longitud menor a ${localValue}` };
          break;
        case "!=":
          if (!(value.length !== localValue))
            return { result: true, message: `Debe tener una longitud diferente a ${localValue}` };
          break;
        case ">=":
          if (!(value.length >= localValue))
            return { result: true, message: `Debe tener una longitud mayor o igual a ${localValue}` };
          break;
        case "<=":
          if (!(value.length <= localValue))
            return { result: true, message: `Debe tener una longitud menor o igual a ${localValue}` };
          break;
        default:
          if (!(value.length === localValue))
            return { result: true, message: `Debe tener una longitud igual a ${localValue}` };
          break;
      }
    }

    return { result: false, message: `` };
  };

  const handleSubmit = (value, value2) => {
    const search = !(emptySearch || initialSearch);

    if (invalidLength(value, lengthValidation?.input1).result) return;

    if (invalidLength(value2, lengthValidation?.input2).result) return;

    if (!doubleSearch && searchInput1 === "" && search) return;
    if (doubleSearch && searchInput1 === "" && searchInput2 === "" && search) return;

    const container = document.getElementsByClassName(id);
    if (container) container[0].scrollTo({ top: 0, behavior: "smooth" });

    setSelected("");
    fetchAPI([`${value.toString().toUpperCase()}`, value2]);
  };

  const handleLocalClear = () => {
    if (searchInput1 === "" && searchInput2 === "") return;
    setSearchInput1("");
    setSearchInput2("");

    setSelected("");
    handleClear();

    if (clearData) {
      setData([]);
      setShowedItems(0);
      setTotal(0);
      setHasMore(false);
      setParams({ page: 0, pageSize });
    }

    if (!(emptySearch || initialSearch)) return;

    fetchAPI(["", ""]);
  };

  const handleInput1 = (val) => {
    const { input1 = () => true } = inputValidation;
    const { input1: format = (e) => e } = inputFormat;
    const value = format(val);

    if (input1(value)) setSearchInput1(value);
    if (value.length < 1 && emptySearch) handleSubmit(value, searchInput2);
  };

  const handleInput2 = (val) => {
    const { input2 = () => true } = inputValidation;
    const { input2: format = (e) => e } = inputFormat;
    const value = format(val);

    if (input2(value)) setSearchInput2(value);
    if (value.length < 1 && emptySearch) handleSubmit(searchInput1, value);
  };

  return (
    <Box
      sx={{ width: "100%", mb: "0 !important" }}
      component={!disableCardType ? Card : Box}
      className={!disableCardType ? "cardStyle" : ""}
    >
      {header && (
        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <CardHeader
              avatar={<Icon>{header?.icon ?? "list_alt"}</Icon>}
              title={header?.title ?? "Listado"}
            />
          </Box>
          {headerComponent && <Box mr={2}>{headerComponent}</Box>}
        </Box>
      )}

      <CardContent sx={{ pt: header ? 0 : 2 }}>
        {(label || labelNote) && (
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {label && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {label}
                </Typography>
              </Grid>
            )}
            {labelNote && (
              <Grid item xs={12}>
                <Alert variant="outlined" severity="info" sx={{ borderColor: "info.main", mb: 1 }}>
                  {labelNote}
                </Alert>
              </Grid>
            )}
          </Grid>
        )}

        {finder && (
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {/* TextFields */}
            <Grid
              item
              xs={12}
              {...(doubleSearch
                ? {
                    sm: breaks?.sm,
                    md: breaks?.md,
                    lg: breaks?.lg,
                    xl: breaks?.xl,
                  }
                : {})}
            >
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label={finder?.placeholder ?? "Buscar por usuario"}
                value={searchInput1}
                onChange={(e) => handleInput1(e.target.value)}
                error={invalidLength(searchInput1, lengthValidation?.input1).result}
                helperText={invalidLength(searchInput1, lengthValidation?.input1).message}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit(searchInput1, searchInput2);
                  }
                }}
                {...(!doubleSearch
                  ? {
                      InputProps: {
                        endAdornment: (
                          <IconButton
                            aria-label="search"
                            onClick={() => handleSubmit(searchInput1, searchInput2)}
                          >
                            <Icon>search</Icon>
                          </IconButton>
                        ),
                      },
                    }
                  : {})}
              />
            </Grid>

            {doubleSearch && (
              <Grid item xs={12} sm={breaks?.sm} md={breaks?.md} lg={breaks?.lg} xl={breaks?.xl}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label={finder?.placeholder2 ?? "Buscar por celular"}
                  value={searchInput2}
                  onChange={(e) => handleInput2(e.target.value)}
                  error={invalidLength(searchInput2, lengthValidation?.input2).result}
                  helperText={invalidLength(searchInput2, lengthValidation?.input2).message}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit(searchInput1, searchInput2);
                    }
                  }}
                />
              </Grid>
            )}

            {/* Botones */}
            {doubleSearch && (
              <Grid item xs={12} container spacing={1} sx={{ justifyContent: "end" }}>
                <Grid
                  item
                  xs={12}
                  sm={buttonsBreaks?.sm}
                  md={buttonsBreaks?.md}
                  lg={buttonsBreaks?.lg}
                  xl={buttonsBreaks?.xl}
                >
                  <Button
                    fullWidth
                    size="small"
                    color="primaryDark"
                    variant="contained"
                    startIcon={<Icon>search</Icon>}
                    onClick={() => handleSubmit(searchInput1, searchInput2)}
                  >
                    Buscar
                  </Button>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={buttonsBreaks?.sm}
                  md={buttonsBreaks?.md}
                  lg={buttonsBreaks?.lg}
                  xl={buttonsBreaks?.xl}
                >
                  <Button
                    fullWidth
                    size="small"
                    color="primaryDark"
                    variant="outlined"
                    onClick={handleLocalClear}
                  >
                    Limpiar
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        )}

        <InfiniteScroll
          className={id}
          dataLength={showedItems}
          next={fetchHasMore}
          hasMore={hasMore}
          loader={<LinearProgress color="secondary" />}
          height={config?.height ?? 400}
          endMessage={
            localLoading ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress size={60} />
              </Box>
            ) : (
              <p style={{ textAlign: "center" }}>
                <b>{config?.endMessage ?? "No hay registros para mostrar"}</b>
              </p>
            )
          }
        >
          {data.length > 0 && (
            <List dense={true}>
              {data.map((item, index) => (
                <Fragment key={index}>
                  {itemComponent({
                    item: item,
                    index: index,
                    selected: selected,
                    handleSelected: handleSelected,
                    handleAction: handleAction,
                  })}
                </Fragment>
              ))}
            </List>
          )}
        </InfiniteScroll>
      </CardContent>

      <CardActions>
        <small>
          Mostrando {showedItems} de {total}
        </small>
      </CardActions>
    </Box>
  );
};

BasicListDoble.propTypes = {
  id: PropTypes.string,
  API: PropTypes.func,
  APIKeys: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      filter: PropTypes.string,
      inheritFilterType: PropTypes.string,
    })
  ),
  APIFilter: PropTypes.shape({
    start: PropTypes.array,
    center: PropTypes.array,
    end: PropTypes.array,
  }),
  APISort: PropTypes.shape({
    start: PropTypes.array,
    center: PropTypes.array,
    end: PropTypes.array,
  }),
  pageSize: PropTypes.number,
  label: PropTypes.string, // "Encuentra al usuario",
  labelNote: PropTypes.string, // "Nota: Debe ingresar un nombre",
  initialSearch: PropTypes.bool, // Busca al iniciar el componente
  emptySearch: PropTypes.bool, // Busca al poner el input en ""
  header: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      icon: PropTypes.string,
      title: PropTypes.string,
    }),
  ]),
  config: PropTypes.shape({
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    endMessage: PropTypes.string,
  }),
  finder: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      placeholder: PropTypes.string,
      placeholder2: PropTypes.string,
    }),
  ]),
  doubleSearch: PropTypes.bool,
  breaks: PropTypes.shape({
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),
  buttonsBreaks: PropTypes.shape({
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),
  // Acepta validar formatos como isTypePhone
  inputValidation: PropTypes.shape({
    input1: PropTypes.func,
    input2: PropTypes.func,
  }),
  // Le da un formato como limpiarTelefono
  inputFormat: PropTypes.shape({
    input1: PropTypes.func,
    input2: PropTypes.func,
  }),
  lengthValidation: PropTypes.shape({
    input1: PropTypes.shape({
      filter: PropTypes.oneOf(["=", ">", "<", "!=", ">=", "<="]),
      value: PropTypes.number,
    }),
    input2: PropTypes.shape({
      filter: PropTypes.oneOf(["=", ">", "<", "!=", ">=", "<="]),
      value: PropTypes.number,
    }),
  }),
  clearData: PropTypes.bool, // Limpia los datos al dar en limpiar
  selectFirst: PropTypes.bool, // Selecciona el primer resultado
  disableCardType: PropTypes.bool,
  itemComponent: PropTypes.any,
  setLoading: PropTypes.func,
  setLoadingHasMore: PropTypes.func,
  handleClick: PropTypes.func,
  handleAction: PropTypes.func,
  handleClear: PropTypes.func,
  headerComponent: PropTypes.node,
};

export default BasicListDoble;

// Ejemplo de uso
/*
<BasicListDoble
  API={UserService.getUsers}
  APIKeys={[
    { id: ["usuarios.Nombre", "usuarios.Paterno", "usuarios.Materno"], filter: "LIKE" },
    { id: "usuarios.Username", filter: "=" },
  ]}
  itemComponent={DefaultListItem} // Se puede omitir
  handleClick={handleOption}
  inputValidation={{ input2: isTypePhone }}
  inputFormat={{ input2: limpiarTelefono }}
  lengthValidation={{ input2: { filter: "=", value: 10 } }}
  initialSearch
  emptySearch
  doubleSearch
  clearData
/>
*/
