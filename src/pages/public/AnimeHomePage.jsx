import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useAnimes } from '../../hooks/useAnime';
import GenreCarousel from './GenreCarousel';

// Pure Black Background Component
const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: -1,
        background: '#000000',
      }}
    />
  );
};

// Enhanced Loading Component
const LoadingComponent = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        flexDirection: 'column',
        padding: '20px',
      }}
    >
      <motion.div       
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <CircularProgress size={isMobile ? 40 : 60} sx={{ color: '#ff6b6b' }} />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Typography
          variant={isMobile ? "body1" : "h6"}
          sx={{
            mt: 2,
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            px: 2,
          }}
        >
          Loading Amazing Anime...
        </Typography>
      </motion.div>
    </motion.div>
  );
};

// Enhanced AppBar
const EnhancedAppBar = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <AppBar
        position="static"
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          background: '#000000',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <motion.div
            whileHover={{ scale: isMobile ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="div"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%',
                animation: 'gradient 3s ease infinite',
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                '@keyframes gradient': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' },
                },
              }}
            >
              🎌 AnimeWorld
            </Typography>
          </motion.div>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

// Enhanced Title Component
const EnhancedTitle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
    >
      <Typography
        variant={isMobile ? "h4" : isTablet ? "h3" : "h2"}
        component="h1"
        gutterBottom
        sx={{
          mb: { xs: 3, sm: 4, md: 6 },
          textAlign: 'center',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f093fb)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          fontSize: { 
            xs: '1.75rem', 
            sm: '2.5rem', 
            md: '3rem',
            lg: '3.5rem'
          },
          textShadow: '0 0 30px rgba(255, 107, 107, 0.5)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 4s ease infinite',
          px: { xs: 1, sm: 2 },
          lineHeight: { xs: 1.2, sm: 1.3 },
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        ✨ Discover Amazing Anime ✨
      </Typography>
    </motion.div>
  );
};

// Enhanced Genre Section - No genre titles
const EnhancedGenreSection = ({ animesByGenre }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      {Object.entries(animesByGenre).map(([genre, genreAnimes], index) => (
        <motion.div
          key={genre}
          initial={{ 
            opacity: 0 
          }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.1 * index,
            duration: 0.6,
          }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <GenreCarousel genre={genre} animes={genreAnimes} />
        </motion.div>
      ))}
    </motion.div>
  );
};

// Main Component - Full screen width
const   AnimeHomePage = () => {
  const { data: animes = [], isLoading, error } = useAnimes();
  const theme = useTheme();

  // Group animes by genres
  const animesByGenre = useMemo(() => {
    const genreMap = {};
    animes.forEach((anime) => {
      if (anime.genre) {
        const genres = anime.genre.split(',').map((g) => g.trim());
        genres.forEach((genre) => {
          if (!genreMap[genre]) {
            genreMap[genre] = [];
          }
          genreMap[genre].push(anime);
        });
      } else {
        if (!genreMap['Other']) {
          genreMap['Other'] = [];
        }
        genreMap['Other'].push(anime);
      }
    });
    return genreMap;
  }, [animes]);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        background: '#000000',
        overflowX: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      <AnimatedBackground />
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingComponent key="loading" />
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Container maxWidth={false} sx={{ mt: 4, px: { xs: 2, sm: 3 }, width: '100%' }}>
              <Alert
                severity="error"
                sx={{
                  background: 'rgba(211, 47, 47, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(211, 47, 47, 0.3)',
                  color: 'white',
                  '& .MuiAlert-icon': { color: '#ff6b6b' },
                }}
              >
                {error.message}
              </Alert>
            </Container>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EnhancedAppBar />
            
            <Container 
              maxWidth={false}
              disableGutters
              sx={{ 
                pb: { xs: 2, sm: 3, md: 4 }, 
                position: 'relative', 
                zIndex: 1,
                px: { xs: 2, sm: 3, md: 4 },
                width: '100vw',
                background: '#000000',
              }}
            >
              <EnhancedTitle />
              <EnhancedGenreSection animesByGenre={animesByGenre} />
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default AnimeHomePage;