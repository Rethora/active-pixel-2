import { SuggestionFilters } from './suggestion';

export interface Schedule {
  id: string;
  name: string;
  time: string; // cron expression e.g., '0 9 * * *' for 9 AM every day
  enabled: boolean;
  filters: SuggestionFilters;
}
