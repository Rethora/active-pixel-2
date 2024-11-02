import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, FormControlLabel, Typography, Checkbox } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StairsIcon from '@mui/icons-material/Stairs';
import CategoryIcon from '@mui/icons-material/Category';
import { getSuggestionsWithFilters } from '../../shared/suggestion';
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

export const generateSelectOptions = (enumObj: object): string[] => {
  return Object.values(enumObj);
};

type FormInput = {
  label: string;
  name: string;
  options: string[];
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
  const [newFilters, setNewFilters] = useState(filters);
  const [numberOfResults, setNumberOfResults] = useState(0);
  const defaultFilters = useRef(filters);

  useEffect(() => {
    const filteredSuggestions = getSuggestionsWithFilters({
      filters: newFilters,
    });
    const numberOfFilteredResults = filteredSuggestions.length;
    setNumberOfResults(numberOfFilteredResults);
    if (onFiltersChange) onFiltersChange(newFilters);
  }, [newFilters, onFiltersChange]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setNewFilters((prevFilters) => {
      const filterKey = name as SuggestionFilterKey;
      const currentValues = (prevFilters[filterKey] ?? []) as string[];
      if (checked) {
        return {
          ...prevFilters,
          [filterKey]: [...currentValues, value],
        };
      }
      return {
        ...prevFilters,
        [filterKey]: currentValues.filter((v) => v !== value),
      };
    });
  }, []);

  const getNumberOfResultsText = useCallback(() => {
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

  return (
    <Box>
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
            {input.options.map((option) => (
              <Box key={option}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={input.name}
                      onChange={handleChange}
                      value={option}
                      defaultChecked={
                        (
                          defaultFilters.current[
                            input.name as SuggestionFilterKey
                          ] as string[]
                        )?.includes(option) || false
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
      <Typography variant="h6">{getNumberOfResultsText()}</Typography>
    </Box>
  );
}
