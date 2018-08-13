const OpeningHours = require("../../src/lib/openinghours");

test("test previous day is overlong", () => {
    let bh = new OpeningHours({ fri: ["10:00", "28:00"] }, "UTC");
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 9)))).toBe(null);
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 10)))).toBe("fri");
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 11)))).toBe(null);
    expect(bh.hours.fri).toHaveLength(2);
});

test("test previous day is overlong with multiple ranges", () => {
    let bh = new OpeningHours({ fri: ["10:00", "12:00", "14:00", "28:00"] }, "UTC");
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 9)))).toBe(null);
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 10)))).toBe("fri");
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 11)))).toBe(null);
    expect(bh.hours.fri).toHaveLength(4);
});

test("test 24/7", () => {
    let bh = new OpeningHours({ fri: ["00:00", "24:00"] }, "UTC");
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 9)))).toBe(null);
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 10)))).toBe("fri");
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 11)))).toBe(null);
    expect(bh.hours.fri).toHaveLength(2);
});

test("test preceding is holiday", () => {
    let bh = new OpeningHours({ fri: ["10:00", "18:00"], hol: ["10:00", "26:00"] }, "UTC", ["2016-09-09"]);
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 9)))).toBe(null);
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 10)))).toBe("hol");
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 11)))).toBe(null);
    expect(bh.hours.fri).toHaveLength(2);
});

test("test preceding closed", () => {
    let bh = new OpeningHours({ thu: [], fri: [], sat: [] }, "UTC");
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 9)))).toBe(null);
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 10)))).toBe(null);
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 11)))).toBe(null);
    expect(bh.hours.fri).toHaveLength(0);
});

test("test preceding undefined", () => {
    let bh = new OpeningHours({ tue: [], sat: [] }, "UTC");
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 9)))).toBe(null);
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 10)))).toBe(null);
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 11)))).toBe(null);
});

test("test preceding unknown hours", () => {
    let bh = new OpeningHours({ }, "UTC");
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 9)))).toBe(null);
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 10)))).toBe(null);
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 11)))).toBe(null);
});

test("test preceding day with timezones", () => {
    let bh = new OpeningHours({ fri: ["12:00", "25:00"] }, "UTC+10");

    // friday 00.00 in UTC+10
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 8, 14, 0)))).toBe(null);
    // friday 18.00 in UTC+10
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 9, 8, 0)))).toBe(null);
    // friday 23.59 in UTC+10
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 9, 13, 59)))).toBe(null);

    // ====== only saturday has an overlong preceding day ======
    // saturday 00.00 in UTC+10
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 9, 14, 0)))).toBe("fri");
    // saturday 20.00 in UTC+10
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 10, 10, 0)))).toBe("fri");
    // saturday 23.59 in UTC+10
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 10, 13, 59)))).toBe("fri");

    // sunday in UTC+10
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 10, 14, 0)))).toBe(null);
    expect(bh.getOverlongPrecedingWeekdayKey(new Date(Date.UTC(2016, 8, 10, 14, 1)))).toBe(null);
});

// fixme: add test with overlong preceding holiday and timezones
