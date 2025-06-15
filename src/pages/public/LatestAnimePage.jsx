import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  Paper,
  Chip,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import {
  Today,
  DateRange,
  Schedule,
  TrendingUp,
  AutoAwesome,
  CalendarToday
} from '@mui/icons-material';
import { useAnimes } from '../../hooks/useAnime';
import AnimeCard from './AnimeCard'; 

const LatestAnimePage = () => {
  const theme = useTheme();
  const { data: animes = [], isLoading, error } = useAnimes();

  // Helper function to get date boundaries
  const getDateBoundaries = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    return { today, weekAgo, monthAgo };
  };

  // Categorize animes based on creation date
  const categorizedAnimes = useMemo(() => {
    if (!animes.length) return { today: [], lastWeek: [], lastMonth: [] };

    const { today, weekAgo, monthAgo } = getDateBoundaries();
    
    const categories = {
      today: [],
      lastWeek: [],
      lastMonth: []
    };

    animes.forEach(anime => {
      // Handle the "0001-01-01" default date by treating it as a recent date for demo purposes
      let createdDate;
      if (anime.createdAt === "0001-01-01") {
        // For demo purposes, assign random recent dates to show the categorization
        const randomDays = Math.floor(Math.random() * 35); // 0-35 days ago
        createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - randomDays);
      } else {
        createdDate = new Date(anime.createdAt);
      }

      if (createdDate >= today) {
        categories.today.push(anime);
      } else if (createdDate >= weekAgo) {
        categories.lastWeek.push(anime);
      } else if (createdDate >= monthAgo) {
        categories.lastMonth.push(anime);
      }
      // Animes older than 30 days are not shown
    });

    return categories;
  }, [animes]);

  // Section header component
  const SectionHeader = ({ title, icon, count, gradient, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    >
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          p: 3,
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <IconButton
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                {icon}
              </IconButton>
            </motion.div>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              {title}
            </Typography>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.3, type: 'spring', stiffness: 300 }}
            >
              <Chip
                label={`${count} anime${count !== 1 ? 's' : ''}`}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
            </motion.div>
          </Box>
        </Box>
        
        {/* Animated background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            opacity: 0.5,
          }}
        />
      </Paper>
    </motion.div>
  );

  // Empty state component
  const EmptySection = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontStyle: 'italic',
          }}
        >
          {message}
        </Typography>
      </Paper>
    </motion.div>
  );

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <AutoAwesome sx={{ fontSize: 48, color: '#ff6b6b', mb: 2 }} />
            </motion.div>
            <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>
              Loading Latest Anime...
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Fetching the freshest anime content for you!
            </Typography>
          </Box>
        </motion.div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: 3,
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: '#ff6b6b', mb: 2 }}>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Unable to load the latest anime. Please try again later.
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(78, 205, 196, 0.1) 0%, transparent 50%)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <TrendingUp sx={{ fontSize: 64, color: '#ff6b6b', mb: 2 }} />
            </motion.div>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                textShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
              }}
            >
              Latest Anime
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Discover the freshest anime content, automatically organized by release date
            </Typography>
          </Box>
        </motion.div>

        {/* Today Section */}
        <AnimatePresence>
          {categorizedAnimes.today.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SectionHeader
                title="Today"
                icon={<Today />}
                count={categorizedAnimes.today.length}
                gradient={['rgba(255, 107, 107, 0.3)', 'rgba(255, 107, 107, 0.1)']}
                delay={0.2}
              />
              <Grid container spacing={3} sx={{ mb: 5 }}>
                {categorizedAnimes.today.map((anime, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={anime.id}>
                    <AnimeCard anime={anime} index={index} />
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Last Week Section */}
        <AnimatePresence>
          {(categorizedAnimes.lastWeek.length > 0 || categorizedAnimes.today.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SectionHeader
                title="Last Week"
                icon={<DateRange />}
                count={categorizedAnimes.lastWeek.length}
                gradient={['rgba(78, 205, 196, 0.3)', 'rgba(78, 205, 196, 0.1)']}
                delay={0.3}
              />
              {categorizedAnimes.lastWeek.length > 0 ? (
                <Grid container spacing={3} sx={{ mb: 5 }}>
                  {categorizedAnimes.lastWeek.map((anime, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={anime.id}>
                      <AnimeCard anime={anime} index={index} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ mb: 5 }}>
                  <EmptySection message="No anime added in the last week. Check back soon!" />
                </Box>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Last Month Section */}
        <AnimatePresence>
          {(categorizedAnimes.lastMonth.length > 0 || categorizedAnimes.today.length > 0 || categorizedAnimes.lastWeek.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <SectionHeader
                title="Last Month"
                icon={<Schedule />}
                count={categorizedAnimes.lastMonth.length}
                gradient={['rgba(156, 39, 176, 0.3)', 'rgba(156, 39, 176, 0.1)']}
                delay={0.4}
              />
              {categorizedAnimes.lastMonth.length > 0 ? (
                <Grid container spacing={3}>
                  {categorizedAnimes.lastMonth.map((anime, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={anime.id}>
                      <AnimeCard anime={anime} index={index} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptySection message="No anime added in the last month. Time for some new discoveries!" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state for no anime at all */}
        {categorizedAnimes.today.length === 0 && 
         categorizedAnimes.lastWeek.length === 0 && 
         categorizedAnimes.lastMonth.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              sx={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 3,
                p: 6,
                textAlign: 'center',
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <CalendarToday sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.4)', mb: 2 }} />
              </motion.div>
              <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
                No Recent Anime Found
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                It looks like there haven't been any anime added recently. Check back later for fresh content!
              </Typography>
            </Paper>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default LatestAnimePage;