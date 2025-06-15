import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Rating,
  Divider,
  Breadcrumbs,
  Link,
  Skeleton,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fab,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  ExpandMore,
  Star,
  Favorite,
  FavoriteBorder,
  Share,
  BookmarkAdd,
  BookmarkAdded,
  AccessTime,
  CalendarToday,
  Visibility,
  MoreVert,
  Download,
  ReportProblem,
  Info,
  KeyboardArrowUp
} from '@mui/icons-material';
import { useAnime } from '../../hooks/useAnime';

// Enhanced Season Accordion Component - FIXED
const SeasonAccordion = ({ season, onEpisodeClick, animeTitle }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Calculate episode count from episodes array
  const episodeCount = season.episodes ? season.episodes.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Accordion 
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{ 
          mb: 2, 
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          '&:before': { display: 'none' },
          boxShadow: theme.shadows[2]
        }}
      >
        <AccordionSummary 
          expandIcon={
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ExpandMore />
            </motion.div>
          }
          sx={{
            bgcolor: 'background.default',
            borderRadius: expanded ? '8px 8px 0 0' : '8px',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
              {/* FIXED: Use season.name instead of season.title */}
              {season.name || `Season ${season.id}`}
            </Typography>
            <Chip
              label={`${episodeCount} episodes`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* FIXED: Check if episodes exist and have length */}
                {season.episodes && season.episodes.length > 0 ? (
                  <Grid container spacing={2}>
                    {season.episodes.map((episode, index) => (
                      <Grid item xs={12} sm={6} md={4} key={episode.id}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            onClick={() => onEpisodeClick(episode.id)}
                            sx={{
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              height: '100%',
                              '&:hover': { 
                                transform: 'translateY(-4px)',
                                boxShadow: theme.shadows[8]
                              }
                            }}
                          >
                            <CardContent>
                              <Box display="flex" alignItems="center" mb={1}>
                                <Avatar
                                  sx={{
                                    bgcolor: 'primary.main',
                                    width: 32,
                                    height: 32,
                                    mr: 1.5
                                  }}
                                >
                                  <PlayArrow fontSize="small" />
                                </Avatar>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  Episode {episode.episodeNumber}
                                </Typography>
                              </Box>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ 
                                  mb: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}
                              >
                                {episode.title || `Episode ${episode.episodeNumber}`}
                              </Typography>
                              {/* FIXED: Since duration is not in API response, make it optional */}
                              {episode.duration && (
                                <Box display="flex" alignItems="center" mt={1}>
                                  <AccessTime fontSize="small" color="action" sx={{ mr: 0.5 }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {episode.duration}
                                  </Typography>
                                </Box>
                              )}
                              {/* ADDED: Show video URL status if available */}
                              <Box display="flex" alignItems="center" mt={1}>
                                <Typography 
                                  variant="caption" 
                                  color={episode.videoUrl ? "success.main" : "text.secondary"}
                                  sx={{ fontWeight: 'bold' }}
                                >
                                  {episode.videoUrl ? "Available" : "Coming Soon"}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    No episodes available for this season yet.
                  </Alert>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </AccordionDetails>
      </Accordion>
    </motion.div>
  );
};

// Loading Skeleton Component
const AnimeDetailsSkeleton = () => (
  <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Grid>
      <Grid item xs={12} md={8}>
        <Skeleton variant="text" height={60} width="80%" />
        <Skeleton variant="text" height={20} width="60%" sx={{ mb: 2 }} />
        <Skeleton variant="text" height={100} />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" width={80} height={32} />
          ))}
        </Box>
      </Grid>
    </Grid>
  </Container>
);

// Main Component - FIXED
const AnimeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // FIXED: Only use one hook since seasons are nested in anime response
  const { data: anime, isLoading: animeLoading, error: animeError } = useAnime(id);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userRating, setUserRating] = useState(0);

  // FIXED: Extract seasons from anime data
  const seasons = anime?.seasons || [];

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEpisodeClick = (episodeId) => {
    navigate(`/watch/${episodeId}`);
  };

  const handleShare = async () => {
    if (navigator.share && anime) {
      try {
        await navigator.share({
          title: anime.title,
          text: anime.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // FIXED: Only check anime loading since we're not using separate seasons hook
  if (animeLoading) {
    return (
      <>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Skeleton variant="text" width={200} height={24} />
          </Toolbar>
        </AppBar>
        <AnimeDetailsSkeleton />
      </>
    );
  }

  if (animeError || !anime) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert 
            severity="error" 
            sx={{ borderRadius: 2 }}
            action={
              <Button color="inherit" onClick={() => navigate('/')}>
                Go Home
              </Button>
            }
          >
            {animeError?.message || 'Anime not found'}
          </Alert>
        </motion.div>
      </Container>
    );
  }

  return (
    <>
      {/* Enhanced App Bar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              edge="start"
              onClick={() => navigate('/')}
              sx={{ 
                mr: 2,
                color: 'text.primary',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ArrowBack />
            </IconButton>
          </motion.div>
          
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <Typography color="text.primary" noWrap>
                {anime.title}
              </Typography>
            </Breadcrumbs>
          </Box>

          <IconButton
            onClick={handleMenuClick}
            sx={{ color: 'text.primary' }}
          >
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleShare}>
          <ListItemIcon><Share /></ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Download /></ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><ReportProblem /></ListItemIcon>
          <ListItemText>Report</ListItemText>
        </MenuItem>
      </Menu>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Grid container spacing={4}>
            {/* Anime Poster */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Box sx={{ position: 'sticky', top: 20 }}>
                  <CardMedia
                    component="img"
                    image={anime.thumbnailUrl}
                    alt={anime.title}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: 600,
                      objectFit: 'cover',
                      borderRadius: 2,
                      boxShadow: theme.shadows[8],
                      backgroundColor: 'background.paper'
                    }}
                  />
                  
                  {/* Action Buttons */}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={() => seasons[0]?.episodes?.[0] && handleEpisodeClick(seasons[0].episodes[0].id)}
                      sx={{ flex: 1, minWidth: 120 }}
                      disabled={!seasons[0]?.episodes?.[0]}
                    >
                      Watch Now
                    </Button>
                    
                    <IconButton
                      onClick={() => setIsFavorite(!isFavorite)}
                      sx={{
                        bgcolor: isFavorite ? 'error.main' : 'background.paper',
                        color: isFavorite ? 'white' : 'text.primary',
                        '&:hover': {
                          bgcolor: isFavorite ? 'error.dark' : 'action.hover'
                        }
                      }}
                    >
                      {isFavorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                    
                    <IconButton
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      sx={{
                        bgcolor: isBookmarked ? 'primary.main' : 'background.paper',
                        color: isBookmarked ? 'white' : 'text.primary',
                        '&:hover': {
                          bgcolor: isBookmarked ? 'primary.dark' : 'action.hover'
                        }
                      }}
                    >
                      {isBookmarked ? <BookmarkAdded /> : <BookmarkAdd />}
                    </IconButton>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Anime Details */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Title and Rating */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant={isMobile ? "h4" : "h3"}
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}
                  >
                    {anime.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={anime.rating || 4.5}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({anime.rating || 4.5})
                      </Typography>
                    </Box>
                    
                    {/* FIXED: Extract year from createdAt if available */}
                    {anime.createdAt && anime.createdAt !== "0001-01-01" && (
                      <Chip
                        icon={<CalendarToday />}
                        label={new Date(anime.createdAt).getFullYear()}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    
                    <Chip
                      label="Available"
                      size="small"
                      color="success"
                      variant="filled"
                    />
                  </Box>
                </Box>

                {/* User Rating Section */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Rate this Anime
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Rating
                      value={userRating}
                      onChange={(event, newValue) => setUserRating(newValue)}
                      size="large"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {userRating ? `You rated: ${userRating}/5` : 'Click to rate'}
                    </Typography>
                  </Box>
                </Box>

                {/* Description */}
                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    mb: 3,
                    textAlign: 'justify'
                  }}
                >
                  {anime.description}
                </Typography>

                {/* Genres */}
                {anime.genre && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Genres
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {anime.genre.split(',').map((genre, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Chip
                            label={genre.trim()}
                            color="primary"
                            variant="outlined"
                            clickable
                            sx={{
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText'
                              }
                            }}
                          />
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Statistics */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                        <Star color="warning" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {anime.rating || '4.5'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Rating
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                        <PlayArrow color="success" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {/* FIXED: Calculate total episodes from seasons */}
                          {seasons.reduce((total, season) => total + (season.episodes?.length || 0), 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Episodes
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Seasons & Episodes */}
                <Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ 
                      mb: 3, 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <PlayArrow color="primary" />
                    Seasons & Episodes
                  </Typography>

                  {seasons.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Alert 
                        severity="info" 
                        sx={{ borderRadius: 2 }}
                        icon={<Info />}
                      >
                        No seasons available for this anime yet. Check back later!
                      </Alert>
                    </motion.div>
                  ) : (
                    <Box>
                      {seasons.map((season, index) => (
                        <motion.div
                          key={season.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <SeasonAccordion
                            season={season}
                            onEpisodeClick={handleEpisodeClick}
                            animeTitle={anime.title}
                          />
                        </motion.div>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Similar Anime Section (Placeholder) */}
                <Box sx={{ mt: 6 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ mb: 3, fontWeight: 'bold' }}
                  >
                    You Might Also Like
                  </Typography>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Similar anime recommendations will be displayed here.
                  </Alert>
                </Box>
              </motion.div>  
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
          >
            <Fab
              color="primary"
              onClick={scrollToTop}
              sx={{
                boxShadow: theme.shadows[8],
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[12]
                }
              }}
            >
              <KeyboardArrowUp />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimeDetailsPage;