import { moment } from 'obsidian';
import { getCreationDate, isCreationDue } from '../../notes/schedule';
import type { ICreateOn, IPeriodicity } from '../../settings';

jest.mock('obsidian');

const at = (date: string) => moment(date);

describe('Notes Schedule', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getCreationDate', () => {
    it.each<[IPeriodicity, ICreateOn, string, string]>([
      // First day of the period is unchanged from the original behaviour
      ['monthly', 'first-day', '2026-08-17', '2026-08-01'],
      ['quarterly', 'first-day', '2026-08-17', '2026-07-01'],
      ['yearly', 'first-day', '2026-08-17', '2026-01-01'],

      // Last day of the period
      ['monthly', 'last-day', '2026-08-17', '2026-08-31'],
      ['quarterly', 'last-day', '2026-08-17', '2026-09-30'],
      ['yearly', 'last-day', '2026-08-17', '2026-12-31'],
      ['monthly', 'last-day', '2026-02-10', '2026-02-28'],

      // Last weekday steps back over a weekend, and stays put otherwise.
      // August 2026 ends on a Monday, so both resolve to the 31st
      ['monthly', 'last-weekday', '2026-08-17', '2026-08-31'],
      // May 2026 ends on a Sunday, so it steps back to Friday the 29th
      ['monthly', 'last-weekday', '2026-05-10', '2026-05-29'],
      // October 2026 ends on a Saturday, stepping back to Friday the 30th
      ['monthly', 'last-weekday', '2026-10-10', '2026-10-30'],
      ['yearly', 'last-weekday', '2026-08-17', '2026-12-31'],
    ])('resolves %s notes set to %s from %s as %s', (periodicity, createOn, now, expected) => {
      expect(getCreationDate(periodicity, createOn, at(now)).format('YYYY-MM-DD')).toBe(expected);
    });

    it('resolves weekly notes against a Monday week start', () => {
      // Wednesday 2026-08-19, in a week running Monday to Sunday
      const now = at('2026-08-19').locale('en-gb');

      expect(getCreationDate('weekly', 'first-day', now).format('dddd YYYY-MM-DD')).toBe(
        'Monday 2026-08-17'
      );
      expect(getCreationDate('weekly', 'last-weekday', now).format('dddd YYYY-MM-DD')).toBe(
        'Friday 2026-08-21'
      );
      expect(getCreationDate('weekly', 'last-day', now).format('dddd YYYY-MM-DD')).toBe(
        'Sunday 2026-08-23'
      );
    });

    it('resolves weekly notes against a Sunday week start', () => {
      // The same Wednesday, in a week running Sunday to Saturday
      const now = at('2026-08-19').locale('en');

      expect(getCreationDate('weekly', 'first-day', now).format('dddd YYYY-MM-DD')).toBe(
        'Sunday 2026-08-16'
      );
      expect(getCreationDate('weekly', 'last-weekday', now).format('dddd YYYY-MM-DD')).toBe(
        'Friday 2026-08-21'
      );
      expect(getCreationDate('weekly', 'last-day', now).format('dddd YYYY-MM-DD')).toBe(
        'Saturday 2026-08-22'
      );
    });

    it('falls back to the first day for settings saved before the option existed', () => {
      expect(
        getCreationDate('monthly', undefined as unknown as ICreateOn, at('2026-08-17')).format(
          'YYYY-MM-DD'
        )
      ).toBe('2026-08-01');
    });

    it('does not mutate the date it is given', () => {
      const now = at('2026-08-17');
      getCreationDate('monthly', 'last-day', now);

      expect(now.format('YYYY-MM-DD')).toBe('2026-08-17');
    });
  });

  describe('isCreationDue', () => {
    it('is always due when set to the first day of the period', () => {
      expect(isCreationDue('monthly', 'first-day', at('2026-08-01'))).toBe(true);
      expect(isCreationDue('monthly', 'first-day', at('2026-08-17'))).toBe(true);
      expect(isCreationDue('monthly', 'first-day', at('2026-08-31'))).toBe(true);
    });

    it('holds back a monthly note until the last day of the month', () => {
      expect(isCreationDue('monthly', 'last-day', at('2026-08-01'))).toBe(false);
      expect(isCreationDue('monthly', 'last-day', at('2026-08-30'))).toBe(false);
      expect(isCreationDue('monthly', 'last-day', at('2026-08-31'))).toBe(true);
    });

    it('is due at any point on the configured day, not only at midnight', () => {
      expect(isCreationDue('monthly', 'last-day', at('2026-08-31T23:30:00'))).toBe(true);
      expect(isCreationDue('monthly', 'last-day', at('2026-08-31T00:00:00'))).toBe(true);
    });

    it('remains due for the rest of the period once the configured day has passed', () => {
      // May 2026 ends on a Sunday, so the last weekday is Friday the 29th
      expect(isCreationDue('monthly', 'last-weekday', at('2026-05-28'))).toBe(false);
      expect(isCreationDue('monthly', 'last-weekday', at('2026-05-29'))).toBe(true);
      expect(isCreationDue('monthly', 'last-weekday', at('2026-05-30'))).toBe(true);
      expect(isCreationDue('monthly', 'last-weekday', at('2026-05-31'))).toBe(true);
    });

    it('holds back quarterly and yearly notes until the end of their period', () => {
      expect(isCreationDue('quarterly', 'last-day', at('2026-08-17'))).toBe(false);
      expect(isCreationDue('quarterly', 'last-day', at('2026-09-30'))).toBe(true);
      expect(isCreationDue('yearly', 'last-day', at('2026-09-30'))).toBe(false);
      expect(isCreationDue('yearly', 'last-day', at('2026-12-31'))).toBe(true);
    });

    it('defaults to the current date', () => {
      jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-08-17T12:00:00Z').getTime());

      expect(isCreationDue('monthly', 'first-day')).toBe(true);
      expect(isCreationDue('monthly', 'last-day')).toBe(false);
    });
  });
});
