import { Avatar, Stack, Typography, Box } from '@mui/material';
import { grey } from '@mui/material/colors';

const CircleCard = ({ image, fullname, position, location, type }) => {
  return (
    <>
      <Box className={type === 2 ? "directorio-perfil _20" : "directorio-perfil"}>
        <Stack direction="row" spacing={2} display={'flex'} justifyContent={'center'}>
          <Avatar
            alt={fullname}
            src={image}
            sx={{ width: 160, height: 160 }}
          />
        </Stack>

        <Box>
          <Typography sx={{ textAlign: 'center', fontSize: 16, fontWeight: 600, color: grey[700], mt: 2 }}>{fullname}</Typography>
          <Typography sx={{ textAlign: 'center', fontSize: 15, fontWeight: 400, color: grey[700], mt: 1.5 }}>
            {position}
            <br />
            <span>
              Promoción Política de la Mujer
            </span>
            <br />
            {location}
          </Typography>
        </Box>

        {/* <div>
          <a
            href="mailto:dlevy@pangto.org?subject=Contacto%20sitio%20web%20de%20FOCA"
            className="directorio-perfil-redes w-inline-block"
          >
            <img src="images/Mail-With-Circle.svg" loading="lazy" alt="" />
          </a>
          <a href="https://twitter.com/oly_zapata" className="directorio-perfil-redes w-inline-block">
            <img src="images/Twitter-With-Circle.svg" loading="lazy" alt="" />
          </a>
        </div> */}
      </Box>
    </>
  );
};

export default CircleCard;
