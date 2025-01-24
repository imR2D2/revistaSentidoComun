import PropTypes from "prop-types";

// Material UI
import { FormControl, CircularProgress, TextField, Autocomplete, Tooltip, Chip } from "@mui/material";

const AdvancedSelect = (props) => {
  const {
    id = "id_AdvancedSelect",
    name = "name_AdvancedSelect",
    label = "Titulo",
    placeholder = "Buscar",
    value = "",
    options = [],
    onChange = () => {},
    onKeyDown = () => {},
    onKeyPress = () => {},
    limitTags = -1,
    useObjects = false,
    defaultOption = "",
    size = "small",
    required = false,
    disabled = false,
    multiple = false,
    error = false,
    helperText = "",
    isLoading = false,
    isSearchable = false,
    disableCloseOnSelect = false,
    filterSelectedOptions = false,
    tooltipOptions = false,
    sx = {},
  } = props;

  const handleChange = (values) => {
    if (!multiple) {
      const params = { ...values, name, id };
      onChange(params);
    } else {
      const length = values.length;
      if (typeof values[length > 0 ? length - 1 : length] === "object" || length === 0) {
        if (useObjects) onChange(values);
        else {
          const ids = values.map((item) => item.value);
          onChange(ids);
        }
      }
    }
  };

  const handleChangeInput = (e) => {
    const value = e.target.value;
    if (!multiple && value === "") {
      const params = { value: defaultOption, label: "", name, id };
      onChange(params);
    }
  };

  // Eliminar duplicados (aqui el id seria el label)
  const uniqueOptions = options.filter((value, index, self) => {
    return self.findIndex((v) => v.label === value.label) === index;
  });

  const tooltipOptionsValues = tooltipOptions
    ? {
        renderTags: (value, getTagProps) =>
          value.map((option, index) => (
            <Tooltip key={option.value} title={option.label} disableInteractive arrow>
              <Chip {...getTagProps({ index })} label={option.label} size="small" />
            </Tooltip>
          )),
        renderOption: (props, option) => {
          return (
            <div {...props}>
              <Tooltip title={option.label} disableInteractive arrow>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {option.label}
                </div>
              </Tooltip>
            </div>
          );
        },
      }
    : {};

  // Obtener los ID para useObjects
  const useObjectsIDs = multiple && useObjects ? value.map((item) => item.value) : [];
  // Verifica si todas las opciones han sido seleccionadas
  const allOptionsSelected = multiple ? value.length === uniqueOptions.length : uniqueOptions.length === 1;

  return (
    <FormControl fullWidth sx={{ flex: 1, ...sx }} error={error} disabled={disabled}>
      <Autocomplete
        multiple={multiple}
        required={required}
        size={size}
        name={name}
        id={"advancedSelect" + (id || name)}
        limitTags={limitTags}
        value={
          multiple
            ? !isLoading
              ? useObjects
                ? uniqueOptions.filter((option) => useObjectsIDs.includes(option.value))
                : uniqueOptions.filter((option) => value.includes(option.value))
              : []
            : !isLoading
            ? useObjects
              ? uniqueOptions.find((option) => option.value === value.value) || { value: 0, label: "" }
              : uniqueOptions.find((option) => option.value === value) || { value: 0, label: "" }
            : { value: 0, label: "" }
        }
        options={uniqueOptions}
        getOptionLabel={(option) => option.label}
        onChange={(e, values) => handleChange(values)}
        disabled={uniqueOptions.length === 0 || disabled || isLoading}
        readOnly={uniqueOptions.length === 0 || disabled || isLoading}
        freeSolo={allOptionsSelected}
        disableCloseOnSelect={disableCloseOnSelect}
        filterSelectedOptions={filterSelectedOptions || multiple || allOptionsSelected}
        disableClearable={!multiple}
        noOptionsText="Sin opciones"
        onKeyDown={onKeyDown}
        onKeyPress={onKeyPress}
        renderInput={(params) => {
          const input = params.inputProps;
          const style = input.ref.current?.style;
          input.readOnly = !isSearchable || allOptionsSelected;
          if (style) {
            style.cursor = !isSearchable || allOptionsSelected ? "pointer" : "text";
            if (multiple) {
              style.minWidth = !isSearchable || allOptionsSelected ? 0 : "";
              style.padding = !isSearchable || allOptionsSelected ? 0 : "";
            }
          }
          return (
            <TextField
              {...params}
              error={error}
              helperText={(uniqueOptions.length === 0 && "Sin opciones") || helperText}
              label={isLoading ? <CircularProgress size={15} /> : label}
              placeholder={!isSearchable || allOptionsSelected ? "" : placeholder}
              onChange={handleChangeInput}
              sx={{
                "& input::selection": {
                  backgroundColor: !isSearchable || allOptionsSelected ? "transparent" : "auto",
                },
              }}
            />
          );
        }}
        {...tooltipOptionsValues}
      />
    </FormControl>
  );
};

AdvancedSelect.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  limitTags: PropTypes.number,
  useObjects: PropTypes.bool, // Manda y recibe objetos (de no estar activo manda y retorna los ids)
  defaultOption: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  isLoading: PropTypes.bool,
  isSearchable: PropTypes.bool,
  disableCloseOnSelect: PropTypes.bool, // Cierra las opciones al seleccionar una
  filterSelectedOptions: PropTypes.bool, // Quita la opcion seleccionada
  tooltipOptions: PropTypes.bool, // Añade tooltips a las opciones y los seleccionados en multiple
  onKeyDown: PropTypes.func,
  onKeyPress: PropTypes.func,
  sx: PropTypes.object,
};

export default AdvancedSelect;
