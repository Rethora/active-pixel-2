import { getRandomSuggestion } from '../suggestion';
import {
  Suggestion,
  SuggestionWithAddProps,
  Category,
  Force,
  Level,
  Mechanic,
  Equipment,
  PrimaryMuscles,
  SecondaryMuscles,
} from '../../types/suggestion';

// Mock test data
const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    name: 'Exercise 1',
    category: Category.Strength,
    force: Force.Push,
    level: Level.Beginner,
    mechanic: Mechanic.Compound,
    equipment: Equipment.Barbell,
    primaryMuscles: [PrimaryMuscles.Chest],
    secondaryMuscles: [SecondaryMuscles.Triceps],
    instructions: ['instruction 1'],
    images: ['image 1'],
  },
  {
    id: '2',
    name: 'Exercise 2',
    category: Category.Cardio,
    force: Force.Pull,
    level: Level.Intermediate,
    mechanic: Mechanic.Isolation,
    equipment: Equipment.Dumbbell,
    primaryMuscles: [PrimaryMuscles.Biceps],
    secondaryMuscles: [SecondaryMuscles.Forearms],
    instructions: ['instruction 2'],
    images: ['image 2'],
  },
  {
    id: '3',
    name: 'Exercise 3',
    category: Category.Strength,
    force: Force.Push,
    level: Level.Beginner,
    mechanic: Mechanic.Compound,
    equipment: Equipment.Bands,
    primaryMuscles: [PrimaryMuscles.Chest, PrimaryMuscles.Shoulders],
    secondaryMuscles: [SecondaryMuscles.Triceps],
    instructions: ['instruction 3'],
    images: ['image 3'],
  },
];

const mockSuggestionsWithAddProps: SuggestionWithAddProps[] =
  mockSuggestions.map((suggestion) => ({
    ...suggestion,
    rating: 0,
  }));

describe('getRandomSuggestion', () => {
  beforeEach(() => {
    // Reset Math.random to its original implementation before each test
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should return undefined when no suggestions are provided', () => {
    const result = getRandomSuggestion({ suggestions: [] });
    expect(result).toBeUndefined();
  });

  it('should return a random suggestion from the provided suggestions', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const result = getRandomSuggestion({ suggestions: mockSuggestions });
    expect(result).toEqual(expect.objectContaining({ id: '1' }));
  });

  it('should apply filters correctly', () => {
    const result = getRandomSuggestion({
      suggestions: mockSuggestions,
      filters: {
        category: [Category.Cardio],
      },
    });
    expect(result?.category).toBe(Category.Cardio);
  });

  it('should apply weighting for liked suggestions', () => {
    const suggestionsWithPreferences = mockSuggestions;
    const preferences = {
      '1': true, // liked
    };

    // Mock Math.random to return different values in sequence
    const mockRandom = jest
      .fn()
      .mockReturnValueOnce(0.9) // This should select the weighted (duplicated) suggestion
      .mockReturnValueOnce(0.1); // This should select the original suggestion

    jest.spyOn(global.Math, 'random').mockImplementation(mockRandom);

    const result = getRandomSuggestion({
      suggestions: suggestionsWithPreferences,
      suggestionPreferences: preferences,
      weightedOptions: {
        weighted: true,
        weight: 2,
      },
    });

    expect(result).toBeDefined();
    expect(result?.id).toBe('1');
  });

  it('should exclude disliked suggestions when excludeDislikedSuggestions is true', () => {
    const preferences = {
      '1': false, // disliked
    };

    const result = getRandomSuggestion({
      suggestions: mockSuggestions,
      suggestionPreferences: preferences,
      excludeDislikedSuggestions: true,
    });

    expect(result?.id).not.toBe('1');
  });

  it('should throw error when weight is less than 2 with weighted option enabled', () => {
    expect(() => {
      getRandomSuggestion({
        suggestions: mockSuggestions,
        weightedOptions: {
          weighted: true,
          weight: 1,
        },
      });
    }).toThrow('Weight must be >= 2 when weighted is true');
  });

  it('should handle multiple filters simultaneously', () => {
    const result = getRandomSuggestion({
      suggestions: mockSuggestions,
      filters: {
        category: [Category.Strength],
        level: [Level.Beginner],
        force: [Force.Push],
      },
    });

    expect(result).toBeDefined();
    expect(result?.category).toBe(Category.Strength);
    expect(result?.level).toBe(Level.Beginner);
    expect(result?.force).toBe(Force.Push);
  });

  it('should work with suggestionsWithAddProps directly', () => {
    const result = getRandomSuggestion({
      suggestionsWithAddProps: mockSuggestionsWithAddProps,
    });

    expect(result).toBeDefined();
    expect(mockSuggestionsWithAddProps.map((s) => s.id)).toContain(result?.id);
  });

  it('should handle empty filters', () => {
    const result = getRandomSuggestion({
      suggestions: mockSuggestions,
      filters: {},
    });

    expect(result).toBeDefined();
    expect(mockSuggestions.map((s) => s.id)).toContain(result?.id);
  });

  it('should handle mechanic filter', () => {
    const result = getRandomSuggestion({
      suggestions: mockSuggestions,
      filters: {
        mechanic: [Mechanic.Compound],
      },
    });

    expect(result).toBeDefined();
    expect(result?.mechanic).toBe(Mechanic.Compound);
  });

  it('should handle equipment filter', () => {
    const result = getRandomSuggestion({
      suggestions: mockSuggestions,
      filters: {
        equipment: [Equipment.Barbell],
      },
    });

    expect(result).toBeDefined();
    expect(result?.equipment).toBe(Equipment.Barbell);
  });

  it('should handle primaryMuscles filter', () => {
    const result = getRandomSuggestion({
      suggestions: mockSuggestions,
      filters: {
        primaryMuscles: [PrimaryMuscles.Chest],
      },
    });

    expect(result).toBeDefined();
    expect(result?.primaryMuscles).toContain(PrimaryMuscles.Chest);
  });

  it('should handle secondaryMuscles filter', () => {
    const result = getRandomSuggestion({
      suggestions: mockSuggestions,
      filters: {
        secondaryMuscles: [SecondaryMuscles.Forearms],
      },
    });

    expect(result).toBeDefined();
    expect(result?.secondaryMuscles).toContain(SecondaryMuscles.Forearms);
  });

  it('should handle weighted options disabled', () => {
    const result = getRandomSuggestion({
      suggestions: mockSuggestions,
      weightedOptions: {
        weighted: false,
      },
    });

    expect(result).toBeDefined();
    expect(mockSuggestions.map((s) => s.id)).toContain(result?.id);
  });

  it('should handle excludeDislikedSuggestions disabled', () => {
    const preferences = {
      '1': false, // disliked
    };

    const results = new Set();
    // Run multiple times to increase chance of getting disliked suggestion
    Array.from({ length: 100 }).forEach(() => {
      const result = getRandomSuggestion({
        suggestions: mockSuggestions,
        suggestionPreferences: preferences,
        excludeDislikedSuggestions: false,
      });
      if (result) {
        results.add(result.id);
      }
    });

    expect(results.has('1')).toBe(true);
  });

  it('should handle empty suggestions array', () => {
    const result = getRandomSuggestion({
      suggestions: [],
    });

    expect(result).toBeUndefined();
  });

  it('should handle undefined options', () => {
    const result = getRandomSuggestion();

    expect(result).toBeDefined();
  });

  it('should handle undefined suggestionPreferences', () => {
    const result = getRandomSuggestion({
      suggestions: mockSuggestions,
    });

    expect(result).toBeDefined();
  });

  it('should handle undefined weightedOptions', () => {
    const result = getRandomSuggestion({
      suggestions: mockSuggestions,
    });

    expect(result).toBeDefined();
  });

  it('should handle undefined excludeDislikedSuggestions', () => {
    const result = getRandomSuggestion({
      suggestions: mockSuggestions,
    });

    expect(result).toBeDefined();
  });

  it('should handle undefined suggestionsWithAddProps', () => {
    const result = getRandomSuggestion();

    expect(result).toBeDefined();
  });

  it('should handle undefined suggestions', () => {
    const result = getRandomSuggestion({});

    expect(result).toBeDefined();
  });
});
