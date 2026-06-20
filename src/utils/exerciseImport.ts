import { ExerciseSetConfig } from "../types/ExerciseSetConfig";
import { DEFAULT_EXERCISE } from "../constants/defaultExercise.constants";

const parseNumber = (
  value: string | undefined,
  fallback: number
): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export const parseExercise = (
  line: string
): ExerciseSetConfig | null => {
  const parts = line
    .split(',')
    .map(part => part.trim());

  if (parts.length === 0 || !parts[0]) {
    return null;
  }

  const [
    exerciseLabel,
    exerciseWeight,
    numberOfSets,
    numberOfReps,
    restTime
  ] = parts;

  return {
    exerciseLabel,
    exerciseWeight: parseNumber(
      exerciseWeight,
      DEFAULT_EXERCISE.exerciseWeight
    ),
    numberOfSets: parseNumber(
      numberOfSets,
      DEFAULT_EXERCISE.numberOfSets
    ),
    numberOfReps: parseNumber(
      numberOfReps,
      DEFAULT_EXERCISE.numberOfReps
    ),
    restTime: parseNumber(
      restTime,
      DEFAULT_EXERCISE.restTime
    )
  };
};