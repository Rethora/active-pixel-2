import { GetSuggestionOptions, Suggestion } from './types/suggestion';
import suggestions from '../../data/suggestions.json';

const LIKED_SUGGESTION_WEIGHT = 2;

const parseSuggestions = () =>
  suggestions.map((suggestion: any) => ({
    ...suggestion,
    force: suggestion.force ?? 'none',
    mechanic: suggestion.mechanic ?? 'none',
    equipment: suggestion.equipment ?? 'none',
  })) as Suggestion[];

export const getSuggestionsWithFilters = ({
  filters = {},
  dislikedSuggestions = [],
}: Omit<GetSuggestionOptions, 'likedSuggestions'>): Suggestion[] => {
  return parseSuggestions().filter((suggestion) => {
    if (dislikedSuggestions.includes(suggestion.id)) {
      return false;
    }

    return (
      (!filters.force ||
        filters.force.length === 0 ||
        filters.force.includes(suggestion.force)) &&
      (!filters.level ||
        filters.level.length === 0 ||
        filters.level.includes(suggestion.level)) &&
      (!filters.mechanic ||
        filters.mechanic.length === 0 ||
        filters.mechanic.includes(suggestion.mechanic)) &&
      (!filters.equipment ||
        filters.equipment.length === 0 ||
        filters.equipment.includes(suggestion.equipment)) &&
      (!filters.primaryMuscles ||
        filters.primaryMuscles.length === 0 ||
        filters.primaryMuscles.some((muscle) =>
          suggestion.primaryMuscles.includes(muscle),
        )) &&
      (!filters.secondaryMuscles ||
        filters.secondaryMuscles.length === 0 ||
        filters.secondaryMuscles.some((muscle) =>
          suggestion.secondaryMuscles.includes(muscle),
        )) &&
      (!filters.category ||
        filters.category.length === 0 ||
        filters.category.includes(suggestion.category))
    );
  });
};

export const getRandomSuggestion = (
  filteredSuggestions: Suggestion[],
  likedSuggestions: string[] = [],
): Suggestion | undefined => {
  if (filteredSuggestions.length === 0) {
    return undefined;
  }

  const weightedSuggestions = filteredSuggestions.flatMap((suggestion) =>
    likedSuggestions.includes(suggestion.id)
      ? Array(LIKED_SUGGESTION_WEIGHT).fill(suggestion)
      : [suggestion],
  );

  const randomIndex = Math.floor(Math.random() * weightedSuggestions.length);
  return weightedSuggestions[randomIndex];
};

export const getRandomSuggestionWithFilters = ({
  filters = {},
  likedSuggestions = [],
  dislikedSuggestions = [],
}: GetSuggestionOptions): Suggestion | undefined => {
  const filteredSuggestions = getSuggestionsWithFilters({
    filters,
    dislikedSuggestions,
  });
  return getRandomSuggestion(filteredSuggestions, likedSuggestions);
};

export const getSuggestionById = (id: string): Suggestion | undefined => {
  return parseSuggestions().find((exercise) => exercise.id === id);
};

export const getSuggestions = (): Suggestion[] => parseSuggestions();
