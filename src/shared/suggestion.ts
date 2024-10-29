import { Suggestion, SuggestionFilters } from './types/suggestion';

const parseSuggestions = (suggestions: any) =>
  suggestions.map((suggestion: any) => ({
    ...suggestion,
    force: suggestion.force ?? 'none',
    mechanic: suggestion.mechanic ?? 'none',
    equipment: suggestion.equipment ?? 'none',
  })) as Suggestion[];

export const getSuggestionsWithFilters = (
  suggestions: any,
  filters: SuggestionFilters = {},
): Suggestion[] => {
  return parseSuggestions(suggestions).filter((suggestion) => {
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
  suggestions: Suggestion[],
): Suggestion | undefined => {
  if (suggestions.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * suggestions.length);
  return suggestions[randomIndex];
};

export const getRandomSuggestionWithFilters = (
  suggestions: any,
  filters: SuggestionFilters = {},
): Suggestion | undefined => {
  const filteredSuggestions = getSuggestionsWithFilters(suggestions, filters);
  return getRandomSuggestion(filteredSuggestions);
};

export const getSuggestionById = (suggestions: any, id: string) => {
  return parseSuggestions(suggestions).find((exercise) => exercise.id === id);
};
