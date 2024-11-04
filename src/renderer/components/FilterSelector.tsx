import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Box,
  FormControlLabel,
  Typography,
  Checkbox,
  Button,
  Tooltip,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StairsIcon from '@mui/icons-material/Stairs';
import CategoryIcon from '@mui/icons-material/Category';
import { applyFilters } from '../../shared/util/suggestion';
import {
  Equipment,
  PrimaryMuscles,
  Force,
  Level,
  Mechanic,
  SecondaryMuscles,
  Category,
  SuggestionFilters,
  SuggestionFilterKey,
} from '../../shared/types/suggestion';
import SvgIcon from './SvgIcon';
import { force, mechanic, muscle } from '../icons/svgIcons';
import { useGetAllSuggestionsWithAddPropsQuery } from '../slices/suggestionsSlice';

export const generateSelectOptions = <T extends object>(
  enumObj: T,
): Array<T[keyof T]> => {
  return Object.values(enumObj);
};

type FormInput = {
  label: string;
  name: SuggestionFilterKey;
  options: Array<
    | Force
    | Level
    | Mechanic
    | Equipment
    | PrimaryMuscles
    | SecondaryMuscles
    | Category
  >;
  icon: ReactNode;
};

export const generateFormInputs = (): FormInput[] => {
  return [
    {
      label: 'Force',
      name: 'force',
      options: generateSelectOptions(Force),
      icon: <SvgIcon src={force} />,
    },
    {
      label: 'Level',
      name: 'level',
      options: generateSelectOptions(Level),
      icon: <StairsIcon />,
    },
    {
      label: 'Mechanic',
      name: 'mechanic',
      options: generateSelectOptions(Mechanic),
      icon: <SvgIcon src={mechanic} />,
    },
    {
      label: 'Equipment',
      name: 'equipment',
      options: generateSelectOptions(Equipment),
      icon: <FitnessCenterIcon />,
    },
    {
      label: 'Primary Muscles',
      name: 'primaryMuscles',
      options: generateSelectOptions(PrimaryMuscles),
      icon: <SvgIcon src={muscle} />,
    },
    {
      label: 'Secondary Muscles',
      name: 'secondaryMuscles',
      options: generateSelectOptions(SecondaryMuscles),
      icon: <SvgIcon src={muscle} />,
    },
    {
      label: 'Category',
      name: 'category',
      options: generateSelectOptions(Category),
      icon: <CategoryIcon />,
    },
  ];
};

const formInputs = generateFormInputs();

type FilterSelectorProps = {
  filters: SuggestionFilters;
  onFiltersChange: (filters: SuggestionFilters) => void;
};

export default function FilterSelector({
  filters = {},
  onFiltersChange,
}: FilterSelectorProps) {
  const { data: suggestions = [] } = useGetAllSuggestionsWithAddPropsQuery();
  const [numberOfResults, setNumberOfResults] = useState(0);
  const [currentFilters, setCurrentFilters] =
    useState<SuggestionFilters>(filters);

  useEffect(() => {
    const filteredSuggestions = applyFilters(suggestions, currentFilters);
    setNumberOfResults(filteredSuggestions.length);
  }, [currentFilters, suggestions]);

  const numberOfResultsText = useMemo(() => {
    if (numberOfResults === 0) {
      return 'There are no results matching these filters. Try different filters!';
    }
    if (numberOfResults === 1) {
      return 'There is only 1 result matching these filters!';
    }
    if (numberOfResults < 5) {
      return `There are only ${numberOfResults} results matching these filters!`;
    }
    return `There are ${numberOfResults} results matching these filters.`;
  }, [numberOfResults]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = e.target;
      const filterKey = name as SuggestionFilterKey;
      const currentValues = currentFilters[filterKey] || [];

      let updatedFilters = { ...currentFilters };

      if (value === 'all') {
        if (checked) {
          // If "all" is checked, remove the property from filters
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [filterKey]: _, ...rest } = updatedFilters;
          updatedFilters = rest;
        } else {
          // If "all" is unchecked, keep current selection
          updatedFilters[filterKey] = [...currentValues] as any;
        }
      } else if (checked) {
        // When checking a non-all option, add it and ensure "all" is unchecked
        updatedFilters[filterKey] = [
          ...currentValues,
          value as any, // Need to cast since value comes from enum options
        ];
      } else {
        // When unchecking a non-all option, just remove it
        updatedFilters[filterKey] = currentValues.filter(
          (v) => v !== value,
        ) as any;

        // If no options are selected, remove the property
        if (updatedFilters[filterKey]?.length === 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [filterKey]: _, ...rest } = updatedFilters;
          updatedFilters = rest;
        }
      }

      setCurrentFilters(updatedFilters);
      onFiltersChange(updatedFilters);
    },
    [currentFilters, onFiltersChange],
  );

  const handleReset = useCallback(() => {
    setCurrentFilters({});
    onFiltersChange({});
  }, [onFiltersChange]);

  return (
    <Box>
      <Box display="flex">
        <Typography sx={{ mr: 2 }} variant="h5">
          Filters
        </Typography>
        <Tooltip title="Reset filters" placement="right">
          <Button
            color="error"
            onClick={handleReset}
            endIcon={<RestartAltIcon />}
          >
            Reset
          </Button>
        </Tooltip>
      </Box>
      {formInputs.map((input) => (
        <Box key={input.name} my={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {input.icon}
            <Typography
              variant="h6"
              sx={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
            >
              {input.label}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    name={input.name}
                    onChange={handleChange}
                    value="all"
                    checked={!currentFilters[input.name]}
                  />
                }
                label="All"
              />
            </Box>
            {input.options.map((option) => (
              <Box key={option}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={input.name}
                      onChange={handleChange}
                      value={option}
                      checked={
                        currentFilters[input.name]?.includes(option as never) ||
                        false
                      }
                    />
                  }
                  label={option}
                />
              </Box>
            ))}
          </Box>
        </Box>
      ))}
      <Typography variant="h6">{numberOfResultsText}</Typography>
    </Box>
  );
}
