import { Route, Routes } from 'react-router-dom';
import SignUp from './signup';
import SignIn from './signin';
import SetupProfilePage from './setupProfilePage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import HomePage from './homePage';
import PetSetupProfilePage from './petSetupProfilePage';
import FindOwnerFeedPage from './findOwnerFeedPage';
import FindPetFeedPage from './findPetFeedPage';

const queryClient = new QueryClient();
const theme = createTheme();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/setup-profile" element={<SetupProfilePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/pet-setup-profile" element={<PetSetupProfilePage />} />
          <Route path="/find-owner-feed" element={<FindOwnerFeedPage />} />
          <Route path="/find-pet-feed" element={<FindPetFeedPage />} />
        </Routes>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
