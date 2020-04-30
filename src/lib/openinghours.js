"use strict";

const {
    DateTime,
    Interval
} = require("luxon");

/**
 * Helper function to determine if a DateTime is inside the given time frame.
 * @param ldt the DateTime object to check
 * @param startFrame {string} start of the time frame in the format "hh:mm"
 * @param endFrame {string} end of the time frame in the format "hh:mm"
 * @returns {boolean} true, if `ldt` is contained in the time frame; false otherwise
 * @private
 */
function _isInTimeFrame(ldt, startFrame, endFrame) {
    const startTime = startFrame.split(":").map(frame => Number.parseInt(frame, 10));
    const endTime = endFrame.split(":").map(frame => Number.parseInt(frame, 10));

    const startDateTime = ldt.set({ hour: startTime[0], minute: startTime[1], second: 0, millisecond: 0 });
    const endDateTime = ldt.set({ hour: endTime[0], minute: endTime[1], second: 0, millisecond: 0 });

    return Interval.fromDateTimes(startDateTime, endDateTime).contains(ldt);
}

function _areOverlongTimeFrames(timeFrames) {
    // no opening hours defined
    if (!Array.isArray(timeFrames)) {
        return false;
    }

    // checks the trailing time frame to match a time string
    return /^(2[4-9]|[34]\d):\d{2}$/.test(timeFrames.slice(-1));
}

function _getAdditionalStartOfDayTimeFrames(overlongTimeFrames) {
    const overflowingHours = overlongTimeFrames
        .slice(-1)[0]
        .split(":")
        .map(part => Number.parseInt(part, 10));

    // "24:00" has no effect on our current calculation, so only consider overflowing hours
    if (overflowingHours[0] > 24 || (overflowingHours[0] === 24 && overflowingHours[1] > 0)) {
        return[
            "00:00",
            `${overflowingHours[0] - 24}`.padStart(2, "0") + ":" + `${overflowingHours[1]}`.padStart(2, "0")
        ];
    }

    return [];
}

/**
 * An OpeningHours instance is a data structure representing the opening hours of an entity. It provides methods to
 * check if the entity is open or closed at a given date time.
 */
class OpeningHours {
    /**
     * Creates a new instance with the given opening hours in the specified time zone.
     * @param {Object} hours - contains the opening hours for each day. If a weekday key is not defined, the opening
     *                         hours on this particular day are unknown. If a weekday key references an empty array `[]`,
     *                         the entity is closed on this day. In all other cases a weekday key references an array
     *                         with multiple time frames in the format `["hh:mm", "hh:mm", ...]`.
     * @param {string[]} hours.mon - the opening hours on Monday
     * @param {string[]} hours.tue - the opening hours on Tuesday
     * @param {string[]} hours.wed - the opening hours on Wednesday
     * @param {string[]} hours.thu - the opening hours on Thursday
     * @param {string[]} hours.fri - the opening hours on Friday
     * @param {string[]} hours.sat - the opening hours on Saturday
     * @param {string[]} hours.sun - the opening hours on Sunday
     * @param {string[]} hours.hol - the opening hours on a holiday
     * @param {string} timeZone - the time zone of the entity
     * @param {string[]} [holidays=[]] - set of holidays in the format `YYYY-MM-DD`
     * @param {Object} [specialDays={}] - table of days with special opening hours. The keys of this object
     *                                    must be in the form `YYYY-MM-DD`.
     */
    constructor(hours, timeZone, holidays, specialDays) {
        this.hours = hours;
        this.timeZone = timeZone;
        this.holidays = holidays || [];
        this.specialDays = specialDays || {};

        // fixme: add checks that everything was in the right format
    }

    /**
     * Returns the shorthand name for the given weekday.
     * @param weekday 1 is Monday and 7 is Sunday
     * @returns {string} three letter weekday key
     */
    static weekdayToWeekdayKey(weekday) {
        switch(weekday) {
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
    isSpecialDay(dateStr) {
        return Object.keys(this.specialDays).indexOf(dateStr) >= 0;
    }

    /**
     * Checks if the given date string is on a holiday for the `OpeningHours` instance.
     * @param dateStr the date in the format `YYYY-MM-DD`
     * @returns {boolean} `true` if holiday, `false` otherwise
     */
    isHoliday(dateStr) {
        return this.holidays.indexOf(dateStr) >= 0;
    }

    /**
     * Checks if the preceding day is overlong and returns the weekday key of this overlong day.
     * An overlong day ends after 23:59 hours and continues into the following one,
     * e.g. if the business hours are on Friday from 10:00 - 04:00; or in a 24/7 shop from 00:00 - 24:00.
     * @param date JavaScript date
     * @returns {string} the preceding three-letter weekday key; or `null` if no overlong preceding day found
     */
    getOverlongPrecedingWeekdayKey(date) {
        const ldt = DateTime.fromJSDate(date).setZone(this.timeZone);
        const yesterday = ldt.plus({ days: -1 });
        const prevDayKey = this.isHoliday(yesterday.toFormat("yyyy-LL-dd"))
            ? "hol"
            : OpeningHours.weekdayToWeekdayKey(yesterday.weekday);

        return _areOverlongTimeFrames(this.hours[prevDayKey]) ? prevDayKey : null;
    }

    /**
     * Checks if the instance is open at the given date.
     * @param date {Object} JavaScript Date instance
     * @returns {boolean} true if the instance is open, false otherwise
     */
    isOpenAt(date) {
        const dayDT = DateTime.fromJSDate(date).setZone(this.timeZone);
        const precedingDayDT = dayDT.plus({ days: -1 });

        const dayFormatStr = dayDT.toFormat("yyyy-LL-dd");
        const precedingDayFormatStr = precedingDayDT.toFormat("yyyy-LL-dd");

        const timeFrames = this.isSpecialDay(dayFormatStr)
            ? this.specialDays[dayFormatStr].slice(0)
            : (this.hours[OpeningHours.weekdayToWeekdayKey(dayDT.weekday)] || []).slice(0);

        if (this.isSpecialDay(precedingDayFormatStr)) {
            timeFrames.push(..._getAdditionalStartOfDayTimeFrames(this.specialDays[precedingDayFormatStr]));
        } else {
            // overflowing time frame detected, so add it to the set of time frames
            const precedingWeekdayKey = this.getOverlongPrecedingWeekdayKey(date);
            if (precedingWeekdayKey !== null) {
                timeFrames.push(..._getAdditionalStartOfDayTimeFrames(this.hours[precedingWeekdayKey]));
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
}

module.exports = OpeningHours;
