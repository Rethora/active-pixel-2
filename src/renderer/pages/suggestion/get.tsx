import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Skeleton,
  CardActionArea,
  Tooltip,
  Fade,
  Drawer,
  ListItemButton,
  capitalize,
} from '@mui/material';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import HistoryIcon from '@mui/icons-material/History';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import { getRandomSuggestion } from '../../../shared/util/suggestion';
import { Suggestion } from '../../../shared/types/suggestion';
import {
  addPreviousSuggestionId,
  setCurrentSuggestionId,
  useAddDislikedSuggestionMutation,
  useAddLikedSuggestionMutation,
  useGetAllSuggestionsWithAddPropsQuery,
  useGetSuggestionWithAddPropsByIdQuery,
  useRemoveFeedbackMutation,
} from '../../slices/suggestionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { APP_TOOLBAR_HEIGHT } from '../../constants/app';
import Loading from '../../components/Loading';

type NavigateImageListCardProps = {
  suggestion: Suggestion;
};

type ImageLoadedState = {
  [key: number]: boolean;
};

const arrayToText = (array: string[]) => {
  if (array.length === 0) {
    return 'None';
  }
  if (array.length === 1) {
    return array[0];
  }
  return `${array.slice(0, -1).join(', ')} and ${array[array.length - 1]}`;
};

function NavigateImageListCard({ suggestion }: NavigateImageListCardProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState<ImageLoadedState>(
    suggestion.images.reduce(
      (acc, _, index) => ({ ...acc, [index]: false }),
      {},
    ),
  );
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imageRef.current;
    const handleLoad = () => {
      setIsImageLoaded((prev) => ({ ...prev, [selectedImageIndex]: true }));
    };

    if (img) {
      setIsImageLoaded((prev) => ({ ...prev, [selectedImageIndex]: false }));

      const imageUrl = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${suggestion.images[selectedImageIndex]}`;
      img.src = imageUrl;
      img.addEventListener('load', handleLoad);
    }

    return () => {
      img?.removeEventListener('load', handleLoad);
    };
  }, [selectedImageIndex, suggestion.images]);

  return (
    <Card sx={{ maxWidth: 800 }}>
      <Tooltip
        title="Click to see next image"
        open={tooltipOpen}
        placement="top"
        arrow
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 800 }}
        leaveDelay={600}
        onOpen={() => {
          setTooltipOpen(true);
          setTimeout(() => {
            setTooltipOpen(false);
          }, 2000);
        }}
        onClose={() => {
          setTooltipOpen(false);
        }}
      >
        <CardActionArea disableRipple>
          <Box
            position="relative"
            minWidth={400}
            minHeight={400}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CardMedia
              ref={imageRef}
              onClick={() => {
                setSelectedImageIndex(
                  (selectedImageIndex + 1) % suggestion.images.length,
                );
              }}
              image={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${suggestion.images[selectedImageIndex]}`}
              alt={suggestion.name}
              component="img"
              sx={{
                maxHeight: 600,
                width: '100%',
                objectFit: 'contain',
                visibility: isImageLoaded[selectedImageIndex]
                  ? 'visible'
                  : 'hidden',
              }}
            />
            {!isImageLoaded[selectedImageIndex] && (
              <Box position="absolute" top={0} left={0} bottom={0} right={0}>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height="100%"
                  width="100%"
                />
              </Box>
            )}
          </Box>
        </CardActionArea>
      </Tooltip>
    </Card>
  );
}

function InstructionCard({ instructions }: { instructions: string[] }) {
  return (
    <Card>
      <CardHeader title="Instructions" />
      <CardContent>
        {instructions.map((instruction) => (
          <List key={instruction}>
            <ListItem disablePadding>
              <ListItemText primary={instruction} />
            </ListItem>
          </List>
        ))}
      </CardContent>
    </Card>
  );
}

function InformationCardItem({
  title,
  value,
}: {
  title: string;
  value: string | string[];
}) {
  return (
    <Box mb={2}>
      <Typography textTransform="capitalize">
        <strong>{title}:</strong>{' '}
        {typeof value === 'string' ? value : arrayToText(value)}
      </Typography>
    </Box>
  );
}

function OtherInformationCard({ suggestion }: { suggestion: Suggestion }) {
  return (
    <Card>
      <CardHeader title="Details" />
      <CardContent>
        <InformationCardItem title="category" value={suggestion.category} />
        <InformationCardItem title="force" value={suggestion.force} />
        <InformationCardItem title="difficulty" value={suggestion.level} />
        <InformationCardItem title="mechanic" value={suggestion.mechanic} />
        <InformationCardItem title="equipment" value={suggestion.equipment} />
        <InformationCardItem
          title="primary muscles"
          value={suggestion.primaryMuscles}
        />
        <InformationCardItem
          title="secondary muscles"
          value={suggestion.secondaryMuscles}
        />
      </CardContent>
    </Card>
  );
}

export default function SuggestionPage() {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { data: suggestions = [], isLoading: isSuggestionsLoading } =
    useGetAllSuggestionsWithAddPropsQuery();
  const { data: currentSuggestion, isLoading: isCurrentSuggestionLoading } =
    useGetSuggestionWithAddPropsByIdQuery(id, {
      skip: !id,
    });
  const suggestionsState = useAppSelector((state) => state.suggestions);
  const dispatch = useAppDispatch();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(setCurrentSuggestionId(id));
      dispatch(addPreviousSuggestionId(id));
    }
  }, [dispatch, id]);

  const [addLikedSuggestion] = useAddLikedSuggestionMutation();
  const [addDislikedSuggestion] = useAddDislikedSuggestionMutation();
  const [removeFeedback] = useRemoveFeedbackMutation();

  const handleGetNewSuggestion = useCallback(() => {
    setError(null);
    const newSuggestion = getRandomSuggestion({
      suggestionsWithAddProps: suggestions ?? [],
      filters: suggestionsState.currentFilters,
    });
    // TODO: Add better not found handling
    if (!newSuggestion) {
      setError('No suggestions found with the current filters');
      return;
    }
    navigate(`/suggestions/${newSuggestion.id}`, {
      state: {
        suggestion: newSuggestion,
        filters: suggestionsState.currentFilters,
      },
    });
  }, [suggestionsState.currentFilters, navigate, suggestions]);

  const handleLike = async () => {
    if (!currentSuggestion) return;

    if (currentSuggestion.rating === -1) {
      await removeFeedback(currentSuggestion.id);
    } else {
      await addLikedSuggestion(currentSuggestion.id);
    }
  };

  const handleDislike = async () => {
    if (!currentSuggestion) return;

    if (currentSuggestion.rating === 1) {
      await removeFeedback(currentSuggestion.id);
    } else {
      await addDislikedSuggestion(currentSuggestion.id);
    }
  };

  if (isSuggestionsLoading || isCurrentSuggestionLoading) {
    return <Loading />;
  }

  // TODO: Add better not found handling
  if (!currentSuggestion) {
    return (
      <Box>
        <Typography>No suggestion found!</Typography>
        <Typography>Try adding more filters to see if that helps...</Typography>
      </Box>
    );
  }

  return (
    <Box position="relative">
      {!isDrawerOpen && (
        <Box
          display="flex"
          justifyContent="flex-end"
          position="fixed"
          right={30}
          top={90}
          zIndex={1000}
          sx={{
            transition: 'right 0.3s ease',
          }}
        >
          <Tooltip title="Previous" placement="left">
            <IconButton
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              sx={{
                backgroundColor: 'background.paper',
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <HistoryIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        anchor="right"
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            position: 'fixed',
            top: `${APP_TOOLBAR_HEIGHT}px`,
            height: `calc(100% - ${APP_TOOLBAR_HEIGHT}px)`,
          },
        }}
      >
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Previously Viewed</Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {suggestionsState.previousSuggestionIds.map((suggestionId) => {
              const suggestion = suggestions?.find(
                (s) => s.id === suggestionId,
              );
              if (!suggestion) return null;
              return (
                <ListItem key={suggestionId} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => {
                      navigate(`/suggestions/${suggestionId}`);
                      setIsDrawerOpen(false);
                    }}
                    selected={suggestionId === id}
                  >
                    <ListItemText
                      primary={suggestion.name}
                      secondary={capitalize(suggestion.category)}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Button
            onClick={() => {
              navigate('/suggestions/quick');
            }}
            endIcon={<FilterAltIcon />}
            variant="outlined"
          >
            Change Filters
          </Button>
        </Box>
        <Box>
          <NavigateImageListCard suggestion={currentSuggestion} />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          gap={4}
          mt={4}
          flexWrap="wrap"
          maxWidth="1500px"
        >
          <Box flexGrow={1} flexBasis={500}>
            <InstructionCard instructions={currentSuggestion.instructions} />
          </Box>
          <Box flexGrow={1} flexBasis={300}>
            <OtherInformationCard suggestion={currentSuggestion} />
          </Box>
        </Box>
        <Box display="flex" gap={2} justifyContent="center" mt={2}>
          <IconButton
            onClick={handleLike}
            color={currentSuggestion.rating === -1 ? 'primary' : 'default'}
          >
            {currentSuggestion.rating === -1 ? (
              <ThumbUpIcon />
            ) : (
              <ThumbUpOutlinedIcon />
            )}
          </IconButton>
          <IconButton
            onClick={handleDislike}
            color={currentSuggestion.rating === 1 ? 'error' : 'default'}
          >
            {currentSuggestion.rating === 1 ? (
              <ThumbDownIcon />
            ) : (
              <ThumbDownOutlinedIcon />
            )}
          </IconButton>
        </Box>
        <Box mt={4} display="flex" justifyContent="flex-end" width="100%">
          <Tooltip title={error ?? ''}>
            <span>
              <Button
                endIcon={<ArrowForwardIos />}
                color="primary"
                onClick={handleGetNewSuggestion}
                variant="contained"
                disabled={!!error}
              >
                New Suggestion
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
