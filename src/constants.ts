import type { unitOfTime } from 'moment';
import { IPeriodicity } from './settings';

export const periodicities: IPeriodicity[] = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

/**
 * The moment unit that each periodicity spans. These match the units used by
 * obsidian-periodic-notes-provider, so that a period resolved here always
 * covers exactly the same span as the note the provider would create for it.
 */
export const periodicityUnits: Record<IPeriodicity, unitOfTime.StartOf> = {
  daily: 'day',
  weekly: 'week',
  monthly: 'month',
  quarterly: 'quarter',
  yearly: 'year',
};
