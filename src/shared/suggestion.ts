import { Suggestion, SuggestionFilters } from './types/suggestion';
import suggestions from '../../data/suggestions.json';

const parseSuggestions = () =>
  suggestions.map((suggestion: any) => ({
    ...suggestion,
    force: suggestion.force ?? 'none',
    mechanic: suggestion.mechanic ?? 'none',
    equipment: suggestion.equipment ?? 'none',
  })) as Suggestion[];

export const getSuggestionsWithFilters = (
  filters: SuggestionFilters = {},
): Suggestion[] => {
  return parseSuggestions().filter((suggestion) => {
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
): Suggestion | undefined => {
  if (filteredSuggestions.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * filteredSuggestions.length);
  return filteredSuggestions[randomIndex];
};

export const getRandomSuggestionWithFilters = (
  filters: SuggestionFilters = {},
): Suggestion | undefined => {
  const filteredSuggestions = getSuggestionsWithFilters(filters);
  return getRandomSuggestion(filteredSuggestions);
};

export const getSuggestionById = (id: string): Suggestion | undefined => {
  return parseSuggestions().find((exercise) => exercise.id === id);
};
