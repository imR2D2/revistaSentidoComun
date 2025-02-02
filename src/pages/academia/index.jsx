import { useState, useEffect } from "react";

// Material UI
import { Container, Grid, Typography, Box, Card, CardContent, CardMedia } from "@mui/material";
import { Fade } from "@successtar/react-reveal";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from '@mui/material';

// Navigate
import { useNavigate } from "react-router-dom";

// Components
import CustomModal from "@components/global/modal/Modal";
import YearsButtons from "@components/global/button/YearsButtons";
import NotFound from "@global/text/NotFound";
import FilterCollapse from "@components/global/filters/FilterCollapse";
import PaginationTemplate from "@components/academia/Pagination";
import FloatingButton from '@components/global/button/FloatingButton';

// Constants
import meses from "@data/constants/date";

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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 1
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      const result = await getData(selectedYear, selectedMonth, pageSize, page);
      console.log(result, 'datos')

      if (result.success) {
        setPosts(result?.data);
        setTotal(result?.pagination?.totalRecords)
      } else {
        console.error("Error fetching data:", result.message);
      }
      setLoading(false);
    };

    fetchPosts();
    // eslint-disable-next-line
  }, [selectedYear, selectedMonth, page]);

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


  const handlePaginationChange = ({ page }) => {
    setPage(page);
  };

  return (
    <Container id="Blog" component="section" maxWidth="xl" sx={{ pt: 4, mt: 7 }}>
      <Fade duration={3000}>
        <>
          <Box sx={{ textAlign: "center", my: 4, px: 3 }}>
            <Typography variant="subtitle1" color="textSecondary">
              Explora las ediciones más recientes de nuestra revista, con artículos exclusivos, análisis profundos y las últimas tendencias en diversos campos del conocimiento. Mantente actualizado con las publicaciones de nuestros expertos y descubre contenido innovador que te mantendrá al tanto de lo más relevante.
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

          {total !== 0 &&
            <PaginationTemplate
              handlePagination={handlePaginationChange}
              page={page}
              pageSize={pageSize}
              total={total}
            />
          }

          <Box sx={{ my: 4, p: 2 }}>
            {loading ? (
              <Grid container spacing={4}>
                {/* Mostrar skeletons mientras se cargan los datos */}
                {[...Array(5)].map((_, index) => (
                  <Grid item xs={12} md={12} lg={12} key={index}>
                    <Card sx={{
                      display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: { xs: 'auto' }

                      , background: 'none',

                      borderRadius: '16px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      outline: 'none',
                      '&:focus': {
                        outline: 'none',
                      },

                    }}>
                      <Skeleton variant="rectangular" height={200} sx={{ width: { xs: '100%', md: 190 } }} />
                      <CardContent sx={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100%', pl: { sm: 0, md: 10 }, p: { sm: 2 } }}>
                        <Skeleton variant="text" width="20%" sx={{ marginBottom: 1 }} />
                        <Skeleton variant="text" width="80%" sx={{ marginBottom: 1 }} />
                        <Skeleton variant="text" width="60%" sx={{ marginBottom: 1 }} />
                        <Skeleton variant="text" width="90%" sx={{ marginBottom: 2 }} />
                        <Skeleton variant="text" width="40%" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : posts.length === 0 ? (
              <Box sx={{ textAlign: "center", my: 4 }}>
                <NotFound
                  title={`No hay posts disponibles para el año y mes seleccionados.`}
                  subTitle="Intenta utilizar el filtro ubicado encima."
                />
              </Box>
            ) : (
              <Grid container spacing={4}>
                <style>{`.blog-item .react-reveal { height: 100%; } `}</style>
                {posts?.map((post, index) => (
                  <Grid item xs={12} md={12} lg={12} key={index} className="blog-item">
                    {/* Aquí va el código original de los posts */}
                    <Card
                      component="button"
                      onClick={() => navigate(post?.titleURL, { state: { title: post?.title, id: post?.id } })}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                        padding: 0,
                        background: 'none',
                        width: "100%",
                        alignItems: 'stretch',
                        borderRadius: '16px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                        outline: 'none',
                        '&:focus': {
                          outline: 'none',
                        },
                        height: { xs: 'auto' }
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: { xs: '100%', md: 190 },
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          borderRadius: '8px',
                        }}
                        image={post?.imageFile}
                        alt={post?.fullName}
                      />
                      <CardContent sx={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100%', pl: { sm: 0, md: 10 }, p: { sm: 2 } }}>
                        <Typography sx={{ textAlign: 'left', color: '#da3e3e', fontWeight: 700 }}>
                          Revista
                        </Typography>

                        <Typography sx={{ textAlign: 'left', fontSize: 33, fontWeight: 700, mt: -1 }}>
                          {post?.title}
                        </Typography>

                        {post?.day && post?.month && post?.year &&
                          <Typography sx={{ textAlign: "left", fontSize: 15, fontStyle: "italic", fontWeight: 500, color: "gray" }} gutterBottom>
                            {`(Publicado hace ${formatDistanceToNow(
                              new Date(post?.year, post?.month - 1, post?.day),
                              { locale: es }
                            )})`}
                          </Typography>
                        }

                        <Box sx={{ height: 100, overflow: 'hidden', mt: 2 }}>
                          <Typography
                            color="textSecondary"
                            sx={{
                              mt: 1,
                              fontSize: 16,
                              fontWeight: 500,
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 4, // Ajusta el número de líneas visibles antes de cortar el texto
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              wordBreak: 'break-word',  // Para dividir palabras largas si es necesario
                              overflowWrap: 'break-word',  // Para asegurarse de que las palabras se rompan si son demasiado largas
                              textAlign: 'justify'
                            }}
                          >
                            {post?.shortDescription}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {total !== 0 &&
            <PaginationTemplate
              handlePagination={handlePaginationChange}
              page={page}
              pageSize={pageSize}
              total={total}
            />
          }


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
      <FloatingButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} icon="northicon" label="Subir" />

    </Container>
  );
};

export default Blog;
