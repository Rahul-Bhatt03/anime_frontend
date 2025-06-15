import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Groups,
  Reddit,
  Telegram,
  GitHub,
  ArrowUpward,
  SportsEsports,
  LocalFireDepartment,
  NewReleases,
  TrendingUp,
  ListAlt,
  ContactSupport,
  PrivacyTip
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  };

  const socialLinks = [
    { icon: <Facebook />, name: 'Facebook', url: '#' },
    { icon: <Twitter />, name: 'Twitter', url: '#' },
    { icon: <Instagram />, name: 'Instagram', url: '#' },
    { icon: <YouTube />, name: 'YouTube', url: '#' },
    { icon: <Groups />, name: 'Community', url: '#' },
    { icon: <Reddit />, name: 'Reddit', url: '#' },
    { icon: <Telegram />, name: 'Telegram', url: '#' },
    { icon: <GitHub />, name: 'GitHub', url: '#' }
  ];

  const quickLinks = [
    { icon: <LocalFireDepartment />, text: 'Popular Anime', url: '#' },
    { icon: <NewReleases />, text: 'New Releases', url: '#' },
    { icon: <TrendingUp />, text: 'Trending Now', url: '#' },
    { icon: <SportsEsports />, text: 'Anime Games', url: '#' },
    { icon: <ListAlt />, text: 'Categories', url: '#' }
  ];

  const infoLinks = [
    { icon: <ContactSupport />, text: 'Contact Us', url: '#' },
    { icon: <PrivacyTip />, text: 'Privacy Policy', url: '#' },
    { text: 'Terms of Service', url: '#' },
    { text: 'DMCA', url: '#' },
    { text: 'FAQ', url: '#' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        pt: 6,
        pb: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <Grid container spacing={4}>
            {/* Logo and Social Links */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block'
                    }}
                  >
                    🎌 Anime World
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Your ultimate destination for anime streaming, news, and community.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton
                        href={social.url}
                        target="_blank"
                        rel="noopener"
                        aria-label={social.name}
                        sx={{
                          color: 'inherit',
                          '&:hover': {
                            color: theme.palette.primary.main,
                            transform: 'translateY(-3px)'
                          }
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Quick Links
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {quickLinks.map((link, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        href={link.url}
                        color="inherit"
                        underline="hover"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          py: 0.5,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: theme.palette.primary.main
                          }
                        }}
                      >
                        <Box sx={{ mr: 1, display: 'flex' }}>{link.icon}</Box>
                        {link.text}
                      </Link>
                    </motion.li>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Information Links */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Information
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {infoLinks.map((link, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        href={link.url}
                        color="inherit"
                        underline="hover"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          py: 0.5,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: theme.palette.primary.main
                          }
                        }}
                      >
                        {link.icon && <Box sx={{ mr: 1, display: 'flex' }}>{link.icon}</Box>}
                        {link.text}
                      </Link>
                    </motion.li>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          {/* Divider */}
          <motion.div variants={itemVariants}>
            <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.12)' }} />
          </motion.div>

          {/* Bottom Section */}
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <motion.div variants={itemVariants}>
                <Typography variant="body2">
                  © {new Date().getFullYear()} Anime World. All rights reserved.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  onClick={scrollToTop}
                  aria-label="scroll back to top"
                  sx={{
                    color: 'inherit',
                    backgroundColor: theme.palette.action.hover,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText
                    }
                  }}
                >
                  <ArrowUpward />
                </IconButton>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Floating Newsletter Signup (Mobile only) */}
      {isMobile && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            zIndex: 1000
          }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: 2,
              p: 2,
              boxShadow: theme.shadows[10],
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Stay updated with new releases!
              </Typography>
              <Typography variant="caption">
                Subscribe to our newsletter
              </Typography>
            </Box>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="contained"
                size="small"
                sx={{
                  whiteSpace: 'nowrap',
                  borderRadius: 2
                }}
              >
                Subscribe
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default Footer;