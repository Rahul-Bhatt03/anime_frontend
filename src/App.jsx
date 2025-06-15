import { useState } from 'react'
import "../global.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Your existing pages
import Home from './pages/public/Home';
import AnimeCRUDManager from './pages/Admin/AnimeCrud';
import AuthPage from './pages/Login/Login';
import { queryClient } from './pages/queryClient';

// New anime streaming pages
import AnimeDetailsPage from '../src/pages/public/AnimeDetailsPage';
import VideoPlayerPage from './pages/public/VideoPlayerPage';
import AnimeHomePage from './pages/public/AnimeHomePage';
import LatestAnimePage from './pages/public/LatestAnimePage';

// Material-UI theme configuration
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6b6b',
    },
    secondary: {
      main: '#4ecdc4',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Your existing routes */}
            <Route path="/" element={<Home />} />
            <Route path="/authPage" element={<AuthPage />} />
            <Route path="/anime-crud-page" element={<AnimeCRUDManager />} />
            
            {/* New anime streaming routes */}
            <Route path="/anime-stream" element={<AnimeHomePage />} />
            <Route path="/anime/:id" element={<AnimeDetailsPage />} />
            <Route path="/watch/:episodeId" element={<VideoPlayerPage />} />

            {/* latest anime page  */}
            <Route path="/latest-anime" element={<LatestAnimePage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;