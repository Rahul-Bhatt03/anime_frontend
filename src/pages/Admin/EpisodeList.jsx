import React from 'react';
import { Box, Paper, Typography, IconButton, CircularProgress, Button } from '@mui/material';
import { Videocam as VideocamIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useEpisodes } from '../../hooks/useEpisodes';

const EpisodeList = ({ season, anime, onOpenEpisodeDialog, onDeleteEpisode }) => {
  const { data: episodes = [], isLoading: isEpisodesLoading } = useEpisodes(season.id);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => onOpenEpisodeDialog(anime, season)}
        >
          Add Episode
        </Button>
      </Box>
      
      {isEpisodesLoading ? (
        <CircularProgress size={24} />
      ) : episodes.length > 0 ? (
        episodes.map((episode) => (
          <Paper
            key={episode.id}
            sx={{
              p: 2,
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "rgba(30, 30, 46, 0.6)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <VideocamIcon sx={{ mr: 2, color: "secondary.main" }} />
              <Box>
                <Typography variant="body1">
                  EP {episode.episodeNumber}: {episode.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {episode.videoUrl}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => onOpenEpisodeDialog(anime, season, episode)}
                sx={{ color: "#fff" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDeleteEpisode(anime.id, season.id, episode.id)}
                sx={{ color: "#f44336" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
          No episodes added yet
        </Typography>
      )}
    </>
  );
};

export default EpisodeList;