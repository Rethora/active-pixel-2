import { useState, MouseEvent } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getRandomSuggestion } from '../../../../shared/util/suggestion';
import DashboardItem from '../components/DashboardItem';
import {
  setCurrentFilters,
  useGetAllSuggestionsWithAddPropsQuery,
} from '../../../slices/suggestionsSlice';
import { useAppDispatch } from '../../../store/hooks';
import {
  Category,
  Equipment,
  Force,
  SuggestionFilters,
} from '../../../../shared/types/suggestion';

type PresetOption = {
  label: string;
  filters: SuggestionFilters;
};

const PRESET_OPTIONS: PresetOption[] = [
  {
    label: 'Stretch',
    filters: {
      category: [Category.Stretching],
      equipment: [Equipment.None, Equipment.BodyOnly],
    },
  },
  {
    label: 'Body Only Push Exercise',
    filters: {
      force: [Force.Push],
      equipment: [Equipment.None, Equipment.BodyOnly],
    },
  },
  {
    label: 'Body Only Pull Exercise',
    filters: {
      force: [Force.Pull],
      equipment: [Equipment.None, Equipment.BodyOnly],
    },
  },
  {
    label: 'Random',
    filters: {},
  },
];

export default function QuickSuggestion() {
  const navigate = useNavigate();
  const { data: suggestions = [] } = useGetAllSuggestionsWithAddPropsQuery();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRandomSuggestion = (filters: SuggestionFilters) => {
    const suggestion = getRandomSuggestion({
      suggestionsWithAddProps: suggestions,
      filters,
    });
    if (!suggestion) return;
    dispatch(setCurrentFilters(filters));
    navigate(`/suggestions/${suggestion.id}`);
  };

  const handleFilteredSuggestion = () => {
    navigate('/suggestions/quick');
  };

  return (
    <DashboardItem
      size="sm"
      cardTitle="Quick Suggestion"
      cardSubheader="Get a random exercise suggestion"
      cardContent={
        <Box
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
        >
          <Box display="flex" justifyContent="space-evenly">
            <Button
              variant="outlined"
              endIcon={<FilterAltIcon />}
              onClick={handleFilteredSuggestion}
              size="small"
            >
              Filtered
            </Button>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              variant="outlined"
              endIcon={<ArrowDropDownIcon />}
              size="small"
            >
              Presets
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {PRESET_OPTIONS.map((option) => (
                <MenuItem
                  key={option.label}
                  onClick={() => handleRandomSuggestion(option.filters)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      }
    />
  );
}
