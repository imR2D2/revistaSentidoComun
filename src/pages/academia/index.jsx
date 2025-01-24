import { useState, useEffect } from "react";

// Material UI
import { Container, Grid, Typography, Box, Card, CardContent, CardMedia, Button } from "@mui/material";
import { Fade } from "@successtar/react-reveal";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import { grey } from '@mui/material/colors';

// Navigate
import { useNavigate } from "react-router-dom";

// Components
import CustomModal from "@components/global/modal/Modal";
import YearsButtons from "@components/global/button/YearsButtons";
import NotFound from "@global/text/NotFound";
import FilterCollapse from "@components/global/filters/FilterCollapse";

// Constants
import meses from "@data/constants/date";
import { AuthorsSelect } from "@data/constants/academia";

// Helpers Firebase 
import { getData } from "@utils/firebase/firebaseHelpers";

const getMonthName = (monthNumber) => {
  if (!monthNumber) return "Sin mes";
  const monthObj = meses.find((m) => m[monthNumber]);
  return monthObj ? monthObj[monthNumber] : "Sin mes";
};

const Blog = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const result = await getData();
      if (result.success) {
        setPosts(result.data);
      } else {
        console.error("Error fetching data:", result.message);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Filtrar posts por el año y mes seleccionados
  const filteredPosts = posts
    .filter((post) => {
      if (selectedMonth) {
        return post.year === selectedYear && post.month === selectedMonth;
      }
      return post.year === selectedYear;
    })
    .filter((post) => post != null);

  // Filtrar posts por el año y mes seleccionados
  const getResponsableName = (idResponsabilidad) => {
    const option = AuthorsSelect.find(option => option.value === idResponsabilidad);
    return option ? option.label : "Sin responsable";
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPost(null);
  };

  // Manejar el cambio de año y mes
  const handleYearAndMonthChange = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const modalButtons = [
    {
      title: "Ver nota",
      link: selectedPost?.link ?? "",
      icon: "facebook",
    },
  ];

  return (
    <Container id="Blog" component="section" maxWidth="xl" sx={{ pt: 4, mt: 7 }}>
      <Fade duration={3000}>
        <>
          <Box sx={{ textAlign: "center", my: 4, px: 3 }}>
            <Typography variant="h4" component="h2">
              Academia
            </Typography>

            <Typography variant="subtitle1" color="textSecondary">
              Descubre las últimas noticias, textos científicos y actualizaciones de nuestro equipo
            </Typography>
          </Box>

          <FilterCollapse>
            <YearsButtons
              title=""
              year={selectedYear}
              month={selectedMonth}
              handleClick={handleYearAndMonthChange}
              fisrtYear={2019}
            />
          </FilterCollapse>

          <Box sx={{ my: 4, p: 2 }}>
            {loading ? (
              <Typography variant="h6" align="center">
                Cargando...
              </Typography>
            ) : filteredPosts.length === 0 ? (
              <Box sx={{ textAlign: "center", my: 4 }}>
                <NotFound
                  title={`No hay posts disponibles para el año y mes seleccionados.`}
                  subTitle="Intenta utilizar el filtro ubicado encima."
                />
              </Box>
            ) : (
              <Grid container spacing={4}>
                <style>{`.blog-item .react-reveal { height: 100%; } `}</style>
                {filteredPosts?.map((post, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index} className="blog-item">
                    <Fade up delay={400 + index * 50}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          boxShadow: "0px 4px 12px 2px rgba(0, 0, 0, 0.2)",
                          height: "400px",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CardMedia component="img" height="200" image={post?.imageFile} alt={post?.fullName} />
                        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            {post?.title}
                          </Typography>

                          {post?.day && post?.month && post?.year &&
                            <Typography variant="subtitle2" gutterBottom>
                              <CalendarTodayIcon sx={{ color: grey[800], verticalAlign: 'middle', fontSize: 20, mr: 1 }} />
                              {post?.day} de {post.month != null ? getMonthName(post?.month) : "Sin mes"}&nbsp;
                              <span style={{ fontStyle: "italic", fontSize: "12px" }}>
                                {`(Publicado hace ${formatDistanceToNow(
                                  new Date(post?.year, post?.month - 1, post?.day),
                                  { locale: es }
                                )})`}
                              </span>
                            </Typography>
                          }


                          <Typography variant="subtitle2" gutterBottom>
                            <PersonIcon sx={{ color: grey[800], verticalAlign: 'middle', fontSize: 20, mr: 1 }} />
                            {post?.fullName || getResponsableName(post?.idResponsabilidad) || "Sin Autor"}
                          </Typography>


                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            {post?.shortDescription}
                          </Typography>

                          <Box flex={1} />

                          <Button size="small" sx={{ marginTop: 2 }} onClick={() => navigate(post?.titleURL, { state: { title: post?.title, id: post?.id } })}>
                            Ver más información
                          </Button>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {selectedPost && (
            <CustomModal
              open={modalOpen}
              onClose={handleCloseModal}
              title={selectedPost.fullName}
              image={{ src: selectedPost.imageFile, title: selectedPost.fullName }}
              fullWidth
              maxWidth="md"
              actionButtons={modalButtons}
            >
              <Typography variant="h6" gutterBottom>
                {selectedPost.day} {selectedPost.month != null ? getMonthName(selectedPost.month) : "Sin mes"}{" "}
                - {selectedPost.year}
              </Typography>
              <Typography variant="body1">{selectedPost.largeDescription}</Typography>
            </CustomModal>
          )}
        </>
      </Fade>
    </Container>
  );
};

export default Blog;
