import React, { useEffect, useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton,
  Container,
  useTheme,
  alpha,
  useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

// Anime data for carousel
const animeData = [
  {
    id: 1,
    title: "Demon Slayer",
    description: "Follow Tanjiro's quest for revenge and his sister's cure",
    image: "/demonslayer.webp",
    color: "#FF5757",
    mobileFocus: "50% 30%" // Custom background-position for mobile
  },
  {
    id: 2,
    title: "Attack on Titan",
    description: "The last remnants of humanity fight for survival",
    image: "/aot.jpg",
    color: "#4D7EA8",
    mobileFocus: "60% 50%"
  },
  {
    id: 3,
    title: "My Hero Academia",
    description: "In a world of heroes, Deku rises to become the greatest",
    image: "/her.webp",
    color: "#4CAF50",
    mobileFocus: "40% 20%"
  },
  {
    id: 4,
    title: "Jujutsu Kaisen",
    description: "Students battle curses in a world of supernatural forces",
    image: "/Jujutsu_kaisen.jpg",
    color: "#9C27B0",
    mobileFocus: "50% 70%"
  }
];

const AnimeHeroCarousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % animeData.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const navigate = (newDirection) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % animeData.length);
    } else {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? animeData.length - 1 : prevIndex - 1
      );
    }
  };

  const nextSlide = () => navigate(1);
  const prevSlide = () => navigate(-1);

  // Variants for framer motion animations
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };

  // Enhanced 3D effect variants
  const imageVariants = {
    mobile: {
      scale: 1.05,
      rotateY: 0,
      z: 50,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    desktop: {
      scale: 1.05,
      rotateY: '3deg',
      z: 100,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    hover: {
      scale: 1.08,
      rotateY: '5deg',
      z: 150,
      transition: { 
        duration: 0.4,
        type: "spring",
        stiffness: 300 
      }
    }
  };

  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      bgcolor: 'black'
    }}>
      {/* Enhanced Fire Ash Effect */}
      <FireAshEffect />
      
      {/* Hero carousel */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}>
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}
          >
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              {/* Full-screen character image */}
              <Box sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Box 
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${animeData[currentIndex].image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: isMobile 
                      ? animeData[currentIndex].mobileFocus 
                      : 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'contrast(1.1) saturate(1.2)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.2)', // Slight overall darkening
                      zIndex: 1
                    }
                  }}
                />
                
                {/* Left side gradient for text readability */}
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)`,
                  zIndex: 2
                }} />
                
                {/* Bottom gradient */}
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 20%, transparent 50%)`,
                  zIndex: 2
                }} />
                
                {/* 3D Character Effect Overlay */}
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  zIndex: 3,
                  perspective: '1200px'
                }}>
                  <motion.div
                    variants={imageVariants}
                    initial={isMobile ? "mobile" : "desktop"}
                    animate={isMobile ? "mobile" : "desktop"}
                    whileHover={!isMobile ? "hover" : {}}
                    style={{
                      position: 'absolute',
                      width: isMobile ? '90%' : '75%',
                      height: '90%',
                      right: isMobile ? '5%' : 0,
                      transformStyle: 'preserve-3d',
                      transformOrigin: 'center right'
                    }}
                  >
                    {/* 3D Character Shadow */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: '-5%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80%',
                      height: '5%',
                      borderRadius: '50%',
                      background: 'radial-gradient(rgba(0,0,0,0.5), transparent 70%)',
                      filter: 'blur(8px)',
                      opacity: 0.6
                    }} />
                    
                    {/* Character Highlight Effect */}
                    <Box sx={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(circle at 60% 40%, ${alpha(animeData[currentIndex].color, 0.15)}, transparent 70%)`,
                      mixBlendMode: 'screen'
                    }} />
                  </motion.div>
                </Box>
              </Box>
              
              {/* Content overlay */}
              <Container maxWidth="lg" sx={{
                position: 'relative',
                zIndex: 20,
                px: isMobile ? 2 : 3,
                display: 'flex',
                height: '100%',
                alignItems: 'center'
              }}>
                <Box sx={{ 
                  maxWidth: isMobile ? '100%' : '500px',
                  textAlign: isMobile ? 'center' : 'left',
                  ml: isMobile ? 0 : 2,
                  mt: isMobile ? 0 : -10
                }}>
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <Typography 
                      variant={isMobile ? "h3" : "h2"}
                      component="h1"
                      sx={{ 
                        mb: 2, 
                        color: 'common.white',
                        fontWeight: 800,
                        textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6)',
                        fontSize: isMobile ? '2.5rem' : '3.5rem',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {animeData[currentIndex].title}
                    </Typography>
                    <Typography 
                      variant={isMobile ? "body1" : "h6"}
                      sx={{ 
                        mb: 4, 
                        color: 'rgba(255,255,255,0.95)',
                        textShadow: '0 2px 5px rgba(0,0,0,0.8)',
                        fontSize: isMobile ? '1.1rem' : '1.35rem',
                        fontWeight: 400,
                        lineHeight: 1.4
                      }}
                    >
                      {animeData[currentIndex].description}
                    </Typography>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ display: 'inline-block' }}
                    >
                      <Button
                        variant="contained"
                        size={isMobile ? "medium" : "large"}
                        sx={{
                          px: isMobile ? 3 : 4,
                          py: isMobile ? 1 : 1.5,
                          borderRadius: '50px',
                          color: 'common.white',
                          fontWeight: 700,
                          fontSize: isMobile ? '1rem' : '1.1rem',
                          backgroundColor: animeData[currentIndex].color,
                          boxShadow: `0 4px 20px ${alpha(animeData[currentIndex].color, 0.7)}, 0 0 30px ${alpha(animeData[currentIndex].color, 0.5)}`,
                          '&:hover': {
                            backgroundColor: animeData[currentIndex].color,
                            filter: 'brightness(1.1)'
                          }
                        }}
                      >
                        Watch Now
                      </Button>
                    </motion.div>
                  </motion.div>
                </Box>
              </Container>
            </Box>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation arrows */}
        {!isMobile && (
          <>
            <IconButton 
              onClick={prevSlide}
              sx={{
                position: 'absolute',
                left: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 30,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)'
                }
              }}
            >
              <ArrowBackIos />
            </IconButton>
            <IconButton 
              onClick={nextSlide}
              sx={{
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 30,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)'
                }
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          </>
        )}
        
        {/* Navigation dots */}
        <Box sx={{
          position: 'absolute',
          bottom: isMobile ? 20 : 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: isMobile ? 1 : 1.5,
          zIndex: 30
        }}>
          {animeData.map((_, index) => (
            <IconButton
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              sx={{
                p: 0,
                width: isMobile ? 10 : 12,
                height: isMobile ? 10 : 12,
                minWidth: 0,
                '&:hover': {
                  transform: 'scale(1.3)'
                }
              }}
            >
              <Box sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                bgcolor: index === currentIndex 
                  ? animeData[currentIndex].color 
                  : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s',
                transform: index === currentIndex ? 'scale(1.3)' : 'scale(1)',
                boxShadow: index === currentIndex 
                  ? `0 0 10px ${alpha(animeData[currentIndex].color, 0.7)}` 
                  : 'none'
              }} />
            </IconButton>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// Enhanced Fire Ash Effect Component
const FireAshEffect = () => {
  // Generate particles with memoization to avoid recreation on re-renders
  const particles = useMemo(() => {
    const particleCount = 120; // Increased particle count
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Vary particle types - ash, ember, smoke
      const particleType = Math.random();
      let size, color, blur, duration, delay, opacity;
      let emberGlow = ''; // Initialize ember glow value
      let emberGValue = 0; // Initialize g value for embers
      
      if (particleType < 0.6) { // Ash particles
        size = Math.random() * 5 + 1;
        const grayValue = Math.floor(Math.random() * 80) + 150;
        color = `rgba(${grayValue}, ${grayValue}, ${grayValue}, 0.7)`;
        blur = Math.random() * 2 + 0.5;
        duration = Math.random() * 8 + 10;
        delay = Math.random() * 15;
        opacity = Math.random() * 0.5 + 0.2;
      } 
      else if (particleType < 0.85) { // Ember particles
        size = Math.random() * 3 + 1;
        const r = 255;
        emberGValue = Math.floor(Math.random() * 100) + 50;
        const b = Math.floor(Math.random() * 50);
        color = `rgba(${r}, ${emberGValue}, ${b}, 0.9)`;
        blur = Math.random() * 3 + 1;
        duration = Math.random() * 6 + 4;
        delay = Math.random() * 10;
        opacity = Math.random() * 0.6 + 0.4;
        emberGlow = `0 0 ${size * 2}px rgba(255,${emberGValue},0,0.8)`;
      }
      else { // Smoke particles
        size = Math.random() * 15 + 10;
        const smokeValue = Math.floor(Math.random() * 30) + 20;
        color = `rgba(${smokeValue}, ${smokeValue}, ${smokeValue}, 0.2)`;
        blur = Math.random() * 6 + 3;
        duration = Math.random() * 12 + 15;
        delay = Math.random() * 20;
        opacity = Math.random() * 0.2 + 0.05;
      }
      
      const xPos = Math.random() * 120 - 10; // Some particles off-screen
      const yStart = -10 - Math.random() * 20;
      const rotate = Math.random() * 360;
      const xSwing = (Math.random() - 0.5) * 200; // More dramatic x movement
      
      // Create particle motion path - more complex for realism
      const yPath = [
        `${yStart}%`, 
        `${20 + Math.random() * 20}%`, 
        `${60 + Math.random() * 20}%`, 
        '120%'
      ];
      
      const opacityPath = [0, opacity, opacity * 0.8, 0];
      
      particles.push(
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            borderRadius: particleType < 0.85 ? '50%' : `${Math.random() * 40 + 30}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            filter: `blur(${blur}px)`,
            boxShadow: particleType >= 0.6 && particleType < 0.85 ? emberGlow : 'none',
            x: `${xPos}%`,
            y: `${yStart}%`,
            rotate: rotate,
            zIndex: 1
          }}
          animate={{
            y: yPath,
            opacity: opacityPath,
            x: [
              `${xPos}%`,
              `calc(${xPos}% + ${xSwing * 0.3}px)`,
              `calc(${xPos}% + ${xSwing * 0.7}px)`,
              `calc(${xPos}% + ${xSwing}px)`
            ],
            rotate: rotate + Math.random() * 720 - 360
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut",
            times: [0, 0.3, 0.7, 1]
          }}
        />
      );
    }
    
    return particles;
  }, []);

  return (
    <Box sx={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 5
    }}>
      {particles}
      
      {/* Additional glow effect for fire ambiance */}
      <Box sx={{
        position: 'absolute',
        bottom: '-10%',
        left: 0,
        width: '100%',
        height: '30%',
        background: 'radial-gradient(ellipse at center, rgba(255,50,0,0.1) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)',
        opacity: 0.8,
        mixBlendMode: 'screen'
      }} />
    </Box>
  );
};

export default AnimeHeroCarousel;