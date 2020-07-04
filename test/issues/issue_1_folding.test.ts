import {OpeningHours} from "../../src/openinghours";
import {WeekdayFormat} from "../../src/types";

test("issue 1", () => {
    let bh = new OpeningHours({
        "mon": [],
        "tue": [
            "11:00",
            "18:00"
        ],
        "wed": [
            "11:00",
            "18:00"
        ],
        "thu": [
            "11:00",
            "18:00"
        ],
        "fri": [
            "11:00",
            "18:00"
        ],
        "sat": [
            "09:00",
            "17:00"
        ],
        "sun": [],
        "hol": [],
        "2020-06-29": [],
        "2020-06-30": [],
        "2020-07-01": [],
        "2020-07-02": [],
        "2020-07-03": [],
        "2020-07-04": []
    }, "UTC");

    expect(bh.isOpenAt(new Date(Date.UTC(2020, 6, 1, 9, 30, 0, 0)))).toBe(false);

    expect(bh.fold({
        hyphen: " – ",
        delimiter: ", ",
        timeFrameFormat: "{start} bis {end} Uhr",
        timeFrameDelimiter: " und ",
        locale: "de-AT",
        holidayPrefix: "Feiertags",
        closedPlaceholder: "Geschlossen",
        weekdayFormat: WeekdayFormat.long,
        specialDates: {
            from: new Date(2020, 5, 0),
            format: "dd.MM.yyyy",
        },
    })).toBe(`Dienstag – Freitag: 11:00 bis 18:00 Uhr\nSamstag: 09:00 bis 17:00 Uhr\nFeiertags: Geschlossen\n29.06.2020 – 04.07.2020: Geschlossen`);
});
