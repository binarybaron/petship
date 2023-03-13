import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import * as React from "react";
import {useQuery} from "react-query";

export default function HomePage() {
  const {
    isLoading: isUserInfoLoading,
    error: userInfoError,
    data: userInfo,
  } = useQuery('userInfo', () =>
    fetch('/api/userinfo').then((res) => res.json())
  );

  if(isUserInfoLoading || userInfoError) {
    return null;
  }

  return <Container component="main" maxWidth="xs">
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} src={userInfo.profile_picture} />
      <Typography component="h1" variant="h4">
        {userInfo.surname} {userInfo.name}
      </Typography>
      <Box>
        <Button variant="contained">Find your new pet</Button>
        <Button variant="contained">Find a new owner for your pet</Button>
      </Box>
    </Box>
  </Container>

}
