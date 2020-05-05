import {DateTime, Interval} from "luxon";
import {IOpeningHours} from "./types";

export const WEEKDAY_KEYS = Object.freeze(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]) as string[];

/**
 * Helper function to determine if a DateTime is inside the given time frame.
 * @param ldt the DateTime object to check
 * @param startFrame {string} start of the time frame in the format "hh:mm"
 * @param endFrame {string} end of the time frame in the format "hh:mm"
 * @returns {boolean} true, if `ldt` is contained in the time frame; false otherwise
 * @private
 */
export function _isInTimeFrame(ldt: DateTime, startFrame: string, endFrame: string) {
    const startTime = startFrame.split(":").map(frame => Number.parseInt(frame, 10));
    const endTime = endFrame.split(":").map(frame => Number.parseInt(frame, 10));

    const startDateTime = ldt.set({ hour: startTime[0], minute: startTime[1], second: 0, millisecond: 0 });
    const endDateTime = ldt.set({ hour: endTime[0], minute: endTime[1], second: 0, millisecond: 0 });

    return Interval.fromDateTimes(startDateTime, endDateTime).contains(ldt);
}

/**
 *
 * @param timeFrames
 * @private
 */
export function _areOverlongTimeFrames(timeFrames?: string[]) {
    // no opening hours defined
    if (!timeFrames) {
        return false;
    }

    // checks the trailing time frame to match a time string
    return /^(2[4-9]|[34]\d):\d{2}$/.test(timeFrames.slice(-1)[0]);
}

/**
 *
 * @param overlongTimeFrames
 * @private
 */
export function _getAdditionalStartOfDayTimeFrames(overlongTimeFrames: string[]) {
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
 *
 * @param reducedTimeRange
 * @private
 */
export function _createRangeBag(reducedTimeRange: number[]) {
    const rangeBag = {} as {
        [propName: string]: number[];
    };

    reducedTimeRange.forEach(function(rangeNumber, index) {
        const slot = String(rangeNumber);
        if (!rangeBag[slot]) {
            rangeBag[slot] = [index];
        } else {
            rangeBag[slot].push(index);
        }
    });

    return rangeBag;
}

/**
 *
 * @param a
 * @param b
 * @private
 */
export function _equalTimeFrames(a: string[] | undefined, b: string[] | undefined) {
    if (!a || !b || a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

/**
 *
 * @param week
 * @private
 */
export function _findSimpleRanges(week: IOpeningHours) {
    const reduced = [0];
    for (let i = 1; i < WEEKDAY_KEYS.length; i++) {
        let prevDay = week[WEEKDAY_KEYS[i - 1]],
            currDay = week[WEEKDAY_KEYS[i]];

        reduced[i] = (_equalTimeFrames(prevDay, currDay) ? reduced[i - 1] : i);
    }
    return reduced;
}

export function _eliminateEqualRanges(week: IOpeningHours) {
    const weekRanges = _findSimpleRanges(week);
    const dedupedRanges = [];
    for (let i = weekRanges.length - 1; i >= 0; i--) {
        let lowestMatchingRange = -1;

        for (let u = 0; u < i && lowestMatchingRange < 0; u++) {
            if (_equalTimeFrames(week[WEEKDAY_KEYS[u]], week[WEEKDAY_KEYS[i]])) {
                lowestMatchingRange = u;
            }
        }

        dedupedRanges[i] = (lowestMatchingRange >= 0 ? lowestMatchingRange : weekRanges[i]);
    }

    return dedupedRanges;
};

export function _canFoldIntoDayRange(range: number[]) {
    return range.every((dayNumber: number, idx: number, arr: number[]) => {
        return !idx || dayNumber === arr[idx - 1] || dayNumber === arr[idx - 1] + 1;
    })
}

export function _formatTimeFrames(hours: string[], format: string, delimiter: string, placeholder: string = "Geschlossen") {
    if (hours.length === 0) {
        return placeholder || "";
    }

    const frameStr = [];
    for (let i = 0; i < hours.length; i += 2) {
        frameStr.push(
            format.replace("{start}", hours[i]).replace("{end}", hours[i + 1] || "max. 24:00")
        );
    }

    return frameStr.join(delimiter);
}
