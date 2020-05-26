import {OpeningHours} from "../src/openinghours";
import {WeekdayFormat} from "../src/types";

test("nothing to fold", () => {
    let bh = new OpeningHours({
        mon: ["10:00", "20:00"],
        tue: ["11:00", "20:00"],
        wed: ["12:00", "20:00"],
        thu: ["13:00", "20:00"],
        fri: ["14:00", "20:00"],
        sat: ["15:00", "20:00"],
        sun: ["16:00", "20:00"],
        hol: ["17:00", "20:00"],
    }, "UTC");

    expect(bh.fold({
        locale: "en-US"
    })).toBe(`Mon: 10:00 to 20:00
Tue: 11:00 to 20:00
Wed: 12:00 to 20:00
Thu: 13:00 to 20:00
Fri: 14:00 to 20:00
Sat: 15:00 to 20:00
Sun: 16:00 to 20:00
Holidays: 17:00 to 20:00`);
});

test("fold everything", () => {
    let bh = new OpeningHours({
        mon: ["10:00", "20:00"],
        tue: ["10:00", "20:00"],
        wed: ["10:00", "20:00"],
        thu: ["10:00", "20:00"],
        fri: ["10:00", "20:00"],
        sat: ["10:00", "20:00"],
        sun: ["10:00", "20:00"],
        hol: ["10:00", "20:00", "22:00", "23:30"],
    }, "UTC");

    expect(bh.fold({
        hyphen: " – ",
        delimiter: ", ",
        timeFrameFormat: "{start} bis {end} Uhr",
        timeFrameDelimiter: " und ",
        locale: "de-AT",
        holidayPrefix: "Feiertags",
        weekdayFormat: WeekdayFormat.long,
    })).toBe(`Montag – Sonntag: 10:00 bis 20:00 Uhr\nFeiertags: 10:00 bis 20:00 Uhr und 22:00 bis 23:30 Uhr`);
});

test("fold overlong", () => {
    let bh = new OpeningHours({
        mon: ["02:00", "17:30", "20:00", "26:05"],
        tue: ["02:00", "17:30", "20:00", "26:05"],
        wed: ["02:00", "17:30", "20:00", "26:05"],
        thu: ["02:00", "17:30", "20:00", "26:05"],
        fri: ["02:00", "17:30", "20:00", "26:05"],
        sat: ["02:00", "17:30", "20:00", "26:05"],
        sun: ["02:00", "17:30", "20:00", "26:05"],
    }, "UTC");

    expect(bh.fold({
        hyphen: " – ",
        delimiter: ", ",
        timeFrameFormat: "{start} bis {end} Uhr",
        timeFrameDelimiter: " und ",
        locale: "de-AT",
        holidayPrefix: "Feiertags",
        weekdayFormat: WeekdayFormat.long,
    })).toBe(`Montag – Sonntag: 02:00 bis 17:30 Uhr und 20:00 bis 02:05 Uhr`);
});

test("fold with special days", () => {
    let oh = new OpeningHours({
        "mon": [
            "09:00",
            "12:00",
            "15:00",
            "19:00",
        ],
        "tue": [
            "08:00",
            "13:00",
        ],
        "wed": [
            "08:00",
            "11:00",
        ],
        "thu": [
            "14:00",
            "19:00",
        ],
        "fri": [
            "08:00",
            "11:00",
        ],
        "sat": [],
        "sun": [],
        "hol": [],
        "2018-08-23": [],
        "2018-08-24": [],
        "2018-08-27": [],
        "2018-08-28": [],
        "2018-08-29": [],
        "2018-09-19": [],
        "2018-09-20": [],
        "2018-09-21": [],
    }, "UTC");

    expect(oh.fold({
        hyphen: " – ",
        delimiter: ", ",
        timeFrameFormat: "{start} bis {end} Uhr",
        timeFrameDelimiter: " und ",
        locale: "de-AT",
        holidayPrefix: "Feiertags",
        weekdayFormat: WeekdayFormat.long,
        closedPlaceholder: "geschlossen",
        specialDates: {
            from: new Date(2018, 0, 1)
        }
    })).toBe(`Montag: 09:00 bis 12:00 Uhr und 15:00 bis 19:00 Uhr
Dienstag: 08:00 bis 13:00 Uhr
Mittwoch, Freitag: 08:00 bis 11:00 Uhr
Donnerstag: 14:00 bis 19:00 Uhr
Feiertags: geschlossen
2018-08-23: geschlossen
2018-08-24: geschlossen
2018-08-27: geschlossen
2018-08-28: geschlossen
2018-08-29: geschlossen
2018-09-19: geschlossen
2018-09-20: geschlossen
2018-09-21: geschlossen`);

expect(oh.fold({
    hyphen: " – ",
    delimiter: ", ",
    timeFrameFormat: "{start} bis {end} Uhr",
    timeFrameDelimiter: " und ",
    locale: "de-AT",
    holidayPrefix: "Feiertags",
    weekdayFormat: WeekdayFormat.long,
    closedPlaceholder: "geschlossen",
    specialDates: {
        format: "yyyy -- M .. dd",
        from: new Date(2018, 7, 28),
        to: new Date(2018, 8, 19),
    }
})).toBe(`Montag: 09:00 bis 12:00 Uhr und 15:00 bis 19:00 Uhr
Dienstag: 08:00 bis 13:00 Uhr
Mittwoch, Freitag: 08:00 bis 11:00 Uhr
Donnerstag: 14:00 bis 19:00 Uhr
Feiertags: geschlossen
2018 -- 8 .. 28: geschlossen
2018 -- 8 .. 29: geschlossen
2018 -- 9 .. 19: geschlossen`);

    expect(oh.fold({
        hyphen: " – ",
        delimiter: ", ",
        timeFrameFormat: "{start} bis {end} Uhr",
        timeFrameDelimiter: " und ",
        locale: "de-AT",
        holidayPrefix: "Feiertags",
        weekdayFormat: WeekdayFormat.long,
        closedPlaceholder: "geschlossen",
        specialDates: {
            format: "yyyy -- M .. dd",
            from: new Date(2020, 7, 28),
            to: new Date(2018, 8, 19),
        }
    })).toBe(`Montag: 09:00 bis 12:00 Uhr und 15:00 bis 19:00 Uhr
Dienstag: 08:00 bis 13:00 Uhr
Mittwoch, Freitag: 08:00 bis 11:00 Uhr
Donnerstag: 14:00 bis 19:00 Uhr
Feiertags: geschlossen`);

    oh = new OpeningHours({
        "mon": [
            "09:00",
            "12:00",
            "15:00",
            "19:00",
        ],
        "tue": [
            "08:00",
            "13:00",
        ],
        "wed": [
            "08:00",
            "11:00",
        ],
        "thu": [
            "14:00",
            "19:00",
        ],
        "fri": [
            "08:00",
            "11:00",
        ],
        "sat": [],
        "sun": [],
        "2018-08-23": [],
        "2018-08-24": [],
        "2018-08-27": [],
        "2018-08-28": [],
        "2018-08-29": [],
        "2018-09-19": [],
        "2018-09-20": [],
        "2018-09-21": [],
    }, "UTC");

    expect(oh.fold({
        hyphen: " – ",
        delimiter: ", ",
        timeFrameFormat: "{start} bis {end} Uhr",
        timeFrameDelimiter: " und ",
        locale: "de-AT",
        holidayPrefix: "Feiertags",
        weekdayFormat: WeekdayFormat.long,
        closedPlaceholder: "geschlossen",
        specialDates: {
            from: new Date(2018, 0, 1)
        }
    })).toBe(`Montag: 09:00 bis 12:00 Uhr und 15:00 bis 19:00 Uhr
Dienstag: 08:00 bis 13:00 Uhr
Mittwoch, Freitag: 08:00 bis 11:00 Uhr
Donnerstag: 14:00 bis 19:00 Uhr
2018-08-23: geschlossen
2018-08-24: geschlossen
2018-08-27: geschlossen
2018-08-28: geschlossen
2018-08-29: geschlossen
2018-09-19: geschlossen
2018-09-20: geschlossen
2018-09-21: geschlossen`);
});

test("folds special days correctly", () => {
    const ohSimple = new OpeningHours({
        "2099-01-01": [
            "13:00",
            "20:00",
        ],
        "2099-01-02": [
            "13:00",
            "22:00",
        ],
    }, "UTC");
    expect(ohSimple.fold({
        hyphen: " – ",
        delimiter: ", ",
        timeFrameFormat: "{start} bis {end} Uhr",
        timeFrameDelimiter: " und ",
        locale: "de-AT",
        holidayPrefix: "Feiertags",
        weekdayFormat: WeekdayFormat.long,
    })).toBe(`2099-01-01: 13:00 bis 20:00 Uhr\n2099-01-02: 13:00 bis 22:00 Uhr`);
});

test("folds holidays correctly", () => {
    const ohSimple = new OpeningHours({
        "mon": [
            "13:00",
            "20:00",
        ],
        "tue": [
            "13:00",
            "20:00",
        ],
        "wed": [
            "13:00",
            "20:00",
        ],
        "thu": [
            "13:00",
            "20:00",
        ],
        "fri": [
            "13:00",
            "20:00",
        ],
        "sat": [
            "13:00",
            "20:00",
        ],
        "sun": [
            "13:00",
            "20:00",
        ],
        "hol": [
            "13:00",
            "20:00",
        ],
    }, "UTC");
    expect(ohSimple.fold({
        hyphen: " – ",
        delimiter: ", ",
        timeFrameFormat: "{start} bis {end} Uhr",
        timeFrameDelimiter: " und ",
        locale: "de-AT",
        holidayPrefix: "Feiertags",
        weekdayFormat: WeekdayFormat.long,
    })).toBe(`Montag – Sonntag: 13:00 bis 20:00 Uhr\nFeiertags: 13:00 bis 20:00 Uhr`);

    const ohComplex = new OpeningHours({
        "mon": [
            "13:00",
            "20:00",
        ],
        "tue": [
            "13:00",
            "20:00",
        ],
        "wed": [
            "13:00",
            "20:00",
        ],
        "thu": [
            "13:00",
            "20:00",
        ],
        "fri": [
            "13:00",
            "20:00",
        ],
        "sat": [
            "13:00",
            "20:00",
        ],
        "sun": [
            "13:00",
            "20:00",
        ],
        "hol": [
            "12:00",
            "19:00",
        ],
    }, "UTC");
    expect(ohComplex.fold({
        hyphen: " – ",
        delimiter: ", ",
        timeFrameFormat: "{start} bis {end} Uhr",
        timeFrameDelimiter: " und ",
        locale: "de-AT",
        holidayPrefix: "Feiertags",
        weekdayFormat: WeekdayFormat.long,
    })).toBe(`Montag – Sonntag: 13:00 bis 20:00 Uhr\nFeiertags: 12:00 bis 19:00 Uhr`);

    const ohComplexWithSpecials = new OpeningHours({
        "mon": [
            "13:00",
            "20:00",
        ],
        "tue": [
            "13:00",
            "20:00",
        ],
        "wed": [
            "13:00",
            "20:00",
        ],
        "thu": [
            "13:00",
            "20:00",
        ],
        "fri": [
            "13:00",
            "20:00",
        ],
        "sat": [
            "13:00",
            "20:00",
        ],
        "sun": [
            "13:00",
            "20:00",
        ],
        "hol": [
            "12:00",
            "19:00",
        ],
        "2099-01-01": [
            "11:00",
            "12:00",
        ],
        "2099-01-02": [
            "14:00",
            "19:00",
        ],
        "2020-01-01": [
            "14:00",
            "19:00",
        ],
    }, "UTC");
    expect(ohComplexWithSpecials.fold({
        hyphen: " – ",
        delimiter: ", ",
        timeFrameFormat: "{start} bis {end} Uhr",
        timeFrameDelimiter: " und ",
        locale: "de-AT",
        holidayPrefix: "Feiertags",
        weekdayFormat: WeekdayFormat.long,
    })).toBe(`Montag – Sonntag: 13:00 bis 20:00 Uhr
Feiertags: 12:00 bis 19:00 Uhr
2099-01-01: 11:00 bis 12:00 Uhr
2099-01-02: 14:00 bis 19:00 Uhr`);
});
