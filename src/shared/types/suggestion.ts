export enum Force {
  Static = 'static',
  Pull = 'pull',
  Push = 'push',
  None = 'none', // Replace null with 'none'
}

export enum Level {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Expert = 'expert',
}

export enum Mechanic {
  Isolation = 'isolation',
  Compound = 'compound',
  None = 'none', // Replace null with 'none'
}

export enum Equipment {
  MedicineBall = 'medicine ball',
  Dumbbell = 'dumbbell',
  BodyOnly = 'body only',
  Bands = 'bands',
  Kettlebells = 'kettlebells',
  FoamRoll = 'foam roll',
  Cable = 'cable',
  Machine = 'machine',
  Barbell = 'barbell',
  ExerciseBall = 'exercise ball',
  EZCurlBar = 'e-z curl bar',
  Other = 'other',
  None = 'none', // Replace null with 'none'
}

export enum PrimaryMuscles {
  Abdominals = 'abdominals',
  Abductors = 'abductors',
  Biceps = 'biceps',
  Calves = 'calves',
  Chest = 'chest',
  Forearms = 'forearms',
  Glutes = 'glutes',
  Hamstrings = 'hamstrings',
  Lats = 'lats',
  LowerBack = 'lower back',
  MiddleBack = 'middle back',
  Neck = 'neck',
  Quadriceps = 'quadriceps',
  Shoulders = 'shoulders',
  Traps = 'traps',
  Triceps = 'triceps',
}

export enum SecondaryMuscles {
  Abdominals = 'abdominals',
  Abductors = 'abductors',
  Biceps = 'biceps',
  Calves = 'calves',
  Chest = 'chest',
  Forearms = 'forearms',
  Glutes = 'glutes',
  Hamstrings = 'hamstrings',
  Lats = 'lats',
  LowerBack = 'lower back',
  MiddleBack = 'middle back',
  Neck = 'neck',
  Quadriceps = 'quadriceps',
  Shoulders = 'shoulders',
  Traps = 'traps',
  Triceps = 'triceps',
}

export enum Category {
  Powerlifting = 'powerlifting',
  Strength = 'strength',
  Stretching = 'stretching',
  Cardio = 'cardio',
  OlympicWeightlifting = 'olympic weightlifting',
  Strongman = 'strongman',
  Plyometrics = 'plyometrics',
}

export interface Suggestion {
  id: string;
  name: string;
  force: Force;
  level: Level;
  mechanic: Mechanic;
  equipment: Equipment;
  primaryMuscles: PrimaryMuscles[];
  secondaryMuscles: SecondaryMuscles[];
  instructions: string[];
  category: Category;
  images: string[];
}

export interface SuggestionFilters {
  force?: Force[];
  level?: Level[];
  mechanic?: Mechanic[];
  equipment?: Equipment[];
  primaryMuscles?: PrimaryMuscles[];
  secondaryMuscles?: SecondaryMuscles[];
  category?: Category[];
}

export type SuggestionFilterKey = keyof SuggestionFilters;
