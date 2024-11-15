export interface ProductivityPeriod {
  startTime: string;
  endTime: string;
  activePercentage: number;
}

export interface ProductivityHistory {
  periods: ProductivityPeriod[];
  lastResetDate: string;
}
