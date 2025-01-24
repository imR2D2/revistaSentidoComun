import React from "react";
import PropTypes from "prop-types";
import { Select, InputLabel, FormControl, FormHelperText, MenuItem, CircularProgress } from "@mui/material";

const InputSelect = (props) => {
  const {
    label,
    value,
    onChange,
    onBlur = () => {},
    options = [],
    error = false,
    errorMessage = "",
    disabled = false,
    id = "SELECT",
    size = "normal",
    isLoading = false,
    multiple = false,
    sx = { m: 1, minWidth: 120 },
    name,
    variant,
  } = props;

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 150,
      },
    },
  };

  return (
    <FormControl sx={sx} error={error} disabled={disabled}>
      <InputLabel id={`label${id}`}>
        {" "}
        {isLoading === true ? <CircularProgress size={15} /> : label}
      </InputLabel>
      <Select
        style={{ height: "5.0ch", m: 0 }}
        labelId={`label${id}`}
        id={id}
        variant={variant}
        size={size}
        name={name}
        value={value}
        label={label}
        onChange={onChange}
        onBlur={onBlur}
        multiple={multiple}
        MenuProps={MenuProps}
        disabled={options.length === 0 || disabled}
      >
        {options.length > 0 &&
          options.map((option) => {
            return (
              <MenuItem key={option.value} value={option.value} sx={{ textWrap: "wrap" }}>
                {option.label.toUpperCase()}
              </MenuItem>
            );
          })}
      </Select>
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
      {options.length === 0 && <FormHelperText>Sin opciones</FormHelperText>}
    </FormControl>
  );
};

InputSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
  id: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  multiple: PropTypes.bool,
  sx: PropTypes.object,
};

export default InputSelect;
