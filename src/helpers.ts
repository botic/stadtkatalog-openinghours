import {DateTime, Interval} from "luxon";
import {FoldedSpecialDayRange, IOpeningHours, SpecialDateTimeFrames} from "./types";

export const WEEKDAY_KEYS = Object.freeze(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]) as string[];

/**
 * Helper function to determine if a DateTime is inside the given time frame.
 * @param ldt the DateTime object to check
 * @param startFrame {string} start of the time frame in the format "hh:mm"
 * @param endFrame {string} end of the time frame in the format "hh:mm"
 * @returns {boolean} true, if `ldt` is contained in the time frame; false otherwise
 * @private
 */
export function _isInTimeFrame(ldt: DateTime, startFrame: string, endFrame: string): boolean {
    const startTime = startFrame.split(":").map(frame => Number.parseInt(frame, 10));
    const endTime = endFrame.split(":").map(frame => Number.parseInt(frame, 10));

    const startDateTime = ldt.set({ hour: startTime[0], minute: startTime[1], second: 0, millisecond: 0 });
    const endDateTime = ldt.set({ hour: endTime[0], minute: endTime[1], second: 0, millisecond: 0 });

    return Interval.fromDateTimes(startDateTime, endDateTime).contains(ldt);
}

/**
 * @private
 */
export function _areOverlongTimeFrames(timeFrames?: string[]): boolean {
    // no opening hours defined
    if (!timeFrames) {
        return false;
    }

    // checks the trailing time frame to match a time string
    return /^(2[4-9]|[34]\d):\d{2}$/.test(timeFrames.slice(-1)[0]);
}

/**
 * @private
 */
export function _getAdditionalStartOfDayTimeFrames(overlongTimeFrames: string[]): string[] {
    if (overlongTimeFrames.length === 0) {
        return [];
    }

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
 * @private
 */
export function _createRangeBag(reducedTimeRange: number[]): { [propName: string]: number[] } {
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
 * @private
 */
export function _equalTimeFrames(a: string[] | undefined, b: string[] | undefined): boolean {
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
 * @private
 */
export function _findSimpleRanges(week: IOpeningHours): number[] {
    const reduced = [0];
    for (let i = 1; i < WEEKDAY_KEYS.length; i++) {
        let prevDay = week[WEEKDAY_KEYS[i - 1]],
            currDay = week[WEEKDAY_KEYS[i]];

        reduced[i] = (_equalTimeFrames(prevDay, currDay) ? reduced[i - 1] : i);
    }
    return reduced;
}

/**
 * @private
 */
export function _eliminateEqualRanges(week: IOpeningHours): number[] {
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
}

/**
 * @private
 */
export function _canFoldIntoDayRange(range: number[]): boolean {
    return range.every((dayNumber: number, idx: number, arr: number[]) => {
        return !idx || dayNumber === arr[idx - 1] || dayNumber === arr[idx - 1] + 1;
    })
}

/**
 * @private
 */
export function _foldSpecialDayRanges(specialDays: SpecialDateTimeFrames[]): FoldedSpecialDayRange[] {
    const ranges = [];

    let currentRangeStart: SpecialDateTimeFrames|null = null,
        currentRangeEnd: SpecialDateTimeFrames|null = null;
    for (const day of specialDays.sort((a, b) => a.dt.diff(b.dt).milliseconds)) {
        if (currentRangeEnd === null) {
            currentRangeStart = day;
            currentRangeEnd = day;
            continue;
        }

        if (
            _equalTimeFrames(day.timeFrames, currentRangeEnd.timeFrames) &&
            day.dt.diff(currentRangeEnd.dt, "days").days === 1
        ) {
            currentRangeEnd = day;
        } else {
            // end of a continuous range met
            ranges.push({
                start: currentRangeStart,
                end: currentRangeEnd,
            });
            currentRangeStart = day;
            currentRangeEnd = day;
        }
    }
    if (currentRangeStart !== null) {
        ranges.push({
            start: currentRangeStart,
            end: currentRangeEnd,
        });
    }

    return ranges.filter((x): x is FoldedSpecialDayRange => {
        return x.start !== null && x.end !== null
    });
}

/**
 * @private
 */
export function _formatTimeFrames(hours: string[], format: string, delimiter: string, placeholder: string): string {
    if (hours.length === 0) {
        return placeholder || "";
    }

    const frameStr = [];
    for (let i = 0; i < hours.length; i += 2) {
        const endTime = hours[i + 1].split(":").map(str => Number.parseInt(str, 10));
        if (endTime[0] > 24 || (endTime[0] === 24 && endTime[1] > 0)) {
            endTime[0] = endTime[0] - 24;
        }
        frameStr.push(
            format
                .replace("{start}", hours[i])
                .replace("{end}", `${String(endTime[0]).padStart(2, "0")}:${String(endTime[1]).padStart(2, "0")}`)
        );
    }

    return frameStr.join(delimiter);
}
