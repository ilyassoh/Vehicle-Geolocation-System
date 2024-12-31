import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  Grid,
  Box,
  FormControl,
  CardActions,
  Typography,
  Avatar,
  Divider,
  Rating,
  OutlinedInput,
  Chip,
  Tooltip,
  AvatarGroup,
  Pagination,
  InputAdornment,
  Menu,
  MenuItem,
  styled,
  useTheme
} from '@mui/material';

import { formatDistance, subMonths, subDays } from 'date-fns';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';

import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import Text from 'src/components/Text';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    padding-right: ${theme.spacing(0.7)}
`
);

function VehicleSearch() {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/vehicule?search=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Vehicle not found');
      }
      const data = await response.json();
      setVehicles(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setVehicles([]);
    }
  };

  const handleDelete = () => {};

  const handleClick = () => {};

  const periods = [
    {
      value: 'popular',
      text: 'Most popular'
    },
    {
      value: 'recent',
      text: 'Recent tasks'
    },
    {
      value: 'updated',
      text: 'Latest updated tasks'
    },
    {
      value: 'oldest',
      text: 'Oldest tasks first'
    }
  ];

  const actionRef1 = useRef(null);
  const [openPeriod, setOpenMenuPeriod] = useState(false);
  const [period, setPeriod] = useState(periods[0].text);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderVehicleCard = (vehicle) => (
    <Grid item xs={12} md={4} key={vehicle.matricule}>
      <Card
        variant="outlined"
        sx={{
          p: 3,
          background: theme.colors.alpha.black[5]
        }}
      >
        <Box>
          <Avatar
            sx={{
              mx: 'auto',
              mb: 1.5,
              width: theme.spacing(12),
              height: theme.spacing(12)
            }}
            variant="rounded"
            alt={vehicle.nom}
            src={vehicle.imageUrl || '/static/images/vehicles/default.jpg'}
          />
          <Typography align="center" variant="h4" gutterBottom>
            {vehicle.nom}
          </Typography>
          <Typography align="center" variant="subtitle2" gutterBottom>
            Vehicle added recently
          </Typography>
          <Typography align="center" variant="subtitle2" gutterBottom>
            Matricule: {vehicle.matricule}
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Rating value={vehicle.rating || 4} precision={0.5} readOnly />
            <Typography variant="h5" sx={{ pl: 0.5 }}>
              {vehicle.rating || 4.1}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ py: 2 }}>
          <Chip
            sx={{ mr: 0.5 }}
            size="small"
            label="Website"
            color="secondary"
            onClick={handleClick}
            onDelete={handleDelete}
          />
          <Chip
            sx={{ mr: 0.5 }}
            size="small"
            label="Integrations"
            color="secondary"
            onClick={handleClick}
            onDelete={handleDelete}
          />
        </Box>
        <Typography sx={{ pb: 2 }} color="text.secondary">
          {/* Add more vehicle details here if needed */}
        </Typography>
        <Link href="/trajet" passHref>
          <Button size="small" variant="contained" component="a">
            View Trajet
          </Button>
        </Link>
        <Divider sx={{ my: 2 }} />
        <CardActions
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography display="flex" alignItems="center" variant="subtitle2">
            <TodayTwoToneIcon sx={{ mr: 1 }} />
            {formatDistance(subDays(new Date(), 24), new Date(), {
              addSuffix: true
            })}
          </Typography>
          <AvatarGroup>
            {/* Add avatars if needed */}
          </AvatarGroup>
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <>
      <FormControl variant="outlined" fullWidth>
        <OutlinedInput
          type="text"
          placeholder="Enter vehicle matricule..."
          value={searchTerm}
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
              <Button variant="contained" size="small" onClick={handleSearch}>
                Search
              </Button>
            </InputAdornment>
          }
          startAdornment={
            <InputAdornment position="start">
              <SearchTwoToneIcon />
            </InputAdornment>
          }
        />
      </FormControl>

      {vehicles.length > 0 && (
        <Box py={3}>
          <Grid container spacing={3}>
            {vehicles.map(renderVehicleCard)}
          </Grid>
        </Box>
      )}

      {error && <p>{error}</p>}

      <Box py={3} display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle2">
            Showing{' '}
            <Text color="black">
              <b>vehicles</b>
            </Text>
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle2" sx={{ pr: 1 }}>
            Sort by:
          </Typography>
          <Button
            size="small"
            variant="outlined"
            ref={actionRef1}
            onClick={() => setOpenMenuPeriod(true)}
            endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
          >
            {period}
          </Button>
          <Menu
            disableScrollLock
            anchorEl={actionRef1.current}
            onClose={() => setOpenMenuPeriod(false)}
            open={openPeriod}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            {periods.map((_period) => (
              <MenuItem
                key={_period.value}
                onClick={() => {
                  setPeriod(_period.text);
                  setOpenMenuPeriod(false);
                }}
              >
                {_period.text}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {vehicles.length === 0 && (
          <>
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  background: theme.colors.alpha.black[5]
                }}
              >
                <Box>
                  <Avatar
                    sx={{
                      mx: 'auto',
                      mb: 1.5,
                      width: theme.spacing(12),
                      height: theme.spacing(12)
                    }}
                    variant="rounded"
                    alt=""
                    src="/static/images/vehicles/BMW_M5.jpg"
                  />
                  <Typography align="center" variant="h4" gutterBottom>
                    BMW M5
                  </Typography>
                  <Typography align="center" variant="subtitle2" gutterBottom>
                    Vehicle added recently
                  </Typography>
                  <Typography align="center" variant="subtitle2" gutterBottom>
                    Matricule: HH234HH
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Rating value={4} precision={0.5} readOnly />
                    <Typography variant="h5" sx={{ pl: 0.5 }}>
                      4.1
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ py: 2 }}>
                  <Chip
                    sx={{ mr: 0.5 }}
                    size="small"
                    label="Website"
                    color="secondary"
                    onClick={handleClick}
                    onDelete={handleDelete}
                  />
                  <Chip
                    sx={{ mr: 0.5 }}
                    size="small"
                    label="Integrations"
                    color="secondary"
                    onClick={handleClick}
                    onDelete={handleDelete}
                  />
                </Box>
                <Typography sx={{ pb: 2 }} color="text.secondary">
                  {/* Add more vehicle details here if needed */}
                </Typography>
                <Link href="/trajet" passHref>
                  <Button size="small" variant="contained" component="a">
                    View Trajet
                  </Button>
                </Link>
                <Divider sx={{ my: 2 }} />
                <CardActions
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography display="flex" alignItems="center" variant="subtitle2">
                    <TodayTwoToneIcon sx={{ mr: 1 }} />
                    {formatDistance(subDays(new Date(), 24), new Date(), {
                      addSuffix: true
                    })}
                  </Typography>
                  <AvatarGroup>
                    {/* Add avatars if needed */}
                  </AvatarGroup>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  background: theme.colors.alpha.black[5]
                }}
              >
                <Box>
                  <Avatar
                    sx={{
                      mx: 'auto',
                      mb: 1.5,
                      width: theme.spacing(12),
                      height: theme.spacing(12)
                    }}
                    variant="rounded"
                    alt=""
                    src="/static/images/vehicles/TOYOTA_CAMARO.jpg"
                  />
                  <Typography align="center" variant="h4" gutterBottom>
                    TOYOTA CAMARO
                  </Typography>
                  <Typography align="center" variant="subtitle2" gutterBottom>
                    Vehicle added recently
                  </Typography>
                  <Typography align="center" variant="subtitle2" gutterBottom>
                    Matricule: DD012DD
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Rating value={4} precision={0.5} readOnly />
                    <Typography variant="h5" sx={{ pl: 0.5 }}>
                      4.1
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ py: 2 }}>
                  <Chip
                    sx={{ mr: 0.5 }}
                    size="small"
                    label="Website"
                    color="secondary"
                    onClick={handleClick}
                    onDelete={handleDelete}
                  />
                  <Chip
                    sx={{ mr: 0.5 }}
                    size="small"
                    label="Integrations"
                    color="secondary"
                    onClick={handleClick}
                    onDelete={handleDelete}
                  />
                </Box>
                <Typography sx={{ pb: 2 }} color="text.secondary">
                  {/* Add more vehicle details here if needed */}
                </Typography>
                <Link href="/trajet" passHref>
                  <Button size="small" variant="contained" component="a">
                    View Trajet
                  </Button>
                </Link>
                <Divider sx={{ my: 2 }} />
                <CardActions
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography display="flex" alignItems="center" variant="subtitle2">
                    <TodayTwoToneIcon sx={{ mr: 1 }} />
                    {formatDistance(subMonths(new Date(), 2), new Date(), {
                      addSuffix: true
                    })}
                  </Typography>
                  <AvatarGroup>
                    {/* Add avatars if needed */}
                  </AvatarGroup>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  background: theme.colors.alpha.black[5]
                }}
              >
                <Box>
                  <Avatar
                    sx={{
                      mx: 'auto',
                      mb: 1.5,
                      width: theme.spacing(12),
                      height: theme.spacing(12)
                    }}
                    variant="rounded"
                    alt=""
                    src="/static/images/vehicles/PEUGO_S.jpg"
                  />
                  <Typography align="center" variant="h4" gutterBottom>
                    PEUGEOT S
                  </Typography>
                  <Typography align="center" variant="subtitle2" gutterBottom>
                    Vehicle added recently
                  </Typography>
                  <Typography align="center" variant="subtitle2" gutterBottom>
                    Matricule: EE345EE
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Rating value={4} precision={0.5} readOnly />
                    <Typography variant="h5" sx={{ pl: 0.5 }}>
                      4.1
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ py: 2 }}>
                  <Chip
                    sx={{ mr: 0.5 }}
                    size="small"
                    label="Website"
                    color="secondary"
                    onClick={handleClick}
                    onDelete={handleDelete}
                  />
                  <Chip
                    sx={{ mr: 0.5 }}
                    size="small"
                    label="Integrations"
                    color="secondary"
                    onClick={handleClick}
                    onDelete={handleDelete}
                  />
                </Box>
                <Typography sx={{ pb: 2 }} color="text.secondary">
                  {/* Add more vehicle details here if needed */}
                </Typography>
                <Link href="/trajet" passHref>
                  <Button size="small" variant="contained" component="a">
                    View Trajet
                  </Button>
                </Link>
                <Divider sx={{ my: 2 }} />
                <CardActions
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography display="flex" alignItems="center" variant="subtitle2">
                    <TodayTwoToneIcon sx={{ mr: 1 }} />
                    {formatDistance(subDays(new Date(), 31), new Date(), {
                      addSuffix: true
                    })}
                  </Typography>
                  <AvatarGroup>
                    {/* Add avatars if needed */}
                  </AvatarGroup>
                </CardActions>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      <Box sx={{ pt: 4 }} display="flex" alignItems="center" justifyContent="center">
        <Pagination
          showFirstButton
          showLastButton
          count={15}
          defaultPage={6}
          siblingCount={0}
          size="large"
          shape="rounded"
          color="primary"
        />
      </Box>
    </>
  );
}

export default VehicleSearch;
