import {DateTime} from "luxon";
import {FormatOptions, IOpeningHours, WeekdayFormat} from "./types";
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
    #_hours: IOpeningHours;
    /** @ignore */
    #_timezone: string;
    /** @ignore */
    #_holidays: string[];
    /** @ignore */
    #_specialDays: IOpeningHours;

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
     * @param timezone the time zone of the entity
     * @param holidays=[] set of holidays in the format `YYYY-MM-DD`
     * @param specialDays={} table of days with special opening hours. The keys of this object
     *                                    must be in the form `YYYY-MM-DD`.
     */
    constructor(hours: IOpeningHours, timezone: string, holidays: string[] = [], specialDays: IOpeningHours = {}) {
        if (holidays?.some(this.#isInvalidDate) || Object.keys(specialDays).some(this.#isInvalidDate)) {
            throw Error("Invalid date keys in holidays or specialDays.");
        }

        const validKeys = (WEEKDAY_KEYS.concat(["hol"]));
        if (!Object.keys(hours).every(key => validKeys.includes(key))) {
            throw Error("Invalid key in hours object.");
        }

        this.#_hours = hours;
        this.#_timezone = timezone;
        this.#_holidays = holidays;
        this.#_specialDays = specialDays;
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
     * Folds the opening hours into a human readable string.
     *
     * @param formatOptions formatting options.
     * @see https://moment.github.io/luxon/docs/manual/intl.html
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
     */
    fold(formatOptions: FormatOptions = {}) {
        const {
            hyphen,
            delimiter,
            locale,
            weekdayFormat,
            holidayPrefix,
            timeFrameFormat,
            timeFrameDelimiter,
            closedPlaceholder,
        } = Object.assign({}, {
            hyphen: "\u202F\u2013\u202F",
            delimiter: ", ",
            locale: DEFAULT_LOCALE,
            weekdayFormat: WeekdayFormat.short,
            holidayPrefix: "Holidays",
            timeFrameFormat: "{start} to {end}",
            timeFrameDelimiter: " and ",
            closedPlaceholder: "Closed"
        }, formatOptions) as FormatOptions;

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

        return rangeStrings
            .filter(foldedDayRange => foldedDayRange.timeFrames.length > 0)
            .map(foldedDayRange => {
                return foldedDayRange.days + ": " +
                    _formatTimeFrames(
                        foldedDayRange.timeFrames,
                        // @ts-ignore
                        timeFrameFormat,
                        timeFrameDelimiter,
                        closedPlaceholder,
                    )
            }).join("\n") +  (
            Array.isArray(this.#_hours.hol) && this.#_hours.hol.length > 0
                    ? `\n${holidayPrefix}: ${_formatTimeFrames(
                        this.#_hours.hol,
                        // @ts-ignore
                        timeFrameFormat,
                        timeFrameDelimiter,
                        closedPlaceholder,
                    )}`
                    : ""
            );
    }
}
