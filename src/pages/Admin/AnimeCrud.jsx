import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Snackbar,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Videocam as VideocamIcon,
  LiveTv as LiveTvIcon,
  Movie as MovieIcon,
  HighlightOff as HighlightOffIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import  supabase from "../../supabase/supabaseClient";
import { LinearProgress } from "@mui/material";
import { useQueryClient } from '@tanstack/react-query';
import { 
  useAnimes, 
  useCreateAnime, 
  useUpdateAnime, 
  useDeleteAnime 
} from '../../hooks/useAnime';
import { 
  useSeasons, 
  useCreateSeason, 
  useUpdateSeason, 
  useDeleteSeason 
} from '../../hooks/useSeasons';
import { 
  useEpisodes, 
  useCreateEpisode, 
  useUpdateEpisode, 
  useDeleteEpisode 
} from '../../hooks/useEpisodes';
import AnimeCard from "./AnimeCard";

const animeTheme = createTheme({
  palette: {
    primary: {
      main: "#6a11cb",
      light: "#8c44db",
      dark: "#4a0099",
    },
    secondary: {
      main: "#ff4081",
      light: "#ff79b0",
      dark: "#c60055",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: "hidden",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 20px rgba(106, 17, 203, 0.2)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
        },
      },
    },
  },
});

const AnimeCRUDManager = () => {
  const queryClient = useQueryClient();
 
  const [currentTab, setCurrentTab] = useState(0);
  const [openAnimeDialog, setOpenAnimeDialog] = useState(false);
  const [openSeasonDialog, setOpenSeasonDialog] = useState(false);
  const [openEpisodeDialog, setOpenEpisodeDialog] = useState(false);
  const [currentAnime, setCurrentAnime] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [animeForm, setAnimeForm] = useState({
    title: "",
    description: "",
    Genre:"",
    thumbnailUrl: "",
  });

  const [seasonForm, setSeasonForm] = useState({
    name: "",
    animeId: null,
  });

  const [episodeForm, setEpisodeForm] = useState({
    title: "",
    episodeNumber: "",
    videoUrl: "",
    seasonId: null,
  });

  // React Query hooks
  const { 
    data: animes = [], 
    isLoading: isAnimesLoading, 
    isError: isAnimesError 
  } = useAnimes();
  
  const createAnimeMutation = useCreateAnime();
  const updateAnimeMutation = useUpdateAnime();
  const deleteAnimeMutation = useDeleteAnime();

  const { 
    data: seasons = [], 
    isLoading: isSeasonsLoading 
  } = useSeasons(currentAnime?.id);
  
  const createSeasonMutation = useCreateSeason();
  const updateSeasonMutation = useUpdateSeason();
  const deleteSeasonMutation = useDeleteSeason();

  const { 
    data: episodes = [], 
    isLoading: isEpisodesLoading 
  } = useEpisodes(currentSeason?.id);
  
  const createEpisodeMutation = useCreateEpisode();
  const updateEpisodeMutation = useUpdateEpisode();
  const deleteEpisodeMutation = useDeleteEpisode();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // ANIME HANDLERS
  const handleOpenAnimeDialog = (anime = null) => {
    if (anime) {
      setAnimeForm({
        id: anime.id,
        title: anime.title,
        description: anime.description,
        Genre: anime.Genre,
        thumbnailUrl: anime.thumbnailUrl,
      });
    } else {
      setAnimeForm({
        title: "",
        description: "",
        Genre: "",
        thumbnailUrl: "",
      });
    }
    setOpenAnimeDialog(true);
  };

  const handleCloseAnimeDialog = () => {
    setOpenAnimeDialog(false);
  };

  const handleAnimeFormChange = (e) => {
    const { name, value } = e.target;
    setAnimeForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAnime = async () => {
    try {
      if (!animeForm.id) {
        await createAnimeMutation.mutateAsync(animeForm);
        setNotification({
          open: true,
          message: "Anime added successfully!",
          severity: "success",
        });
      } else {
        await updateAnimeMutation.mutateAsync(animeForm);
        setNotification({
          open: true,
          message: "Anime updated successfully!",
          severity: "success",
        });
      }
      handleCloseAnimeDialog();
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error saving anime",
        severity: "error",
      });
    }
  };

  const handleDeleteAnime = async (animeId) => {
    try {
      await deleteAnimeMutation.mutateAsync(animeId);
      setNotification({
        open: true,
        message: "Anime deleted successfully!",
        severity: "info",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error deleting anime",
        severity: "error",
      });
    }
  };

  // SEASON HANDLERS
  const handleOpenSeasonDialog = (anime, season = null) => {
    setCurrentAnime(anime);

    if (season) {
      setSeasonForm({
        id: season.id,
        name: season.name,
        animeId: anime.id,
      });
    } else {
      setSeasonForm({
        name: "",
        animeId: anime.id,
      });
    }

    setOpenSeasonDialog(true);
  };

  const handleCloseSeasonDialog = () => {
    setOpenSeasonDialog(false);
  };

  const handleSeasonFormChange = (e) => {
    const { name, value } = e.target;
    setSeasonForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSeason = async () => {
    try {
      if (!seasonForm.id) {
        await createSeasonMutation.mutateAsync(seasonForm);
        setNotification({
          open: true,
          message: "Season added successfully!",
          severity: "success",
        });
      } else {
        await updateSeasonMutation.mutateAsync(seasonForm);
        setNotification({
          open: true,
          message: "Season updated successfully!",
          severity: "success",
        });
      }
      handleCloseSeasonDialog();
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error saving season",
        severity: "error",
      });
    }
  };

  const handleDeleteSeason = async (animeId, seasonId) => {
    try {
      await deleteSeasonMutation.mutateAsync({ id: seasonId, animeId });
      setNotification({
        open: true,
        message: "Season deleted successfully!",
        severity: "info",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error deleting season",
        severity: "error",
      });
    }
  };

  // EPISODE HANDLERS
  const handleOpenEpisodeDialog = (anime, season, episode = null) => {
    setCurrentAnime(anime);
    setCurrentSeason(season);

    if (episode) {
      setEpisodeForm({
        id: episode.id,
        title: episode.title,
        episodeNumber: episode.episodeNumber,
        videoUrl: episode.videoUrl,
        seasonId: season.id,
      });
    } else {
      setEpisodeForm({
        title: "",
        episodeNumber: episodes.length + 1,
        videoUrl: "",
        seasonId: season.id,
      });
    }

    setOpenEpisodeDialog(true);
  };

  const handleCloseEpisodeDialog = () => {
    setOpenEpisodeDialog(false);
  };

  const handleEpisodeFormChange = (e) => {
    const { name, value } = e.target;
    setEpisodeForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEpisode = async () => {
    try {
      if (!episodeForm.id) {
        await createEpisodeMutation.mutateAsync(episodeForm);
        setNotification({
          open: true,
          message: "Episode added successfully!",
          severity: "success",
        });
      } else {
        await updateEpisodeMutation.mutateAsync(episodeForm);
        setNotification({
          open: true,
          message: "Episode updated successfully!",
          severity: "success",
        });
      }
      handleCloseEpisodeDialog();
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error saving episode",
        severity: "error",
      });
    }
  };

  const handleDeleteEpisode = async (animeId, seasonId, episodeId) => {
    try {
      await deleteEpisodeMutation.mutateAsync({ id: episodeId, seasonId });
      setNotification({
        open: true,
        message: "Episode deleted successfully!",
        severity: "info",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error deleting episode",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

const uploadFile = async (file, bucketName, pathPrefix = "") => {
  try {
    setIsUploading(true);
    setUploadProgress(0);

    // First check if bucket exists or create it
    let bucketExists = true;
    try {
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketError && bucketError.message !== 'Not Found') throw bucketError;
      
      bucketExists = !bucketError && buckets.some(b => b.name === bucketName);
      
      if (!bucketExists) {
        // Create the bucket if it doesn't exist
        const { error: createError } = await supabase
          .storage
          .createBucket(bucketName, {
            public: true, // Set to false if you want private buckets
          });
        
        if (createError) throw createError;
        bucketExists = true;
      }
    } catch (error) {
      console.error('Bucket check/create error:', error);
      throw new Error(`Failed to access/create bucket: ${error.message}`);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathPrefix}${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.${fileExt}`;

    // Upload with progress tracking
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
        onProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        }
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = await supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrl;

  } catch (error) {
    console.error('Upload error:', error);
    setNotification({
      open: true,
      message: `Upload failed: ${error.message}`,
      severity: 'error'
    });
    return null;
  } finally {
    setIsUploading(false);
  }
};

 const handleThumbnailUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;


   // Validate file size (e.g., 5MB max for thumbnails)
  if (file.size > 5 * 1024 * 1024) {
    setNotification({
      open: true,
      message: "Thumbnail must be less than 5MB",
      severity: "error",
    });
    return;
  }
  
  try {
    const url = await uploadFile(file, "thumbnails");
    if (url) {
      setAnimeForm({ ...animeForm, thumbnailUrl: url });
    } else {
      setNotification({
        open: true,
        message: "Thumbnail upload failed - no URL returned",
        severity: "error",
      });
    }
  } catch (error) {
    setNotification({
      open: true,
      message: `Thumbnail upload failed: ${error.message}`,
      severity: "error",
    });
  }
};

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadFile(file, "videos", "episodes/");
    if (url) {
      setEpisodeForm({ ...episodeForm, videoUrl: url });
    }
  };

  if (isAnimesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAnimesError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">Error loading animes</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={animeTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #121212 0%, #1e1e2e 100%)",
          pt: 4,
          pb: 8,
        }}
      >
        <Container>
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: 800,
                color: "#fff",
                textShadow: "0 0 15px rgba(106, 17, 203, 0.5)",
              }}
            >
              <LiveTvIcon
                sx={{ fontSize: 40, mr: 1, verticalAlign: "bottom" }}
              />
              AnimeWorld Manager
            </Typography>
          </motion.div>

          {/* Tabs Navigation */}
          <Paper
            elevation={4}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              mb: 4,
              background: "rgba(30, 30, 46, 0.8)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="secondary"
              indicatorColor="secondary"
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Tab
                icon={<MovieIcon />}
                label="Anime Library"
                sx={{
                  py: 2,
                  color: "#fff",
                  "&.Mui-selected": {
                    color: (theme) => theme.palette.secondary.main,
                  },
                }}
              />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {currentTab === 0 && (
              <motion.div
                key="anime-list"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                variants={containerVariants}
              >
                {/* Action Button */}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenAnimeDialog()}
                      sx={{
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: "0 4px 20px rgba(255, 64, 129, 0.3)",
                      }}
                    >
                      Add New Anime
                    </Button>
                  </motion.div>
                </Box>
             
                {/* Anime Grid */}
                <Grid container spacing={4}>
                  {animes.map((anime) => (
                    <Grid item xs={12} md={6} key={anime.id}>
                      <motion.div variants={itemVariants}>
                        <AnimeCard 
                          anime={anime}
            onEditAnime={handleOpenAnimeDialog}
            onDeleteAnime={handleDeleteAnime}
            onOpenSeasonDialog={handleOpenSeasonDialog}
            onOpenEpisodeDialog={handleOpenEpisodeDialog}
            onDeleteSeason={handleDeleteSeason}
                        />
                      </motion.div>
                    </Grid>
                  ))}

                  {animes.length === 0 && (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 4, textAlign: "center", bgcolor: "rgba(30, 30, 46, 0.6)" }}>
                        <Typography variant="h6" gutterBottom>No anime found</Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenAnimeDialog()}
                        >
                          Add New Anime
                        </Button>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Anime Dialog */}
          <Dialog
            open={openAnimeDialog}
            onClose={handleCloseAnimeDialog}
            PaperProps={{
              style: {
                backgroundColor: "#1e1e2e",
                borderRadius: 16,
                color: "#fff",
                minWidth: "500px",
              },
            }}
          >
            <DialogTitle
              sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
            >
              {animeForm.id ? "Edit Anime" : "Add New Anime"}
              <IconButton
                aria-label="close"
                onClick={handleCloseAnimeDialog}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <HighlightOffIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Anime Title"
                    name="title"
                    value={animeForm.title}
                    onChange={handleAnimeFormChange}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.2)",
                        },
                        "&:hover fieldset": {
                          borderColor: (theme) => theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={animeForm.description}
                    onChange={handleAnimeFormChange}
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.2)",
                        },
                        "&:hover fieldset": {
                          borderColor: (theme) => theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
                 <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Genre"
                    name="Genre"
                    value={animeForm.Genre}
                    onChange={handleAnimeFormChange}
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.2)",
                        },
                        "&:hover fieldset": {
                          borderColor: (theme) => theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {animeForm.thumbnailUrl && (
                      <Box
                        component="img"
                        src={animeForm.thumbnailUrl}
                        alt="Thumbnail preview"
                        sx={{
                          width: "100%",
                          maxHeight: 200,
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                    )}
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<AddIcon />}
                      sx={{ width: "100%" }}
                    >
                      Upload Thumbnail
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                      />
                    </Button>
                    {isUploading && (
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{ width: "100%" }}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", p: 3 }}
            >
              <Button
                onClick={handleCloseAnimeDialog}
                sx={{ color: "#fff", mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveAnime}
                disabled={isUploading}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Season Dialog */}
          <Dialog
            open={openSeasonDialog}
            onClose={handleCloseSeasonDialog}
            PaperProps={{
              style: {
                backgroundColor: "#1e1e2e",
                borderRadius: 16,
                color: "#fff",
                minWidth: "500px",
              },
            }}
          >
            <DialogTitle
              sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
            >
              {seasonForm.id ? "Edit Season" : "Add New Season"}
              <IconButton
                aria-label="close"
                onClick={handleCloseSeasonDialog}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <HighlightOffIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Season Name"
                    name="name"
                    value={seasonForm.name}
                    onChange={handleSeasonFormChange}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.2)",
                        },
                        "&:hover fieldset": {
                          borderColor: (theme) => theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", p: 3 }}
            >
              <Button
                onClick={handleCloseSeasonDialog}
                sx={{ color: "#fff", mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveSeason}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Episode Dialog */}
          <Dialog
            open={openEpisodeDialog}
            onClose={handleCloseEpisodeDialog}
            PaperProps={{
              style: {
                backgroundColor: "#1e1e2e",
                borderRadius: 16,
                color: "#fff",
                minWidth: "500px",
              },
            }}
          >
            <DialogTitle
              sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
            >
              {episodeForm.id ? "Edit Episode" : "Add New Episode"}
              <IconButton
                aria-label="close"
                onClick={handleCloseEpisodeDialog}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <HighlightOffIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Episode Title"
                    name="title"
                    value={episodeForm.title}
                    onChange={handleEpisodeFormChange}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.2)",
                        },
                        "&:hover fieldset": {
                          borderColor: (theme) => theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Episode Number"
                    name="episodeNumber"
                    type="number"
                    value={episodeForm.episodeNumber}
                    onChange={handleEpisodeFormChange}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.2)",
                        },
                        "&:hover fieldset": {
                          borderColor: (theme) => theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Video URL"
                      name="videoUrl"
                      value={episodeForm.videoUrl}
                      onChange={handleEpisodeFormChange}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255,255,255,0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: (theme) => theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<VideocamIcon />}
                    >
                      Upload Video
                      <input
                        type="file"
                        hidden
                        accept="video/*"
                        onChange={handleVideoUpload}
                      />
                    </Button>
                    {isUploading && (
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{ width: "100%" }}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
              </DialogContent>
            <DialogActions
              sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", p: 3 }}
            >
              <Button
                onClick={handleCloseEpisodeDialog}
                sx={{ color: "#fff", mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveEpisode}
                disabled={isUploading}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Notification Snackbar */}
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseNotification}
              severity={notification.severity}
              sx={{
                width: "100%",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.background.paper
                    : undefined,
                border: (theme) =>
                  `1px solid ${
                    theme.palette[notification.severity]?.light || "#fff"
                  }`,
              }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AnimeCRUDManager;