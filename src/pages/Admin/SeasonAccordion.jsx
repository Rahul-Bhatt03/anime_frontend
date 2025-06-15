import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  CircularProgress, 
  Chip 
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useSeasons } from '../../hooks/useSeasons';
import EpisodeList from './EpisodeList';

const SeasonList = ({ anime, onOpenSeasonDialog, onOpenEpisodeDialog, onDeleteSeason }) => {
  const { data: seasons = [], isLoading: isSeasonsLoading } = useSeasons(anime.id, {
    select: (data) => data.map(season => ({
      ...season,
      // Calculate episode count from the episodes array
      episodeCount: season.episodes?.length || 0
    }))
  });

  const [expandedSeason, setExpandedSeason] = useState(null);

  const handleSeasonExpand = (seasonId) => {
    setExpandedSeason(expandedSeason === seasonId ? null : seasonId);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" component="h3" sx={{ mr: 2 }}>Seasons</Typography>
        <IconButton
          size="small"
          color="secondary"
          onClick={() => onOpenSeasonDialog(anime)}
          sx={{ bgcolor: "rgba(255,64,129,0.1)" }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {isSeasonsLoading ? (
        <CircularProgress size={24} />
      ) : seasons.length > 0 ? (
        seasons.map((season) => (
          <Accordion
            key={season.id}
            expanded={expandedSeason === season.id}
            onChange={() => handleSeasonExpand(season.id)}
            sx={{ mb: 2, bgcolor: "rgba(30, 30, 46, 0.4)" }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
              <Typography sx={{ color: "#fff" }}>{season.name}</Typography>
              <Box sx={{ display: "flex", gap: 1, ml: 'auto' }}>
                <Chip
                  size="small"
                  label={`${season.episodeCount} Episodes`}
                  sx={{ 
                    bgcolor: "rgba(106, 17, 203, 0.2)", 
                    color: "#b388ff",
                    fontWeight: 500
                  }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSeasonDialog(anime, season);
                  }}
                  sx={{ color: "#fff" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSeason(anime.id, season.id);
                  }}
                  sx={{ color: "#f44336" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <EpisodeList 
                season={season} 
                anime={anime}
                onOpenEpisodeDialog={onOpenEpisodeDialog}
              />
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
          No seasons added yet
        </Typography>
      )}
    </Box>
  );
};

export default SeasonList;