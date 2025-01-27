import { useState, useEffect } from "react";

import PropTypes from "prop-types";

// Material UI
import { Box, Button } from "@mui/material";
import TitleText from "@global/text/TitleText";

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const YearsButtons = ({
  title = null,
  year = null,
  month = null,
  handleClick = () => {},
  fisrtYear = 2022,
}) => {
  const currentYear = new Date().getFullYear();

  const [localYear, setLocalYear] = useState(year || new Date().getFullYear());
  const [localMonth, setLocalMonth] = useState(month || null);

  useEffect(() => {
    if (year) setLocalYear(year);
  }, [year]);

  useEffect(() => {
    if (month !== undefined) setLocalMonth(month);
  }, [month]);

  const years = Array.from({ length: currentYear - (fisrtYear - 1) }, (_, index) => fisrtYear + index)?.sort(
    (a, b) => b - a
  );

  const localHandleClick = (selectedYear, selectedMonth = null) => {
    setLocalYear(selectedYear);
    setLocalMonth(selectedMonth);
    // Pasar año y mes seleccionados
    handleClick(selectedYear, selectedMonth);
  };

  return (
    <Box component="section">
      {title && <TitleText title={title} sx={{ textAlign: "center", pb: 3 }} />}

      <Box sx={{ display: "flex", justifyContent: "left", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        {years.map((item, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => localHandleClick(item)}
            sx={{
              borderColor: "rgb(0,96,107)",
              borderRadius: "12px",
              color: "rgb(0,96,107)",
              fontWeight: 600,
              px: 3,
              py: .6,
              ...(item === localYear
                ? { backgroundColor: "rgb(0,96,107)", color: "#fff", borderColor: "rgb(0,96,107)" }
                : {}),
              "&:hover": { backgroundColor: "rgb(0,96,107)", color: "#fff", borderColor: "rgb(0,96,107)" },
            }}
          >
            {item}
          </Button>
        ))}
      </Box>

      {localYear && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mt: 3,
          }}
        >
          {monthNames.map((item, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => localHandleClick(localYear, index + 1)} // Meses son de 1 a 12
              sx={{
                borderColor: "rgb(0,96,107)",
                borderRadius: "10px",
                color: "rgb(0,96,107)",
                fontWeight: 600,
                fontSize: 10,
                px: 3,
                py: .5,
                ...(index + 1 === localMonth
                  ? { backgroundColor: "rgb(0,96,107)", color: "#fff", borderColor: "rgb(0,96,107)" }
                  : {}),
                "&:hover": {
                  backgroundColor: "rgb(0,96,107)",
                  color: "#fff",
                  borderColor: "rgb(0,96,107)",
                },
              }}
            >
              {item}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

YearsButtons.propTypes = {
  title: PropTypes.string,
  year: PropTypes.number,
  month: PropTypes.number,
  handleClick: PropTypes.func,
  fisrtYear: PropTypes.number,
};

export default YearsButtons;
