import {
  Equipment,
  Force,
  Mechanic,
  Suggestion,
  SuggestionFilters,
  SuggestionPreferences,
  SuggestionWithAddProps,
} from '../types/suggestion';
import suggestionsData from '../../../data/suggestions.json';

const LIKED_SUGGESTION_WEIGHT = 2;

type WeightedOptions =
  | {
      weighted: true;
      weight: number;
    }
  | {
      weighted: false;
      weight?: never;
    };

type BaseGetRandomWeightedSuggestionOptions = {
  weightedOptions?: WeightedOptions;
  filters?: SuggestionFilters;
  excludeDislikedSuggestions?: boolean;
};

type ByNoSuggestions = {
  suggestions?: never;
  suggestionPreferences?: never;
  suggestionsWithAddProps?: never;
  excludeOptions?: never;
};

type BySuggestions = {
  suggestions: Suggestion[];
  suggestionPreferences?: SuggestionPreferences;
  suggestionsWithAddProps?: never;
};

type BySuggestionsWithAddProps = {
  suggestionsWithAddProps: SuggestionWithAddProps[];
  suggestionPreferences?: never;
  suggestions?: never;
};

type GetRandomWeightedSuggestionOptions =
  BaseGetRandomWeightedSuggestionOptions &
    (ByNoSuggestions | BySuggestions | BySuggestionsWithAddProps);

const parseSuggestions = () =>
  suggestionsData.map((suggestion: any) => ({
    ...suggestion,
    force: suggestion.force ?? Force.None,
    mechanic: suggestion.mechanic ?? Mechanic.None,
    equipment: suggestion.equipment ?? Equipment.None,
  })) as Suggestion[];

export const getSuggestions = (): Suggestion[] => parseSuggestions();

export const getSuggestionsWithAddProps = ({
  preferences,
}: {
  preferences: SuggestionPreferences;
}): SuggestionWithAddProps[] => {
  const suggestions = getSuggestions();
  return suggestions.map((suggestion) => {
    let rating = 0;
    if (suggestion.id in preferences) {
      rating = preferences[suggestion.id] === true ? -1 : 1; // -1 for liked, 1 for disliked
    }
    return {
      ...suggestion,
      rating,
    };
  });
};

/**
 * Convert the suggestions to SuggestionWithAddProps
 * @param options - The options to use for converting the suggestions
 * @returns The suggestions with add props
 */
const convertToSuggestionsWithAddProps = (
  options: GetRandomWeightedSuggestionOptions,
): SuggestionWithAddProps[] => {
  if ('suggestions' in options) {
    const baseSuggestions = options.suggestions ?? [];
    const preferences = options.suggestionPreferences ?? {};

    let suggestions = baseSuggestions.map((suggestion) => {
      let rating = 0;
      if (suggestion.id in preferences) {
        rating = preferences[suggestion.id] === true ? -1 : 1; // -1 for liked, 1 for disliked
      }
      return {
        ...suggestion,
        rating,
      };
    });

    if (options.excludeDislikedSuggestions) {
      suggestions = suggestions.filter((s) => s.rating !== 1);
    }

    return suggestions;
  }

  if ('suggestionsWithAddProps' in options) {
    return options.suggestionsWithAddProps ?? [];
  }

  return parseSuggestions().map((suggestion) => ({
    ...suggestion,
    rating: 0,
  }));
};

/**
 * Apply filters to the suggestions
 * @param suggestions - The suggestions to apply filters to
 * @param filters - The filters to apply
 * @returns The suggestions with filters applied
 */
export const applyFilters = (
  suggestions: SuggestionWithAddProps[],
  filters?: SuggestionFilters,
): SuggestionWithAddProps[] => {
  if (!filters) return suggestions;

  const {
    category,
    force,
    level,
    mechanic,
    equipment,
    primaryMuscles,
    secondaryMuscles,
  } = filters;

  return suggestions.filter((suggestion) => {
    const matchesCategory =
      !category?.length || category.includes(suggestion.category);
    const matchesForce = !force?.length || force.includes(suggestion.force);
    const matchesLevel = !level?.length || level.includes(suggestion.level);
    const matchesMechanic =
      !mechanic?.length || mechanic.includes(suggestion.mechanic);
    const matchesEquipment =
      !equipment?.length || equipment.includes(suggestion.equipment);
    const matchesPrimaryMuscles =
      !primaryMuscles?.length ||
      suggestion.primaryMuscles.some((muscle) =>
        primaryMuscles.includes(muscle),
      );
    const matchesSecondaryMuscles =
      !secondaryMuscles?.length ||
      suggestion.secondaryMuscles.some((muscle) =>
        secondaryMuscles.includes(muscle),
      );

    return (
      matchesCategory &&
      matchesForce &&
      matchesLevel &&
      matchesMechanic &&
      matchesEquipment &&
      matchesPrimaryMuscles &&
      matchesSecondaryMuscles
    );
  });
};

/**
 * Apply weighting to the suggestions
 * @param suggestions - The suggestions to apply weighting to
 * @param weightedOptions - The options to use for weighting
 * @returns The suggestions with weighting applied
 */
export const applyWeighting = (
  suggestions: SuggestionWithAddProps[],
  weightedOptions?: WeightedOptions,
): SuggestionWithAddProps[] => {
  if (!weightedOptions?.weighted) return suggestions;

  if (!weightedOptions.weight || weightedOptions.weight < 2) {
    throw new Error('Weight must be >= 2 when weighted is true');
  }

  const weightedSuggestions = [...suggestions];
  suggestions.forEach((suggestion) => {
    if (suggestion.rating === -1) {
      for (let i = 0; i < weightedOptions.weight - 1; i += 1) {
        weightedSuggestions.push(suggestion);
      }
    }
  });

  return weightedSuggestions;
};

/**
 * Get a random suggestion based on the options provided
 * @param options - The options to use for getting the suggestion
 * @returns A random suggestion or undefined if there are no suggestions
 */
export const getRandomSuggestion = (
  options: GetRandomWeightedSuggestionOptions = {
    suggestions: parseSuggestions(),
    suggestionPreferences: {},
    weightedOptions: { weighted: true, weight: LIKED_SUGGESTION_WEIGHT },
    filters: {},
    excludeDislikedSuggestions: true,
  },
): Suggestion | undefined => {
  let suggestions = convertToSuggestionsWithAddProps(options);
  suggestions = applyFilters(suggestions, options.filters);
  suggestions = applyWeighting(suggestions, options.weightedOptions);

  return suggestions.length > 0
    ? suggestions[Math.floor(Math.random() * suggestions.length)]
    : undefined;
};
