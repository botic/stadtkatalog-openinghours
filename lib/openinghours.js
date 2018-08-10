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

class OpeningHours {
    constructor(hours, timeZone, holidays) {
        this.hours = hours;
        this.timeZone = timeZone;
        this.holidays = holidays || [];
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

        const prevDayTimeFrames = this.hours[prevDayKey];

        // no opening hours defined for the previous weekday
        if (!Array.isArray(prevDayTimeFrames)) {
            return null;
        }

        // checks the trailing time frame to match a time string
        return /^(2[4-9]|[34]\d):\d{2}$/.test(prevDayTimeFrames.slice(-1))
            ? prevDayKey
            : null;
    }

    isOpenAt(date) {
        const normalizedDT = DateTime.fromJSDate(date).setZone(this.timeZone);

        const precedingWeekdayKey = this.getOverlongPrecedingWeekdayKey(date);
        const currentWeekdayKey = OpeningHours.weekdayToWeekdayKey(normalizedDT.weekday);

        const timeFrames = this.hours[currentWeekdayKey] || [];

        // overflowing time frame detected, so add it to the set of time frames
        if (precedingWeekdayKey !== null) {
            const overflowingHours = this.hours[precedingWeekdayKey]
                .slice(-1)
                .split(":")
                .map(part => Number.parseInt(part, 10));

            // "24:00" has no effect on our current calculation, so only consider overflowing hours
            if (overflowingHours[0] > 24 || (overflowingHours[0] === 24 && overflowingHours[1] > 0)) {
                timeFrames.push(
                    "00:00",
                    `${overflowingHours[0] - 24}`.padStart(2, "0") + `:${overflowingHours[1]}`.padStart(2, "0")
                );
            }
        }

        // check if at least one time frame is overlapping and therefore the state must be "open"
        for (let i = 0; i < timeFrames.length; i += 2) {
            if (_isInTimeFrame(normalizedDT, timeFrames[i], timeFrames[i + 1])) {
                return true;
            }
        }

        return false;
    }
}

module.exports = OpeningHours;
