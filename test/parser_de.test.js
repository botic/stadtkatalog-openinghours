const parseHours = require("../lib/parser");

test("test simple opening hour string with range over weekdays", () => {
    expect(
        parseHours("MO: 07:15 - 19:30\nDI: 07:15 - 19:30\nMI: 07:15 - 19:30\nDO: 07:15 - 19:30\nFR: 07:15 - 19:30\nSA: 07:15 - 18:00")
    ).toEqual({
        "mon": ["07:15", "19:30"],
        "tue": ["07:15", "19:30"],
        "wed": ["07:15", "19:30"],
        "thu": ["07:15", "19:30"],
        "fri": ["07:15", "19:30"],
        "sat": ["07:15", "18:00"],
    });
});

test("test simple opening hour string with just one day", () => {
    expect(
        parseHours("So: 0:00 - 20:00")
    ).toEqual({
        "sun": ["00:00", "20:00"]
    });
});

test("test simple opening hour string with holiday", () => {
    expect(
        parseHours("So: 0:00 - 20:00, Feiertags: 10:00 - 11:00")
    ).toEqual({
        "sun": ["00:00", "20:00"],
        "hol": ["10:00", "11:00"]
    });
});

test("test simple opening hour string with multiple ranges", () => {
    expect(
        parseHours("So: 0:00 - 5:00, 8:00 - 10:00, 20:00 - 23:00")
    ).toEqual({
        "sun": ["00:00", "05:00", "08:00", "10:00", "20:00", "23:00"],
    });
});

test("test overlong day", () => {
    expect(
        parseHours("Mo: 07:00 - 01:00, Di: 07:00 - 01:00, Mi: 07:00 - 01:00, Do: 07:00 - 01:00, Fr: 07:00 - 05:00, Sa: 07:00 - 05:00, So: 10:00 - 22:00")
    ).toEqual({
        "mon": ["07:00", "25:00"],
        "tue": ["07:00", "25:00"],
        "wed": ["07:00", "25:00"],
        "thu": ["07:00", "25:00"],
        "fri": ["07:00", "29:00"],
        "sat": ["07:00", "29:00"],
        "sun": ["10:00", "22:00"]
    });
});

test("test overlong day with multiple frames", () => {
    expect(
        parseHours("Di: 07:00 - 20:00, 22:00 - 01:00")
    ).toEqual({
        "tue": ["07:00", "20:00", "22:00", "25:00"]
    });
});

test("test overlong day with multiple frames", () => {
    expect(
        parseHours("Di: 07:00 - 20:00, 22:00 - 10:00, Mi: 08:00 - 12:00")
    ).toEqual({
        "tue": ["07:00", "20:00", "22:00", "34:00"],
        "wed": ["08:00", "12:00"]
    });
});

test("test 24:00 day end", () => {
    expect(
        parseHours("Di: 07:00 - 20:00, 22:00 - 24:00")
    ).toEqual({
        "tue": ["07:00", "20:00", "22:00", "24:00"]
    });
});
