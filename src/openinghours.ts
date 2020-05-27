import {DateTime} from "luxon";
import {FormatOptions, IOpeningHours, RangeTimeSpan, RangeType, WeekdayFormat} from "./types";
import {
    _areOverlongTimeFrames,
    _canFoldIntoDayRange,
    _createRangeBag,
    _eliminateEqualRanges,
    _formatTimeFrames,
    _getAdditionalStartOfDayTimeFrames,
    _isInTimeFrame,
    WEEKDAY_KEYS
} from "./helpers";

const DEFAULT_LOCALE = Intl.DateTimeFormat().resolvedOptions().locale;

/**
 * Stores opening hours and provides methods to work with them.
 * @see https://docs.stadtkatalog.org/
 */
export class OpeningHours {
    /** @ignore */
    #_timezone: string;
    /** @ignore */
    #_holidays: string[];
    /** @ignore */
    #_hours = {} as IOpeningHours;
    /** @ignore */
    #_specialDays = {} as IOpeningHours;

    get timezone(): string {
        return this.#_timezone;
    }

    get specialDays(): IOpeningHours {
        return this.#_specialDays;
    }

    get holidays(): string[] {
        return this.#_holidays;
    }

    get hours(): IOpeningHours {
        return this.#_hours;
    }

    /** @ignore */
    #isInvalidDate = (date: string): boolean => {
        const dt = DateTime.fromFormat(date, "yyyy-MM-dd");
        return !dt.isValid;
    }

    /**
     * Creates a new instance with the given opening hours in the specified time zone.
     * @param hours contains the opening hours for each day. If a weekday key is not defined, the opening
     *        hours on this particular day are unknown. If a weekday key references an empty array `[]`,
     *        the entity is closed on this day. In all other cases a weekday key references an array
     *        with multiple time frames in the format `["hh:mm", "hh:mm", ...]`.
     *        Special days must be in the form `YYYY-MM-DD`
     * @param timezone the time zone of the entity
     * @param holidays=[] set of holidays in the format `YYYY-MM-DD`
     */
    constructor(hours: IOpeningHours, timezone: string, holidays: string[] = []) {
        if (holidays?.some(this.#isInvalidDate)) {
            throw Error("Invalid date keys in holidays or specialDays.");
        }

        const validKeys = (WEEKDAY_KEYS.concat(["hol"]));
        for (const key of Object.keys(hours)) {
            if (validKeys.includes(key)) {
                this.#_hours [key] = hours[key];
            } else {
                if (this.#isInvalidDate(key)) {
                    throw Error(`Invalid key '${key}' in hours object.`);
                } else {
                    this.#_specialDays[key] = hours[key];
                }
            }
        }

        this.#_timezone = timezone;
        this.#_holidays = holidays;
    }

    /**
     * Returns the shorthand name for the given weekday.
     * @param weekday 1 is Monday and 7 is Sunday
     * @returns {string} three letter weekday key
     */
    static weekdayToWeekdayKey(weekday: number) {
        switch (weekday) {
            case 1: return "mon";
            case 2: return "tue";
            case 3: return "wed";
            case 4: return "thu";
            case 5: return "fri";
            case 6: return "sat";
            case 7: return "sun";
        }

        throw new Error(`Invalid weekday index: ${weekday}`);
    }

    /**
     * Checks if the given date string is on a day with special opening hours.
     * @param dateStr the date in the format `YYYY-MM-DD`
     * @returns {boolean} `true` if holiday, `false` otherwise
     */
    isSpecialDay(dateStr: string) {
        return Object.keys(this.#_specialDays).indexOf(dateStr) >= 0;
    }

    /**
     * Checks if the given date string is on a holiday for the `IOpeningHours` instance.
     * @param dateStr the date in the format `YYYY-MM-DD`
     * @returns {boolean} `true` if holiday, `false` otherwise
     */
    isHoliday(dateStr: string) {
        return this.#_holidays.indexOf(dateStr) >= 0;
    }

    /**
     * Checks if the preceding day is overlong and returns the weekday key of this overlong day.
     * An overlong day ends after 23:59 hours and continues into the following one,
     * e.g. if the business hours are on Friday from 10:00 - 04:00; or in a 24/7 shop from 00:00 - 24:00.
     * @param date JavaScript date
     * @returns {string} the preceding three-letter weekday key; or `null` if no overlong preceding day found
     */
    getOverlongPrecedingWeekdayKey(date: Date) {
        const ldt = DateTime.fromJSDate(date).setZone(this.#_timezone);
        const yesterday = ldt.plus({ days: -1 });
        const prevDayKey = this.isHoliday(yesterday.toFormat("yyyy-LL-dd"))
            ? "hol"
            : OpeningHours.weekdayToWeekdayKey(yesterday.weekday);

        return _areOverlongTimeFrames(this.#_hours[prevDayKey]) ? prevDayKey : null;
    }

    /**
     * Returns true if the opening hours represented by the instance are unknown.
     */
    isUnknown() {
        return Object.keys(this.#_hours).length === 0 && Object.keys(this.#_specialDays).length === 0;
    }

    /**
     * Checks if the instance is open at the given date.
     * @param date {Object} JavaScript Date instance
     * @returns {boolean} true if the instance is open, false otherwise
     */
    isOpenAt(date: Date) {
        const dayDT = DateTime.fromJSDate(date).setZone(this.#_timezone);
        const precedingDayDT = dayDT.plus({ days: -1 });

        const dayFormatStr = dayDT.toFormat("yyyy-LL-dd");
        const precedingDayFormatStr = precedingDayDT.toFormat("yyyy-LL-dd");

        const timeFrames = this.isSpecialDay(dayFormatStr)
            // @ts-ignore slice(0) can never fail since its checked before
            ? this.#_specialDays[dayFormatStr].slice(0)
            : (this.#_hours[OpeningHours.weekdayToWeekdayKey(dayDT.weekday)] || []).slice(0);

        if (this.isSpecialDay(precedingDayFormatStr)) {
            const tfs = this.#_specialDays[precedingDayFormatStr];
            if (tfs) {
                timeFrames.push(..._getAdditionalStartOfDayTimeFrames(tfs));
            }
        } else {
            // overflowing time frame detected, so add it to the set of time frames
            const precedingWeekdayKey = this.getOverlongPrecedingWeekdayKey(date);
            if (precedingWeekdayKey !== null) {
                const tfs = this.#_hours[precedingWeekdayKey];
                if (tfs) {
                    timeFrames.push(..._getAdditionalStartOfDayTimeFrames(tfs));
                }
            }
        }

        // check if at least one time frame is overlapping and therefore the state must be "open"
        for (let i = 0; i < timeFrames.length; i += 2) {
            if (_isInTimeFrame(dayDT, timeFrames[i], timeFrames[i + 1])) {
                return true;
            }
        }

        return false;
    }

    /**
     * Reduces the opening hours into an array of so-called `RangeTimeSpan` elements.
     * All elements in the array are in the most compact form possible. Consecutive matching time ranges will be merged
     * into a single elements with a day range as weekday string.
     *
     * @param formatOptions formatting options.
     * @see https://moment.github.io/luxon/docs/manual/intl.html
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
     */
    reduce(formatOptions: FormatOptions = {}): RangeTimeSpan[] {
        const {
            hyphen,
            delimiter,
            locale,
            weekdayFormat,
            holidayPrefix,
            timeFrameFormat,
            timeFrameDelimiter,
            closedPlaceholder,
            specialDates,
        } = Object.assign({}, {
            hyphen: "\u202F\u2013\u202F",
            delimiter: ", ",
            locale: DEFAULT_LOCALE,
            weekdayFormat: WeekdayFormat.short,
            holidayPrefix: "Holidays",
            timeFrameFormat: "{start} to {end}",
            timeFrameDelimiter: " and ",
            closedPlaceholder: "Closed",
            specialDates: {
                format: "yyyy-MM-dd",
                from: undefined,
                to: undefined,
            }

        }, formatOptions) as FormatOptions;

        // type guard for potential undefined values in user-provided options
        if (holidayPrefix === undefined || timeFrameDelimiter === undefined || timeFrameFormat === undefined || closedPlaceholder === undefined) {
            throw new TypeError(`Invalid options object: format options cannot use undefined as value.`);
        }

        const reducedTimeRange = _eliminateEqualRanges(this.#_hours);
        const someMonday = DateTime
            .utc(2020, 5, 4)
            .setLocale(locale ?? DEFAULT_LOCALE);

        const shortWeekdays = [
            someMonday.toLocaleString({ weekday: weekdayFormat }),
            someMonday.plus({ days: 1 }).toLocaleString({ weekday: weekdayFormat }),
            someMonday.plus({ days: 2 }).toLocaleString({ weekday: weekdayFormat }),
            someMonday.plus({ days: 3 }).toLocaleString({ weekday: weekdayFormat }),
            someMonday.plus({ days: 4 }).toLocaleString({ weekday: weekdayFormat }),
            someMonday.plus({ days: 5 }).toLocaleString({ weekday: weekdayFormat }),
            someMonday.plus({ days: 6 }).toLocaleString({ weekday: weekdayFormat }),
        ];

        const rangeStrings = [] as { days: string; timeFrames: string[] }[];

        const rangeBag = _createRangeBag(reducedTimeRange);
        Object.keys(rangeBag).sort().map(numStr => {
            const rangeNumber = Number(numStr);
            const bagOfDays = rangeBag[rangeNumber];

            if (_canFoldIntoDayRange(bagOfDays) && bagOfDays.length > 1) {
                rangeStrings.push({
                    days: shortWeekdays[bagOfDays[0]] + hyphen + shortWeekdays[bagOfDays.slice(-1)[0]],
                    timeFrames: this.#_hours[WEEKDAY_KEYS[rangeNumber]] || []
                });
            } else {
                rangeStrings.push({
                    days: bagOfDays.map(function(dayIndex) {
                        return shortWeekdays[dayIndex];
                    }).join(delimiter),
                    timeFrames: this.#_hours[WEEKDAY_KEYS[rangeNumber]] || []
                });
            }
        });

        const reducedHours = rangeStrings.filter(foldedDayRange => foldedDayRange.timeFrames.length > 0)
            .map(foldedDayRange => {
                return {
                    type: RangeType.weekday,
                    range: foldedDayRange.days,
                    timespan: _formatTimeFrames(
                        foldedDayRange.timeFrames,
                        timeFrameFormat,
                        timeFrameDelimiter,
                        closedPlaceholder,
                    ),
                };
            });

        if (Array.isArray(this.#_hours.hol)) {
            reducedHours.push({
                type: RangeType.holiday,
                range: holidayPrefix,
                timespan: _formatTimeFrames(
                    this.#_hours.hol,
                    timeFrameFormat,
                    timeFrameDelimiter,
                    closedPlaceholder,
                )
            });
        }

        Object.keys(this.#_specialDays)
            .map(date => {
                return {
                    date,
                    dt: DateTime.fromFormat(date, "yyyy-MM-dd", {
                        zone: this.#_timezone
                    }),
                    timeFrames: this.#_specialDays[date]
                };
            })
            .filter(({ dt, timeFrames}) => {
                if (!dt.isValid) {
                    return false;
                }

                const from = DateTime
                    .fromJSDate(specialDates?.from || new Date())
                    .startOf("day")
                    .setZone(this.#_timezone);
                if (dt.toSeconds() < from.toSeconds()) {
                    return false;
                }

                if (specialDates?.to instanceof Date) {
                    const to = DateTime
                        .fromJSDate(specialDates.to)
                        .endOf("day")
                        .setZone(this.#_timezone);
                    if (dt.toSeconds() > to.toSeconds()) {
                        return false;
                    }
                }

                return true;
            })
            .sort((a, b) => a.dt.toMillis() - b.dt.toMillis())
            .map(({date, dt, timeFrames}) => [
                dt.toFormat(specialDates?.format || "yyyy-MM-dd"),
                _formatTimeFrames(
                    timeFrames || [],
                    timeFrameFormat,
                    timeFrameDelimiter,
                    closedPlaceholder,
                )
            ])
            .forEach(val => reducedHours.push({
                type: RangeType.special,
                range: val[0],
                timespan: val[1],
            }));

        return reducedHours;
    }

    /**
     * Folds the opening hours into a human readable string.
     *
     * @param formatOptions formatting options.
     * @param separator the string to separate adjacent range timespans.
     * @see https://moment.github.io/luxon/docs/manual/intl.html
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
     */
    fold(formatOptions: FormatOptions = {}, separator = "\n"): string {
        return this
            .reduce(formatOptions)
            .map(rangeTimeSpan => `${rangeTimeSpan.range}: ${rangeTimeSpan.timespan}`)
            .join(separator);
    }
}
