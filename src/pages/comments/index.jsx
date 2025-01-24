import { Fade } from "@successtar/react-reveal";

// Material UI
import { Container, Grid, Box, Avatar, Typography, CardContent } from "@mui/material";
import { FormatQuote } from "@mui/icons-material";

// Data
import comments from "@data/constants/comments";

const Comments = () => {
  const style = { fontSize: "40px", position: "absolute", color: "#999" };

  return (
    <Container id="Comments" component="section" maxWidth="xl" sx={{ px: { xs: "20px" }, py: 4 }}>
      <style>{`.blog-item .react-reveal { height: 100%; } `}</style>
      <Grid container spacing={2} justifyContent="center">
        {comments.map((comment, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index} className="blog-item">
            <Fade delay={400 + index * 250}>
              <Box
                sx={{
                  height: "100%",
                  userSelect: "none",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { transform: "translateY(-10px)" },
                  "&:hover .comment-text": { transform: "scale(1.08)" },
                  "&:hover .comment-quote": { fontSize: "45px" },
                }}
              >
                <CardContent>
                  <Typography
                    className="comment-text"
                    variant="body2"
                    sx={{
                      transition: "transform 0.3s ease",
                      mb: "10px",
                      py: 1.5,
                      px: 3,
                      color: "#555",
                      fontSize: 15,
                      position: "relative",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      textAlign: "justify",
                    }}
                  >
                    <FormatQuote
                      className="comment-quote"
                      sx={{ ...style, left: "-15px", top: "-20px", transition: "font-size 0.3s ease" }}
                    />
                    {comment.comment}
                    <FormatQuote
                      className="comment-quote"
                      sx={{
                        ...style,
                        right: "-15px",
                        bottom: "-20px",
                        transform: "rotate(180deg)",
                        transition: "font-size 0.3s ease",
                      }}
                    />
                  </Typography>

                  <Grid container alignItems="center" spacing={2} wrap="nowrap">
                    <Grid item>
                      <Avatar
                        alt={comment.name}
                        src={comment.image}
                        sx={{ width: 40, height: 40, border: "2px solid", borderColor: "primary.main" }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" color="primary" sx={{ fontSize: 12, lineHeight: 0, my: 1.2 }}>
                        {comment.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        sx={{ fontSize: 14, lineHeight: 1 }}
                      >
                        {comment.job} en {comment.company}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Box>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Comments;
