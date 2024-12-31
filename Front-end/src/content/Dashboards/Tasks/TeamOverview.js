import {
  Box,
  Grid,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  useTheme,
  LinearProgress,
  styled
} from '@mui/material';
import { formatDistance, subDays, subMinutes, subHours } from 'date-fns';
import Text from 'src/components/Text';

const DotLegend = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
    border: ${theme.colors.alpha.white[100]} solid 2px;
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
        flex-grow: 1;
        height: 10px;
        
        &.MuiLinearProgress-root {
          background-color: ${theme.colors.alpha.black[10]};
        }
        
        .MuiLinearProgress-bar {
          border-radius: ${theme.general.borderRadiusXl};
        }
`
);

function TeamOverview() {
  const theme = useTheme();

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Box>
          <Box display="flex" alignItems="center" pb={3}>
            <Badge
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              overlap="circular"
              badgeContent={
                <Tooltip
                  arrow
                  placement="top"
                  title={
                    'Offline since ' +
                    formatDistance(subDays(new Date(), 14), new Date(), {
                      addSuffix: true
                    })
                  }
                >
                  <DotLegend
                    style={{ background: `${theme.colors.error.main}` }}
                  />
                </Tooltip>
              }
            >
              <AvatarWrapper
                alt=""
                src="/static/images/vehicles/TOYOTA_CAMARO.jpg"
              />
            </Badge>
            <Box
              sx={{
                ml: 1.5
              }}
            >
              <Typography variant="h4" noWrap gutterBottom>
                Toyota Camaro
              </Typography>
              <Typography variant="subtitle2" noWrap>
                Vehicle out of order!
              </Typography>
            </Box>
          </Box>

        
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box>
          <Box display="flex" alignItems="center" pb={3}>
            <Badge
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              overlap="circular"
              badgeContent={
                <Tooltip
                  arrow
                  placement="top"
                  title={
                    'Online since ' +
                    formatDistance(subMinutes(new Date(), 6), new Date(), {
                      addSuffix: true
                    })
                  }
                >
                  <DotLegend
                    style={{ background: `${theme.colors.success.main}` }}
                  />
                </Tooltip>
              }
            >
              <AvatarWrapper
                alt=""
                src="/static/images/vehicles/BMW_M5.jpg"
              />
            </Badge>
            <Box
              sx={{
                ml: 1.5
              }}
            >
              <Typography variant="h4" noWrap gutterBottom>
                BMW M5
              </Typography>
              <Typography variant="subtitle2" noWrap>
                New Vehicle!
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box>
          <Box display="flex" alignItems="center" pb={3}>
            <Badge
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              overlap="circular"
              badgeContent={
                <Tooltip
                  arrow
                  placement="top"
                  title={
                    'Offline since ' +
                    formatDistance(subHours(new Date(), 7), new Date(), {
                      addSuffix: true
                    })
                  }
                >
                  <DotLegend
                    style={{ background: `${theme.colors.error.main}` }}
                  />
                </Tooltip>
              }
            >
              <AvatarWrapper
                alt=""
                src="/static/images/vehicles/PEUGO_S.jpg"
              />
            </Badge>
            <Box
              sx={{
                ml: 1.5
              }}
            >
              <Typography variant="h4" noWrap gutterBottom>
                Peugeot S
              </Typography>
              <Typography variant="subtitle2" noWrap>
                Vehicle out of order!
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default TeamOverview;
