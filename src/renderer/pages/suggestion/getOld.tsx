import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { getRandomSuggestion } from '../../../shared/util/suggestion';
import {
  Suggestion,
  SuggestionFilters,
} from '../../../shared/types/suggestion';
import {
  useAddDislikedSuggestionMutation,
  useAddLikedSuggestionMutation,
  useGetAllSuggestionsWithAddPropsQuery,
  useGetSuggestionWithAddPropsByIdQuery,
  useRemoveFeedbackMutation,
} from '../../slices/suggestionsSlice';

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
  const { state } = useLocation() as {
    state?: {
      suggestion: Suggestion | undefined;
      filters: SuggestionFilters | undefined;
      from?: 'quick';
    };
  };
  const navigate = useNavigate();

  const { data: suggestions } = useGetAllSuggestionsWithAddPropsQuery();
  const { data: currentSuggestion } = useGetSuggestionWithAddPropsByIdQuery(
    state?.suggestion?.id ?? '',
  );

  const [addLikedSuggestion] = useAddLikedSuggestionMutation();
  const [addDislikedSuggestion] = useAddDislikedSuggestionMutation();
  const [removeFeedback] = useRemoveFeedbackMutation();

  const handleGetNewSuggestion = useCallback(() => {
    const newSuggestion = getRandomSuggestion({
      suggestionsWithAddProps: suggestions ?? [],
      filters: state?.filters,
    });
    navigate('/suggestion/get', {
      state: { suggestion: newSuggestion, filters: state?.filters },
    });
  }, [state?.filters, navigate, suggestions]);

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
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box display="flex" justifyContent="space-between" width="100%" mb={4}>
        <Button
          onClick={() => {
            navigate(-1);
          }}
          startIcon={<ArrowBackIos />}
        >
          Back
        </Button>
        {state?.from === 'quick' && (
          <Button
            onClick={() => {
              navigate('/suggestion/quick', {
                state: { filters: state?.filters },
              });
            }}
          >
            Change Filters
          </Button>
        )}
        <Button
          onClick={() => {
            navigate(1);
          }}
          endIcon={<ArrowForwardIos />}
        >
          Forward
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
        <Button
          endIcon={<ArrowForwardIos />}
          color="primary"
          onClick={handleGetNewSuggestion}
        >
          Get a New Suggestion
        </Button>
      </Box>
    </Box>
  );
}
