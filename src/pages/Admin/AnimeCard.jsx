import React from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography, Box, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import SeasonList from './SeasonAccordion'; 

const AnimeCard = ({ anime, onEditAnime, onDeleteAnime, onOpenSeasonDialog, onOpenEpisodeDialog, onDeleteSeason }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "rgba(30, 30, 46, 0.6)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="225"
          image={anime.thumbnailUrl}
          alt={anime.title}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: 1,
          }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              size="small"
              onClick={() => onEditAnime(anime)}
              sx={{
                bgcolor: "rgba(0,0,0,0.7)",
                color: "#fff",
                "&:hover": { bgcolor: "secondary.main" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              size="small"
              onClick={() => onDeleteAnime(anime.id)}
              sx={{
                bgcolor: "rgba(0,0,0,0.7)",
                color: "#fff",
                "&:hover": { bgcolor: "#f44336" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </motion.div>
        </Box>
        <Box sx={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: "#fff", fontWeight: 700 }}>
            {anime.title}
          </Typography>
        </Box>
      </Box>
       <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, WebkitLineClamp: 3 }}>
          {anime.description}
        </Typography>
        <SeasonList 
          anime={anime} 
          onOpenSeasonDialog={onOpenSeasonDialog}
          onOpenEpisodeDialog={onOpenEpisodeDialog}
          onDeleteSeason={onDeleteSeason}
        />
      </CardContent>
    </Card>
  );
};

export default AnimeCard;