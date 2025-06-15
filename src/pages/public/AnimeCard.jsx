import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Fade
} from '@mui/material';
import { PlayArrow, Favorite, FavoriteBorder, Star } from '@mui/icons-material';

const AnimeCard = ({ anime, index = 0 }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = () => {
    navigate(`/anime/${anime.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.6,
        ease: 'easeOut'
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ height: '100%' }}
    >
      <Card
        onClick={handleClick}
        sx={{
          maxWidth: 280,
          height: '100%',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.12)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            '& .anime-image': {
              transform: 'scale(1.1)',
            },
          },
        }}
      >
        {/* Enhanced Image Container */}
        <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="200"
            image={anime.thumbnailUrl || '/placeholder.jpeg'}
            alt={anime.title}
            className="anime-image"
            onError={(e) => {
              e.target.src = '/placeholder.jpeg';
            }}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'brightness(0.9)',
            }}
          />
          
          {/* Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          
          {/* Animated Play Button */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    sx={{
                      background: 'rgba(255, 107, 107, 0.9)',
                      color: 'white',
                      width: 56,
                      height: 56,
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        background: 'rgba(255, 107, 107, 1)',
                        boxShadow: '0 0 20px rgba(255, 107, 107, 0.6)',
                      },
                    }}
                  >
                    <PlayArrow sx={{ fontSize: 28 }} />
                  </IconButton>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Rating Badge */}
          {anime.rating && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
              }}
            >
              <Chip
                icon={<Star sx={{ color: '#ffd700 !important', fontSize: '16px !important' }} />}
                label={anime.rating}
                size="small"
                sx={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                }}
              />
            </motion.div>
          )}
          
          {/* Favorite Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                onClick={handleFavoriteClick}
                size="small"
                sx={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: isFavorite ? '#ff6b6b' : 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 107, 107, 0.2)',
                    color: '#ff6b6b',
                  },
                }}
              >
                {isFavorite ? <Favorite sx={{ fontSize: 18 }} /> : <FavoriteBorder sx={{ fontSize: 18 }} />}
              </IconButton>
            </motion.div>
          </motion.div>
          
          {/* Shimmer Effect on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '100%', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>
        </Box>

        {/* Enhanced Card Content */}
        <CardContent sx={{ p: 2.5, pb: 2.5 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                mb: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '1.1rem',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                transition: 'color 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }
              }}
            >
              {anime.title}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.5,
                fontSize: '0.875rem',
              }}
            >
              {anime.description || 'Discover the amazing world of this anime series...'}
            </Typography>
          </motion.div>

          {/* Enhanced Genre Tags */}
          {anime.genre && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {anime.genre.split(',').slice(0, 2).map((genre, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Chip
                      label={genre.trim()}
                      size="small"
                      sx={{
                        background: `linear-gradient(45deg, ${
                          index % 2 === 0
                            ? 'rgba(255, 107, 107, 0.2), rgba(255, 107, 107, 0.1)'
                            : 'rgba(78, 205, 196, 0.2), rgba(78, 205, 196, 0.1)'
                        })`,
                        color: index % 2 === 0 ? '#ff6b6b' : '#4ecdc4',
                        border: `1px solid ${index % 2 === 0 ? 'rgba(255, 107, 107, 0.3)' : 'rgba(78, 205, 196, 0.3)'}`,
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        backdropFilter: 'blur(5px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: index % 2 === 0 
                            ? 'rgba(255, 107, 107, 0.3)' 
                            : 'rgba(78, 205, 196, 0.3)',
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 12px ${
                            index % 2 === 0 
                              ? 'rgba(255, 107, 107, 0.3)' 
                              : 'rgba(78, 205, 196, 0.3)'
                          }`,
                        },
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          )}
        </CardContent>

        {/* Hover Glow Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1))',
                pointerEvents: 'none',
                borderRadius: 'inherit',
              }}
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default AnimeCard;