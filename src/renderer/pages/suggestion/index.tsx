import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { getRandomSuggestionWithFilters } from '../../../shared/suggestion';
import {
  Suggestion,
  SuggestionFilters,
} from '../../../shared/types/suggestion';

type NavigateImageListCardProps = {
  suggestion: Suggestion;
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

  return (
    <Card>
      <CardHeader title={suggestion.name} sx={{ textAlign: 'center' }} />
      <CardContent
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            transition: 'background-color 0.4s ease',
            '&::after': {
              content: '"Click to see next image"',
              position: 'absolute',
              bottom: 6,
              right: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '0 8px',
              borderRadius: 1,
              fontSize: '0.875rem',
              animation: 'fadeOut 0.4s ease 2s forwards',
            },
          },
          position: 'relative',
          '@keyframes fadeOut': {
            from: { opacity: 1 },
            to: { opacity: 0 },
          },
        }}
        onClick={() => {
          setSelectedImageIndex(
            (selectedImageIndex + 1) % suggestion.images.length,
          );
        }}
      >
        <Box>
          <img
            src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${suggestion.images[selectedImageIndex]}`}
            alt="tmp"
            style={{
              maxWidth: 800,
              width: '100%',
              height: 'auto',
              maxHeight: 600,
            }}
          />
        </Box>
      </CardContent>
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
    };
  };
  const navigate = useNavigate();

  const [currentSuggestion, setCurrentSuggestion] = useState(state?.suggestion);

  useEffect(() => {
    setCurrentSuggestion(state?.suggestion);
  }, [state?.suggestion]);

  const handleGetNewSuggestion = useCallback(() => {
    const newSuggestion = getRandomSuggestionWithFilters(state?.filters);
    navigate('/suggestion', {
      state: { suggestion: newSuggestion, filters: state?.filters },
    });
  }, [state?.filters, navigate]);

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
