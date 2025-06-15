import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  Tooltip,
  Button,
  Slider,
  Stack
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  SkipNext,
  SkipPrevious,
  Settings,
  ClosedCaption,
  PictureInPicture
} from '@mui/icons-material';
import { useEpisode } from '../../hooks/useEpisodes';
import { useEpisodes } from '../../hooks/useEpisodes';
import { useAnime } from '../../hooks/useAnime';

const VideoPlayerPage = () => {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Video player refs and state
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Data fetching
  const { data: episode, isLoading: episodeLoading, error: episodeError } = useEpisode(episodeId);
  const { data: episodes = [], isLoading: episodesLoading } = useEpisodes(episode?.seasonId);
  const { data: anime } = useAnime(episode?.animeId);
  
  // Get current episode index and navigation data
  const currentEpisodeIndex = episodes.findIndex(ep => ep.id === parseInt(episodeId));
  const nextEpisode = episodes[currentEpisodeIndex + 1];
  const previousEpisode = episodes[currentEpisodeIndex - 1];

  // Video event handlers
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setLoading(false);
    }
  };

  const handleSeek = (event, newValue) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleVolumeChange = (event, newValue) => {
    if (videoRef.current) {
      videoRef.current.volume = newValue;
      setVolume(newValue);
      setIsMuted(newValue === 0);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleEpisodeChange = (newEpisodeId) => {
    navigate(`/watch/${newEpisodeId}`);
  };

  const handleNextEpisode = () => {
    if (nextEpisode) {
      handleEpisodeChange(nextEpisode.id);
    }
  };

  const handlePreviousEpisode = () => {
    if (previousEpisode) {
      handleEpisodeChange(previousEpisode.id);
    }
  };

  // Controls visibility
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  };

  // Format time helper
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          if (videoRef.current) {
            videoRef.current.currentTime -= 10;
          }
          break;
        case 'ArrowRight':
          if (videoRef.current) {
            videoRef.current.currentTime += 10;
          }
          break;
        case 'KeyF':
          handleFullscreen();
          break;
        case 'KeyM':
          handleMute();
          break;
        default: break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  if (episodeLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (episodeError || !episode) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
        >
          Episode not found or failed to load
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => navigate(-1)}
            sx={{ mr: 2, color: 'white' }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {anime?.title} - Episode {episode.episodeNumber}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Video Player */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                ref={containerRef}
                sx={{
                  position: 'relative',
                  backgroundColor: '#000',
                  borderRadius: 2,
                  overflow: 'hidden',
                  aspectRatio: '16/9',
                  cursor: showControls ? 'default' : 'none'
                }}
                onMouseMove={showControlsTemporarily}
                onMouseLeave={() => isPlaying && setShowControls(false)}
              >
                {/* Video Element */}
                <video
                  ref={videoRef}
                  src={episode.videoUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onWaiting={() => setLoading(true)}
                  onCanPlay={() => setLoading(false)}
                  onClick={handlePlayPause}
                />

                {/* Loading Spinner */}
                {loading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10
                    }}
                  >
                    <CircularProgress size={60} sx={{ color: 'white' }} />
                  </Box>
                )}

                {/* Video Controls */}
                <AnimatePresence>
                  {showControls && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        padding: '20px 16px 16px',
                        zIndex: 10
                      }}
                    >
                      {/* Progress Bar */}
                      <Slider
                        value={currentTime}
                        max={duration}
                        onChange={handleSeek}
                        sx={{
                          mb: 2,
                          color: theme.palette.primary.main,
                          '& .MuiSlider-thumb': {
                            width: 16,
                            height: 16,
                            '&:hover': { boxShadow: '0px 0px 0px 8px rgba(25, 118, 210, 0.16)' }
                          }
                        }}
                      />

                      {/* Control Buttons */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton onClick={handlePlayPause} sx={{ color: 'white' }}>
                          {isPlaying ? <Pause /> : <PlayArrow />}
                        </IconButton>

                        <IconButton 
                          onClick={handlePreviousEpisode}
                          disabled={!previousEpisode}
                          sx={{ color: 'white' }}
                        >
                          <SkipPrevious />
                        </IconButton>

                        <IconButton 
                          onClick={handleNextEpisode}
                          disabled={!nextEpisode}
                          sx={{ color: 'white' }}
                        >
                          <SkipNext />
                        </IconButton>

                        <IconButton onClick={handleMute} sx={{ color: 'white' }}>
                          {isMuted ? <VolumeOff /> : <VolumeUp />}
                        </IconButton>

                        <Slider
                          value={isMuted ? 0 : volume}
                          max={1}
                          step={0.1}
                          onChange={handleVolumeChange}
                          sx={{
                            width: 100,
                            color: 'white',
                            '& .MuiSlider-thumb': { width: 12, height: 12 }
                          }}
                        />

                        <Typography variant="caption" sx={{ color: 'white', mx: 2 }}>
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />

                        <IconButton sx={{ color: 'white' }}>
                          <Settings />
                        </IconButton>

                        <IconButton sx={{ color: 'white' }}>
                          <ClosedCaption />
                        </IconButton>

                        <IconButton onClick={handleFullscreen} sx={{ color: 'white' }}>
                          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                        </IconButton>
                      </Stack>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Paper>

              {/* Episode Info */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {episode.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {episode.description}
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          {/* Episodes List */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Episodes
              </Typography>
              
              <Box sx={{ maxHeight: isMobile ? 300 : 600, overflowY: 'auto' }}>
                <Grid container spacing={1}>
                  {episodes.map((ep, index) => (
                    <Grid item xs={6} sm={4} lg={6} key={ep.id}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          onClick={() => handleEpisodeChange(ep.id)}
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: ep.id === parseInt(episodeId) 
                              ? theme.palette.primary.main 
                              : 'background.paper',
                            color: ep.id === parseInt(episodeId) 
                              ? 'white' 
                              : 'text.primary',
                            '&:hover': {
                              backgroundColor: ep.id === parseInt(episodeId)
                                ? theme.palette.primary.dark
                                : theme.palette.action.hover
                            },
                            minHeight: 80
                          }}
                        >
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box display="flex" alignItems="center" mb={0.5}>
                              <Avatar
                                sx={{
                                  bgcolor: ep.id === parseInt(episodeId) 
                                    ? 'rgba(255,255,255,0.2)' 
                                    : 'primary.main',
                                  width: 24,
                                  height: 24,
                                  mr: 1,
                                  fontSize: '0.75rem'
                                }}
                              >
                                {ep.episodeNumber}
                              </Avatar>
                              {ep.id === parseInt(episodeId) && (
                                <Chip 
                                  label="Now Playing" 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    height: 20
                                  }} 
                                />
                              )}
                            </Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: '0.8rem',
                                lineHeight: 1.2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {ep.title}
                            </Typography>
                            {ep.duration && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  opacity: 0.8,
                                  fontSize: '0.7rem'
                                }}
                              >
                                {ep.duration}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default VideoPlayerPage;