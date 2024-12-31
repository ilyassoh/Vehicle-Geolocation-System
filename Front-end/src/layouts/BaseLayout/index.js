import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const BaseLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        height: '100%'
      }}
    >
      <div style={{ padding: '20px', background: 'lightblue', width: '100%' }}>
        BaseLayout Component is working!
      </div>
      {children}
    </Box>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;
