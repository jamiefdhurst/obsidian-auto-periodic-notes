import type { Moment } from 'moment';
import { moment } from 'obsidian';
import { periodicityUnits } from '../constants';
import type { ICreateOn, IPeriodicity } from '../settings';

const SUNDAY: number = 0;
const SATURDAY: number = 6;

/**
 * Resolves the day within the current period on which the note should be
 * created. Weekly periods follow the vault's configured week start, because
 * `startOf`/`endOf` use the same moment locale that the notes provider uses to
 * decide which week a note belongs to.
 *
 * @param periodicity - The note type being scheduled
 * @param createOn - Which day of the period was configured
 * @param now - The reference date, used to locate the current period
 * @returns The start of the day on which creation is due
 */
export function getCreationDate(
  periodicity: IPeriodicity,
  createOn: ICreateOn,
  now: Moment
): Moment {
  const unit = periodicityUnits[periodicity];

  if (createOn === 'last-day' || createOn === 'last-weekday') {
    const date: Moment = now.clone().endOf(unit).startOf('day');

    if (createOn === 'last-weekday') {
      while (date.day() === SATURDAY || date.day() === SUNDAY) {
        date.subtract(1, 'day');
      }
    }

    return date;
  }

  // Anything else, including settings saved before this option existed, keeps
  // the original behaviour of creating at the start of the period
  return now.clone().startOf(unit);
}

/**
 * Checks whether the current period's note is due to be created yet.
 *
 * Creation is due on the configured day and on any remaining day of the
 * period, so that a note is still created if the vault was not opened on the
 * day itself.
 *
 * @param periodicity - The note type being scheduled
 * @param createOn - Which day of the period was configured
 * @param now - The reference date, defaulting to the current date
 * @returns True if the note should be created now, false if it is too early
 */
export function isCreationDue(
  periodicity: IPeriodicity,
  createOn: ICreateOn,
  now: Moment = moment()
): boolean {
  return !now
    .clone()
    .startOf('day')
    .isBefore(getCreationDate(periodicity, createOn, now));
}
