import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccountInfo } from './hooks';
import MatchesTable from "./matchesTable";

export default function HomePage() {
  const navigate = useNavigate();

  const { isUserInfoLoading, userInfo } = useAccountInfo();

  async function logout() {
    await fetch('/api/logout');
    navigate('/signin');
  }

  if (isUserInfoLoading || userInfo === null) {
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
          <Button
            variant="contained"
            onClick={() => navigate('/find-pet-feed')}
          >
            Find your new pet
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              navigate(userInfo.pet ? '/find-owner-feed' : '/pet-setup-profile')
            }
          >
            {userInfo.pet
              ? 'Find a new owner for your pet'
              : 'Create a profile for your pet'}
          </Button>
          <Button variant="contained" color="error" onClick={logout}>
            Logout
          </Button>
          <MatchesTable />
        </Box>
      </Box>
    </Container>
  );
}
