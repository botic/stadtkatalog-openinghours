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
