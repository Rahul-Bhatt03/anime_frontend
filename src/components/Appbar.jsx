import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Badge,
  Box,
  Menu,
  MenuItem,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  Avatar,
  alpha,
  styled,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Bookmark as WatchlistIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Whatshot as LatestIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// Sakura blossom particle component
const SakuraParticle = ({ x, y, rotate, delay }) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 12,
        height: 12,
        backgroundImage:
          'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJ0cmFuc3BhcmVudCIgc3Ryb2tlPSJmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNDY0IDI1NmMwLTEzNi04LTI0MC0yMDgtMjQwUzQ4IDEyMCA0OCAyNTZzOCAyNDAgMjA4IDI0MCAyMDgtMTA0IDIwOC0yNDB6Ii8+PC9zdmc+")',
        backgroundSize: "contain",
        zIndex: 1,
        opacity: 0.8,
      }}
      initial={{ y: -20, opacity: 0, rotate: 0 }}
      animate={{
        y: [0, 100],
        opacity: [0.8, 0],
        rotate: rotate,
        x: [0, Math.random() * 20 - 10],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay: delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// Enhanced styled components with anime aesthetic
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.4)",
  position: "fixed",
  transition: "all 0.4s ease",
  "&.scrolled": {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  },
  backgroundImage:
    "linear-gradient(to right, rgba(255,228,225,0.1), rgba(255,240,245,0.1))",
}));

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  padding: "0.5rem 0",
});

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  "& img": {
    height: 48,
    marginRight: theme.spacing(1.5),
    transition: "transform 0.4s ease",
    filter: "drop-shadow(0 2px 8px rgba(236, 64, 122, 0.3))",
    "&:hover": {
      transform: "scale(1.1) rotate(5deg)",
    },
  },
  "& .MuiTypography-root": {
    background: "linear-gradient(45deg, #FF4081 30%, #FF6EC4 90%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
    letterSpacing: "1px",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    fontFamily: '"Pacifico", cursive, sans-serif',
    fontSize: "1.8rem",
  },
}));

const NavSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: "#555",
  margin: theme.spacing(0, 0.7),
  textTransform: "none",
  position: "relative",
  fontSize: "1rem",
  fontWeight: 500,
  padding: theme.spacing(1, 1.8),
  transition: "all 0.3s ease",
  borderRadius: theme.shape.borderRadius * 4,
  overflow: "hidden",
  fontFamily: '"Comic Sans MS", cursive, sans-serif',
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(45deg, transparent, rgba(255, 105, 180, 0.1), transparent)",
    transform: "translateX(-100%)",
    transition: "transform 0.6s",
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: "translateY(-3px)",
    color: "#FF4081",
    boxShadow: "0 4px 12px rgba(255, 64, 129, 0.2)",
    "&::before": {
      transform: "translateX(100%)",
    },
  },
  "&.active": {
    color: "#FF4081",
    fontWeight: 600,
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 6,
      left: "50%",
      transform: "translateX(-50%)",
      width: "60%",
      height: 3,
      backgroundColor: "#FF4081",
      borderRadius: 3,
    },
  },
}));

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius * 6,
  backgroundColor: alpha(theme.palette.common.white, 0.9),
  backdropFilter: "blur(8px)",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.95),
    boxShadow: "0 4px 20px rgba(255, 64, 129, 0.15)",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  border: "1px solid rgba(255, 182, 193, 0.5)",
  boxShadow: "0 2px 15px rgba(255, 182, 193, 0.2)",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: alpha("#FF4081", 0.8),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#555",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    fontWeight: 500,
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "32ch",
      },
    },
  },
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  color: "#555",
  margin: theme.spacing(0, 0.5),
  transition: "all 0.3s",
  backgroundColor: alpha("#FF4081", 0.08),
  padding: theme.spacing(1.2),
  borderRadius: "50%",
  "&:hover": {
    backgroundColor: alpha("#FF4081", 0.2),
    transform: "translateY(-4px) scale(1.1)",
    boxShadow: "0 6px 15px rgba(255, 64, 129, 0.25)",
    color: "#FF4081",
  },
}));

const AvatarButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  marginLeft: theme.spacing(1.5),
  border: "2px solid transparent",
  transition: "all 0.3s ease",
  background:
    "linear-gradient(white, white) padding-box, linear-gradient(45deg, #FF4081, #FF6EC4) border-box",
  borderRadius: "50%",
  boxShadow: "0 4px 15px rgba(255, 64, 129, 0.3)",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 8px 25px rgba(255, 64, 129, 0.4)",
  },
}));

const ResponsiveAppBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const profileMenuOpen = Boolean(profileMenuAnchor);
  const [sakuraParticles, setSakuraParticles] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Create sakura particles
    const particles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100 - 100}px`,
      rotate: Math.random() * 360,
      delay: Math.random() * 2,
    }));
    setSakuraParticles(particles);
  }, []);

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // const handleNavClick = (navItem) => {
  //   setActiveNav(navItem);
  //   if (isMobile) {
  //     setMobileMenuOpen(false);
  //   }
  // };

  const navItems = [
    { id: "home", label: "Home", icon: <HomeIcon />, path: "/" },
    {
      id: "latest",
      label: "Latest",
      icon: <LatestIcon />,
      path: "/latest-anime",
    },
    {
      id: "favorite",
      label: "Favorites",
      icon: <FavoriteIcon />,
      path: "/favourite",
    },
    { id: "explore", label: "Explore", icon: <StarIcon />, path: "/explore" },
  ];

  const handleNavClick = (navItem, path) => {
    setActiveNav(navItem);
    navigate(path);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const mobileDrawer = (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      PaperProps={{
        sx: {
          width: 300,
          backgroundColor: "rgba(255, 245, 250, 0.98)",
          backdropFilter: "blur(20px)",
          borderRadius: "0 24px 24px 0",
          boxShadow: "16px 0 40px rgba(255, 64, 129, 0.2)",
          border: "none",
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,240,245,0.8), rgba(255,228,225,0.8))",
        },
      }}
    >
      <Box
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Sakura particles background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {sakuraParticles.map((particle) => (
            <SakuraParticle
              key={particle.id}
              x={particle.x}
              y={particle.y}
              rotate={particle.rotate}
              delay={particle.delay}
            />
          ))}
        </Box>

        <LogoContainer
          sx={{
            justifyContent: "center",
            paddingY: 2,
            position: "relative",
            zIndex: 1,
          }}
          onClick={() => handleNavClick("home")}
        >
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/1532/1532556.png"
            alt="Anime Logo"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          />
          <Typography variant="h5" component="div">
            AnimeWorld
          </Typography>
        </LogoContainer>

        <Divider
          sx={{
            my: 2.5,
            opacity: 0.4,
            borderColor: "rgba(255, 64, 129, 0.3)",
            position: "relative",
            zIndex: 1,
          }}
        />

        <SearchContainer sx={{ my: 2.5, position: "relative", zIndex: 1 }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search anime..."
            inputProps={{ "aria-label": "search" }}
          />
        </SearchContainer>

        <List sx={{ mt: 1.5, position: "relative", zIndex: 1 }}>
          {navItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 8 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ListItem
                button
                onClick={() => handleNavClick(item.id, item.path)}
                selected={activeNav === item.id}
                sx={{
                  mb: 1.5,
                  borderRadius: 3,
                  py: 1.2,
                  "&.Mui-selected": {
                    backgroundColor: alpha("#FF4081", 0.1),
                    color: "#FF4081",
                    fontWeight: 600,
                  },
                  "&:hover": {
                    backgroundColor: alpha("#FF4081", 0.08),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 45,
                    color: activeNav === item.id ? "#FF4081" : "#555",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "1.1rem",
                    fontWeight: activeNav === item.id ? 600 : 500,
                    fontFamily: '"Comic Sans MS", cursive, sans-serif',
                  }}
                />
              </ListItem>
            </motion.div>
          ))}
        </List>

        <Box sx={{ mt: "auto", position: "relative", zIndex: 1 }}>
          <Divider
            sx={{
              my: 2.5,
              opacity: 0.4,
              borderColor: "rgba(255, 64, 129, 0.3)",
            }}
          />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AccountIcon />}
              sx={{
                mb: 2.5,
                borderRadius: 3,
                textTransform: "none",
                py: 1.4,
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 4px 15px rgba(255, 64, 129, 0.3)",
                background: "linear-gradient(45deg, #FF4081 30%, #FF6EC4 90%)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(255, 64, 129, 0.4)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              My Profile
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<WatchlistIcon />}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                py: 1.4,
                fontWeight: 600,
                fontSize: "1rem",
                borderWidth: "2px",
                borderColor: "#FF4081",
                color: "#FF4081",
                "&:hover": {
                  borderWidth: "2px",
                  boxShadow: "0 4px 15px rgba(255, 64, 129, 0.2)",
                  transform: "translateY(-2px)",
                  backgroundColor: alpha("#FF4081", 0.05),
                },
              }}
            >
              My Watchlist
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Drawer>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <StyledAppBar className={scrolled ? "scrolled" : ""}>
        <Container maxWidth="xl">
          <StyledToolbar>
            {isMobile && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  edge="start"
                  aria-label="menu"
                  onClick={handleMobileMenuToggle}
                  sx={{
                    color: "#555",
                    backgroundColor: alpha("#FF4081", 0.1),
                    mr: 1,
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            )}

            <LogoContainer onClick={() => handleNavClick("home")}>
              <motion.img
                src="https://cdn-icons-png.flaticon.com/512/1532/1532556.png"
                alt="Anime Logo"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              />
              <Typography variant="h5" component="div">
                AnimeWorld
              </Typography>
            </LogoContainer>

            {!isMobile && (
              <NavSection>
                {navItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <NavButton
                      className={activeNav === item.id ? "active" : ""}
                      onClick={() => handleNavClick(item.id, item.path)}
                      startIcon={item.icon}
                    >
                      {item.label}
                    </NavButton>
                  </motion.div>
                ))}
              </NavSection>
            )}

            {!isMobile && (
              <SearchContainer>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search anime..."
                  inputProps={{ "aria-label": "search" }}
                />
              </SearchContainer>
            )}

            <NavSection>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ActionIconButton aria-label="watchlist">
                  <Badge
                    badgeContent={5}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontWeight: "bold",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        backgroundColor: "#FF4081",
                      },
                    }}
                  >
                    <WatchlistIcon />
                  </Badge>
                </ActionIconButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <AvatarButton
                  id="profile-button"
                  aria-controls={profileMenuOpen ? "profile-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen ? "true" : undefined}
                  onClick={handleProfileMenuOpen}
                >
                  <Avatar
                    alt="User Profile"
                    src="https://i.pinimg.com/originals/3f/3d/d9/3f3dd9219f7bb1c9617cf4f154b70383.jpg"
                    sx={{ width: 42, height: 42 }}
                  />
                </AvatarButton>
              </motion.div>

              <Menu
                id="profile-menu"
                anchorEl={profileMenuAnchor}
                open={profileMenuOpen}
                onClose={handleProfileMenuClose}
                MenuListProps={{
                  "aria-labelledby": "profile-button",
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    borderRadius: 3,
                    mt: 1.5,
                    minWidth: 220,
                    overflow: "visible",
                    backgroundColor: "rgba(255, 245, 250, 0.98)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 182, 193, 0.3)",
                    boxShadow: "0 15px 40px rgba(255, 64, 129, 0.2)",
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      backgroundColor: "rgba(255, 245, 250, 0.98)",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                      borderLeft: "1px solid rgba(255, 182, 193, 0.3)",
                      borderTop: "1px solid rgba(255, 182, 193, 0.3)",
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={handleProfileMenuClose}
                  sx={{
                    py: 1.5,
                    fontSize: "0.95rem",
                    "&:hover": {
                      backgroundColor: alpha("#FF4081", 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <AccountIcon fontSize="small" sx={{ color: "#FF4081" }} />
                  </ListItemIcon>
                  <Typography
                    sx={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}
                  >
                    Profile
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={handleProfileMenuClose}
                  sx={{
                    py: 1.5,
                    fontSize: "0.95rem",
                    "&:hover": {
                      backgroundColor: alpha("#FF4081", 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" sx={{ color: "#FF4081" }} />
                  </ListItemIcon>
                  <Typography
                    sx={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}
                  >
                    Settings
                  </Typography>
                </MenuItem>
                <Divider
                  sx={{ my: 1, borderColor: "rgba(255, 64, 129, 0.2)" }}
                />
                <MenuItem
                  onClick={handleProfileMenuClose}
                  sx={{
                    py: 1.5,
                    fontSize: "0.95rem",
                    "&:hover": {
                      backgroundColor: alpha("#FF4081", 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: "#FF4081" }} />
                  </ListItemIcon>
                  <Typography
                    sx={{
                      color: "#FF4081",
                      fontFamily: '"Comic Sans MS", cursive, sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </NavSection>
          </StyledToolbar>
        </Container>
      </StyledAppBar>

      {/* Sakura particles for desktop */}
      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {sakuraParticles.map((particle) => (
            <SakuraParticle
              key={particle.id}
              x={particle.x}
              y={particle.y}
              rotate={particle.rotate}
              delay={particle.delay}
            />
          ))}
        </Box>
      )}

      <AnimatePresence>{mobileDrawer}</AnimatePresence>
    </motion.div>
  );
};

export default ResponsiveAppBar;
