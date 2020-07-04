import {_foldSpecialDayRanges} from "../src/helpers";
import {DateTime} from "luxon";
import {SpecialDateTimeFrames} from "../src/types";

function createRange(date: string, timeFrames: string[]): SpecialDateTimeFrames {
    return {
        dt: DateTime.fromISO(`${date}T00:00:00.000Z`),
        timeFrames
    };
}

test("test triple day range", () => {
    expect(_foldSpecialDayRanges([
        createRange("2020-05-01", ["10:00", "12:00"]),
        createRange("2020-05-02", ["10:00", "12:00"]),
        createRange("2020-10-01", []),
    ])).toStrictEqual([
        {
            start: createRange("2020-05-01", ["10:00", "12:00"]),
            end: createRange("2020-05-02", ["10:00", "12:00"]),
        },
        {
            start: createRange("2020-10-01", []),
            end: createRange("2020-10-01", []),
        },
    ]);
});

test("test simple day ranges", () => {
    // empty must stay empty
    expect(_foldSpecialDayRanges([])).toStrictEqual([]);

    // single day must return same start and end
    expect(_foldSpecialDayRanges([
        createRange("2020-05-01", ["10:00", "12:00"]),
    ])).toStrictEqual([
        {
            start: createRange("2020-05-01", ["10:00", "12:00"]),
            end: createRange("2020-05-01", ["10:00", "12:00"]),
        },
    ]);

    // one continues range
    expect(_foldSpecialDayRanges([
        createRange("2020-05-01", ["10:00", "12:00"]),
        createRange("2020-05-02", ["10:00", "12:00"]),
        createRange("2020-05-03", ["10:00", "12:00"]),
        createRange("2020-05-04", ["10:00", "12:00"]),
    ])).toStrictEqual([
        {
            start: createRange("2020-05-01", ["10:00", "12:00"]),
            end: createRange("2020-05-04", ["10:00", "12:00"]),
        },
    ]);
});

test("test two day ranges", () => {
    expect(_foldSpecialDayRanges([
        createRange("2020-05-01", ["10:00", "12:00"]),
        createRange("2020-05-02", ["10:00", "12:00"]),
        createRange("2020-05-03", []),
        createRange("2020-05-04", []),
    ])).toStrictEqual([
        {
            start: createRange("2020-05-01", ["10:00", "12:00"]),
            end: createRange("2020-05-02", ["10:00", "12:00"]),
        },
        {
            start: createRange("2020-05-03", []),
            end: createRange("2020-05-04", []),
        },
    ]);
    expect(_foldSpecialDayRanges([
        createRange("2020-05-01", ["10:00", "12:00"]),
        createRange("2020-05-02", ["10:00", "12:00"]),
        createRange("2020-06-01", []),
        createRange("2020-06-02", []),
    ])).toStrictEqual([
        {
            start: createRange("2020-05-01", ["10:00", "12:00"]),
            end: createRange("2020-05-02", ["10:00", "12:00"]),
        },
        {
            start: createRange("2020-06-01", []),
            end: createRange("2020-06-02", []),
        },
    ]);
});

test("test ranges with multiple frames", () => {
    expect(_foldSpecialDayRanges([
        createRange("2020-05-05", ["10:00", "12:00", "15:45", "16:50"]),
        createRange("2099-01-01", ["10:00", "12:00", "15:45", "16:50"]),
        createRange("2099-01-02", ["10:00", "12:00", "15:45", "16:50"]),
        createRange("2099-01-03", ["10:00", "12:00", "15:45", "16:50"]),
        createRange("2099-01-04", ["10:00", "12:00", "15:45", "16:50"]),
        createRange("2099-01-05", ["10:00", "12:00", "15:45", "16:50"]),
        createRange("2020-05-01", ["10:00", "12:00", "15:45", "27:00"]),
        createRange("2020-05-02", ["10:00", "12:00", "15:45", "27:00"]),
        createRange("2020-05-03", ["10:00", "12:00", "15:45", "27:00"]),
    ])).toStrictEqual([
        {
            start: createRange("2020-05-01", ["10:00", "12:00", "15:45", "27:00"]),
            end: createRange("2020-05-03", ["10:00", "12:00", "15:45", "27:00"]),
        },
        {
            start: createRange("2020-05-05", ["10:00", "12:00", "15:45", "16:50"]),
            end: createRange("2020-05-05", ["10:00", "12:00", "15:45", "16:50"]),
        },
        {
            start: createRange("2099-01-01", ["10:00", "12:00", "15:45", "16:50"]),
            end: createRange("2099-01-05", ["10:00", "12:00", "15:45", "16:50"]),
        },
    ]);
});

test("test all closed ranges", () => {
    expect(_foldSpecialDayRanges([
        createRange("2018-08-23", []),
        createRange("2018-08-24", []),
        createRange("2018-08-27", []),
        createRange("2018-08-28", []),
        createRange("2018-08-29", []),
        createRange("2018-09-19", []),
        createRange("2018-09-20", []),
        createRange("2018-09-21", []),
    ])).toStrictEqual([
        {
            start: createRange("2018-08-23", []),
            end: createRange("2018-08-24", []),
        },
        {
            start: createRange("2018-08-27", []),
            end: createRange("2018-08-29", []),
        },
        {
            start: createRange("2018-09-19", []),
            end: createRange("2018-09-21", []),
        },
    ]);
});
