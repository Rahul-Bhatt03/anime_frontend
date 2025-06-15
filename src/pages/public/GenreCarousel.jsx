import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
  Typography
} from '@mui/material';
import { ChevronLeft, ChevronRight, Pause, PlayArrow } from '@mui/icons-material';
import AnimeCard from './AnimeCard';

const GenreCarousel = ({ 
  genre, 
  animes, 
  autoSlide = true, 
  autoSlideInterval = 3000,
  pauseOnHover = true 
}) => {
  const scrollRef = useRef(null);
  const autoSlideRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoSlide);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scroll = useCallback((direction) => {
    const scrollAmount = isMobile ? 250 : 320;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [isMobile]);

  const autoScroll = useCallback(() => {
    if (scrollRef.current && isAutoPlaying) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        scrollRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        scroll('right');
      }
    }
  }, [isAutoPlaying, scroll]);

  const startAutoSlide = useCallback(() => {
    if (autoSlide && animes.length > 0) {
      autoSlideRef.current = setInterval(autoScroll, autoSlideInterval);
    }
  }, [autoSlide, autoSlideInterval, autoScroll, animes.length]);

  const stopAutoSlide = useCallback(() => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  }, []);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoSlide();
    } else {
      stopAutoSlide();
    }

    return () => stopAutoSlide();
  }, [isAutoPlaying, startAutoSlide, stopAutoSlide]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollability);
      checkScrollability();
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollability);
      };
    }
  }, [checkScrollability]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      stopAutoSlide();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && isAutoPlaying) {
      startAutoSlide();
    }
  };

  if (!animes || animes.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Genre Title */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            mb: 3,
            fontWeight: 700,
            color: 'white',
            textTransform: 'capitalize',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
            letterSpacing: '0.5px',
            pl: 2
          }}
        >
          {genre}
        </Typography>
      </motion.div>

      <Box 
        sx={{ 
          mb: 4,
          position: 'relative',
          width: '100%',
          background: '#000000',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Navigation Controls */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end',
            px: 3,
            py: 2,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 10
          }}
        >
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            {autoSlide && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Tooltip title={isAutoPlaying ? 'Pause auto-slide' : 'Resume auto-slide'}>
                  <IconButton
                    onClick={toggleAutoPlay}
                    sx={{
                      mr: 1,
                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: isAutoPlaying ? 'rgba(255, 45, 117, 0.3)' : 'rgba(86, 255, 154, 0.3)',
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 15px ${isAutoPlaying ? 'rgba(255, 45, 117, 0.3)' : 'rgba(86, 255, 154, 0.3)'}`,
                        borderColor: isAutoPlaying ? '#ff2d75' : '#56ff9a'
                      }
                    }}
                  >
                    {isAutoPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                </Tooltip>
              </motion.div>
            )}
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                sx={{
                  mr: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  opacity: canScrollLeft ? 1 : 0.5,
                  '&:hover': canScrollLeft ? { 
                    bgcolor: 'rgba(106, 17, 203, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(106, 17, 203, 0.3)',
                    borderColor: '#6a11cb'
                  } : {},
                  '&:disabled': {
                    color: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                <ChevronLeft fontSize="large" />
              </IconButton>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  opacity: canScrollRight ? 1 : 0.5,
                  '&:hover': canScrollRight ? { 
                    bgcolor: 'rgba(37, 117, 252, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(37, 117, 252, 0.3)',
                    borderColor: '#2575fc'
                  } : {},
                  '&:disabled': {
                    color: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                <ChevronRight fontSize="large" />
              </IconButton>
            </motion.div>
          </motion.div>
        </Box>

        {/* Anime Cards Container */}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            p: 3,
            position: 'relative',
            scrollBehavior: 'smooth',
            background: '#000000',
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 3,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.5)',
              },
            },
          }}
        >
          {animes.map((anime, index) => (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.4,
                ease: 'easeOut'
              }}
              whileInView={{ 
                opacity: 1,
                transition: { duration: 0.3 }
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              viewport={{ once: true, amount: 0.3 }}
              style={{
                minWidth: isMobile ? '260px' : '300px',
                maxWidth: isMobile ? '260px' : '300px',
                transformOrigin: 'center bottom',
                background: '#000000',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden'
              }}
            >
              <AnimeCard anime={anime} index={index} />
            </motion.div>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default GenreCarousel;