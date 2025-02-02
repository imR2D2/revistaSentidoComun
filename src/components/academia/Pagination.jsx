import PropTypes from 'prop-types';

// Material UI
import { Box, Pagination } from '@mui/material';

const PaginationTemplate = (props) => {
  const {
    handlePagination = () => { },
    page = 0,
    pageSize = 2,
    total = 0,
    showFirstButton = false,
    showLastButton = false,
    sx = {},
  } = props;

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', ...sx }}>
      <Pagination
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'black',
            backgroundColor: 'white',
            '&.Mui-selected': {
              backgroundColor: 'rgb(0,96,107)',
              color: 'white',
            },
          },
        }} count={totalPages}
        page={page}
        onChange={(e, value) => handlePagination({ page: value })}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
      />
    </Box>
  );
};

PaginationTemplate.propTypes = {
  handlePagination: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  showFirstButton: PropTypes.bool,
  showLastButton: PropTypes.bool,
  sx: PropTypes.object,
};

export default PaginationTemplate;
