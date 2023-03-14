import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const {
    isLoading: isUserInfoLoading,
    error: userInfoError,
    data: userInfo,
  } = useQuery('userInfo', () =>
    fetch('/api/userinfo').then((res) => res.json())
  );

  async function logout() {
    await fetch('/api/logout');
    navigate('/signin');
  }

  if (isUserInfoLoading || userInfoError) {
    return null;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{ m: 1, bgcolor: 'secondary.main' }}
          src={userInfo.profile_picture}
        />
        <Typography component="h1" variant="h4">
          {userInfo.surname} {userInfo.name}
        </Typography>
        <Typography component="h1" variant="subtitle1">
          {userInfo.email}
        </Typography>
        <Box
          sx={{
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Button variant="contained">Find your new pet</Button>
          <Button
            variant="contained"
            onClick={() => navigate('/pet-setup-profile')}
          >
            Find a new owner for your pet
          </Button>
          <Button variant="contained" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
