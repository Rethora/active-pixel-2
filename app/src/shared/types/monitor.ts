export type ProductivityPeriodType = 'unproductive' | 'tooLong';

export interface ProductivityPeriod {
  startTime: string;
  endTime: string;
  activePercentage: number;
  type: ProductivityPeriodType;
}

export interface ProductivityHistory {
  periods: ProductivityPeriod[];
  lastResetDate: string;
}
