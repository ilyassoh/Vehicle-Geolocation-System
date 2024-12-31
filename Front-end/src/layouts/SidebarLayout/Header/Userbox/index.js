import { useRef, useState, useEffect } from 'react';
import { Avatar, Box, Button, Divider, Hidden, lighten, Popover, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import axios from 'axios';
import { useRouter } from 'next/router';

const UserBoxButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

const MenuUserBox = styled(Box)(({ theme }) => ({
  background: theme.colors.alpha.black[5],
  padding: theme.spacing(2),
}));

const UserBoxText = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  paddingLeft: theme.spacing(1),
}));

const UserBoxLabel = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.secondary.main,
  display: 'block',
}));

const UserBoxDescription = styled(Typography)(({ theme }) => ({
  color: lighten(theme.palette.secondary.main, 0.5),
}));

function HeaderUserbox() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8081/api/mycompte', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      router.push('/login');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    };

    checkAuthentication();
    getUserInfo();

    const handlePopState = () => {
      checkAuthentication();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={user?.first_name} src={user?.image} />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">
              {user?.first_name} {user?.last_name}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user?.role}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" alt={user?.first_name} src={user?.image} />
          <UserBoxText>
            <UserBoxLabel variant="body1">
              {user?.first_name} {user?.last_name}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user?.role}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={handleSignOut}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
