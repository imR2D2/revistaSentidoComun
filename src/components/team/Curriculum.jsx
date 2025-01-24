import { useState } from "react";
import { format, parse, isValid, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

// Material UI
import { Box, Typography, Chip, Avatar, Button, Link, Divider } from "@mui/material";

// Componentes
import SocialsButtons from "@global/button/SocialsButtons";

// Data
import { typeCatalog, timeCatalog } from "@data/constants/form";

const Curriculum = ({ user }) => {
  // Función para analizar la fecha
  const parseDate = (date) => {
    const formatDate = date ? parse(date, "yyyy-MM-dd", new Date()) : new Date();
    if (!isValid(formatDate)) return { date: null, format: "" };
    return { date: formatDate, format: format(formatDate, "MMM yyyy", { locale: es }) };
  };

  // Función para calcular la duración en años y meses
  const calculateDuration = (startDate, endDate, disableCount = false) => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start.date || !end.date) return "";

    const days = differenceInDays(end.date, start.date);
    const totalMonths = Math.round(days / 30.44);

    const years = Math.floor(totalMonths / 12);
    let months = totalMonths % 12;
    if (months === 0) months = 1;

    const formattedDuration = [];
    if (years > 0) formattedDuration.push(`${years} año${years > 1 ? "s" : ""}`);
    formattedDuration.push(`${months} mes${months > 1 ? "es" : ""}`);

    return `${start.format} - ${endDate ? end.format : "Actualidad"} 
      ${disableCount ? "" : `· ${formattedDuration.join(" ")}`}`;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", py: 3, px: 1 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar
            src={user?.image}
            alt={`${user?.name} ${user?.lastname}`}
            sx={{ width: 200, height: 200 }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography variant="h5" align="center">
            {user?.fullname}
          </Typography>

          <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
            {user?.workstation?.join(" / ")}
          </Typography>

          <SocialsButtons
            links={user?.social}
            disableEmail={!user?.social?.email}
            disableFacebook={!user?.social?.facebook}
            disableX={!user?.social?.x}
            disableInstagram={!user?.social?.instagram}
            disableYouTube={!user?.social?.youtube}
            disableTelegram={!user?.social?.telegram}
            disableLinkedIn={!user?.social?.linkedin}
            disableGitHub={!user?.social?.github}
          />
        </Box>
      </Box>

      <Description text={user?.description ?? ""} />

      <History
        title="Experiencia"
        data={user?.jobsHistory}
        Component={({ item }) => (
          <>
            <Typography variant="body2" fontWeight="bold" fontSize={16}>
              {item.name}
            </Typography>
            <Typography variant="body2" fontSize={12} color="rgb(0 0 0/.75)">
              {calculateDuration(item.dateStart, item.dateEnd)}
            </Typography>
            <Typography variant="body2" fontSize={13}>
              {timeCatalog.find((time) => time.value === item.time)?.label ?? ""}
            </Typography>

            <Box display="flex" direction="row" gap={0.6} flexWrap="wrap">
              <Typography variant="body2" noWrap fontSize={13}>
                {item.ubication}
              </Typography>
              <Typography variant="body2">-</Typography>
              <Typography variant="body2" noWrap fontSize={13}>
                {typeCatalog.find((type) => type.value === item.type)?.label ?? ""}
              </Typography>
            </Box>

            <Box display="flex" direction="row" gap={1} py={1} flexWrap="wrap">
              {item.job.map((jobTitle, index) => (
                <Chip key={index} size="small" label={jobTitle} />
              ))}
            </Box>
          </>
        )}
      />

      <History
        title="Educación"
        data={user?.educationHistory}
        Component={({ item }) => (
          <>
            <Typography variant="body2" fontWeight="bold" fontSize={16}>
              {item.name}
            </Typography>
            <Typography variant="body2" fontSize={12} color="rgb(0 0 0/.75)">
              {calculateDuration(item.dateStart, item.dateEnd, true)}
            </Typography>
            <Typography variant="body2" fontSize={13}>
              {item.title}
            </Typography>
            <Typography variant="body2" fontSize={13}>
              {item.ubication}
            </Typography>
          </>
        )}
      />

      {user?.skills?.length > 0 && (
        <>
          <LocalDivider />

          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>

          <Box display="flex" direction="row" gap={1} py={1} flexWrap="wrap">
            {user?.skills?.map((skillTitle, index) => (
              <Chip key={index} size="small" label={skillTitle} />
            ))}
          </Box>
        </>
      )}

      <History
        title="Certificaciones"
        data={user?.certificationsHistory}
        Component={({ item }) => (
          <>
            <Typography variant="body2" fontWeight="bold" fontSize={16}>
              {item.name}
            </Typography>
            <Typography variant="body2" fontSize={12} color="rgb(0 0 0/.75)">
              Expedición: {parseDate(item?.date)?.format}
            </Typography>
            <Typography variant="body2">{item.company}</Typography>

            {item.link && (
              <Link
                href={item.link}
                sx={{ fontSize: 12, fontWeight: 500 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver certificado
              </Link>
            )}
          </>
        )}
      />
    </Box>
  );
};

const History = ({ title = "", data = [], Component = <></>, total = 2 }) => {
  const [showAll, setShowAll] = useState(false);
  const dataToShow = showAll ? data : data?.slice(0, total);

  const handleShowMore = () => setShowAll(!showAll);

  return (
    data?.length > 0 && (
      <>
        <LocalDivider />

        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        {dataToShow.map((item, index) => (
          <Box key={index} sx={{ mb: index === dataToShow.length - 1 ? 0 : 2 }}>
            <Component item={item} />
          </Box>
        ))}

        {data?.length > 2 && (
          <Button size="small" onClick={handleShowMore} variant="outlined" sx={{ mt: 1 }}>
            {!showAll ? "Ver más" : "Ver menos"}
          </Button>
        )}
      </>
    )
  );
};

const Description = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Limitar el texto a los primeros 200 caracteres
  const MAX_LENGTH = 200;
  const isTextLong = text.length > MAX_LENGTH;
  const truncatedText = isTextLong ? text.substring(0, MAX_LENGTH) + "..." : text;

  // Reemplazar los saltos de línea con <br /> para que se rendericen correctamente
  const formatText = (text) => text.replace(/\n/g, "<br />");

  const button = (text) =>
    `<span style="padding-left: 8px; text-wrap: noWrap;  color: #898989; cursor: pointer; transition: color 0.3s;" onmouseover="this.style.color='#2b66a9'" onmouseout="this.style.color='#898989'" onclick="document.querySelector('.show-more-btn').click()"> ${text}</span>`;

  return (
    <Box>
      <Typography
        variant="body1"
        paragraph
        mt={2}
        component="div" // Usa `div` para permitir el HTML
        dangerouslySetInnerHTML={{
          __html:
            isExpanded || !isTextLong
              ? formatText(text) + (isTextLong && isExpanded ? button("Ver menos") : "")
              : formatText(truncatedText) + (isTextLong && !isExpanded ? button("Ver más") : ""),
        }}
      />
      {isTextLong && (
        <Button
          className="show-more-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ display: "none" }} // Ocultamos el botón visualmente cuando no está expandido
        >
          {isExpanded ? "Ver menos" : "Ver más"}
        </Button>
      )}
    </Box>
  );
};

const LocalDivider = () => (
  <Divider
    sx={{
      borderStyle: "none",
      height: "2px",
      background:
        "repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12) 10px, transparent 10px, transparent 20px)",
      my: 3,
    }}
  />
);

export default Curriculum;
